import crypto from 'node:crypto'

import { query } from 'infra/database'

type QueryValues = {
  token: string
  userId: string
  expiresAt: Date
}

type Session = {
  id: string
  token: string
  user_id: string
  expires_at: string
  created_at: string
  updated_at: string
}

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000 // 30 days

async function create(userId: string): Promise<Session> {
  const token = generateToken()
  const expiresAt = generateExpiresAt()
  const newSession = await runInsertQuery({ token, userId, expiresAt })

  return newSession

  function generateToken() {
    return crypto.randomBytes(48).toString('hex')
  }

  function generateExpiresAt() {
    return new Date(Date.now() + EXPIRATION_IN_MILLISECONDS)
  }

  async function runInsertQuery({
    token,
    userId,
    expiresAt,
  }: QueryValues): Promise<Session> {
    const results = await query({
      text: `
        INSERT INTO
          sessions (token, user_id, expires_at)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [token, userId, expiresAt],
    })

    return results.rows[0] as Session
  }
}

export const session = {
  create,
  EXPIRATION_IN_MILLISECONDS,
}
