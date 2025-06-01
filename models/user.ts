import { query } from 'infra/database'
import { password as modelPassword } from 'models/password'
import { NotFoundError, ValidationError } from 'infra/errors'

export type UserInputValues = {
  username: string
  email: string
  password: string
}

type UpdateUser = UserInputValues & {
  id: string
}

async function create({ username, email, password }: UserInputValues) {
  await validateUniqueUsername(username)
  await validateUniqueEmail(email)
  const hashPassword = await hashPasswordInObject(password)

  const newUser = await runInsertQuery({
    username,
    email,
    password: hashPassword,
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

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: 'The username has been taken.',
      action: 'Try another username',
      cause: results,
    })
  }
}

async function update(username: string, userInputValues: UserInputValues) {
  const currentUser = await findOneByUsername(username)
  let password = currentUser.password
  const sameUsername =
    currentUser.username.toLocaleLowerCase() ===
    userInputValues?.username?.toLocaleLowerCase()

  if (userInputValues.username && !sameUsername) {
    await validateUniqueUsername(userInputValues.username)
  }

  if (userInputValues.email) {
    await validateUniqueEmail(userInputValues.email)
  }

  if (userInputValues.password) {
    password = await hashPasswordInObject(userInputValues.password)
  }

  const userWithNewValues = {
    ...currentUser,
    ...userInputValues,
    password,
  }

  const updatedUser = await runUpdateQuery(userWithNewValues)

  return updatedUser

  async function runUpdateQuery({ id, username, email, password }: UpdateUser) {
    const result = await query({
      text: `
        UPDATE
         users
        SET
          username = $2,
          email = $3,
          password = $4,
          updated_at = timezone('utc', now())
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [`${id}`, `${username}`, `${email}`, `${password}`],
    })

    return result.rows[0]
  }
}

async function hashPasswordInObject(password: string) {
  return await modelPassword.hash(password)
}

export const user = {
  create,
  findOneByUsername,
  update,
}
