import { query } from 'infra/database'
import { NotFoundError, ValidationError } from 'infra/errors'

export type UserInputValues = {
  username: string
  email: string
  password: string
}

async function create({ username, email, password }: UserInputValues) {
  await validateUniqueEmail(email)
  await validateUniqueUsername(username)

  const newUser = await runInsertQuery({
    username,
    email,
    password,
  })

  return newUser

  async function runInsertQuery({
    username,
    email,
    password,
  }: UserInputValues) {
    const newUser = await query({
      text: `
        INSERT INTO 
          users (username, email, password)
        VALUES 
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [`${username}`, `${email}`, `${password}`],
    })

    return newUser.rows[0]
  }

  async function validateUniqueEmail(email: string) {
    const results = await query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(TRIM(email)) = LOWER(TRIM($1))
        LIMIT
          1
        ;`,
      values: [email],
    })

    console.log(results)

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: 'The email has been taken.',
        action: 'Try another email',
        cause: 'EMAIL_TAKEN',
      })
    }
  }

  async function validateUniqueUsername(username: string) {
    const results = await query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(TRIM(username)) = LOWER(TRIM($1))
        LIMIT
          1
        ;`,
      values: [username],
    })

    console.log(results)

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: 'The username has been taken.',
        action: 'Try another username',
        cause: results,
      })
    }
  }
}

async function findOneByUsername(username: string) {
  const user = await query({
    text: `
      SELECT
        *
      FROM
        users
      WHERE
        LOWER(TRIM(username)) = LOWER(TRIM($1))
      LIMIT
        1
      ;`,
    values: [username],
  })

  if (user.rowCount === 0) {
    throw new NotFoundError({
      message: 'User not found',
      action: 'Try another username',
      cause: 'USER_NOT_FOUND',
    })
  }

  return user.rows[0]
}

const user = {
  create,
  findOneByUsername,
}

export default user
