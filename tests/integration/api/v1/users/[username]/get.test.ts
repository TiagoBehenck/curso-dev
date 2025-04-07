import { beforeAll, describe, expect, test } from 'vitest'
import { version as uuidVersion } from 'uuid'

import { runPendingMigrations } from 'models/migrator'

beforeAll(async () => {
  await runPendingMigrations()
})

describe('GET /api/v1/users/[username]', () => {
  describe('Anonymous user', () => {
    test('With exact case match', async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Tiago',
          email: 'tiago@tiago.com',
          password: 'password123',
        }),
      })

      expect(response.status).toBe(201)

      const response2 = await fetch('http://localhost:3000/api/v1/users/Tiago')

      expect(response2.status).toBe(200)

      const response2Body = await response.json()

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: 'Tiago',
        email: 'tiago@tiago.com',
        password: 'password123',
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      })

      expect(uuidVersion(response2Body.id)).toBe(4)
      expect(Date.parse(response2Body.created_at)).not.toBeNaN()
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN()
    })

    test('With exact case missmatch', async () => {
      const response = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Missmatch',
          email: 'missmatch@missmatch.com',
          password: 'password123',
        }),
      })

      expect(response.status).toBe(201)

      const response2 = await fetch(
        'http://localhost:3000/api/v1/users/missmatch'
      )

      expect(response2.status).toBe(200)

      const response2Body = await response.json()

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: 'Missmatch',
        email: 'missmatch@missmatch.com',
        password: 'password123',
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      })

      expect(uuidVersion(response2Body.id)).toBe(4)
      expect(Date.parse(response2Body.created_at)).not.toBeNaN()
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN()
    })

    test('With nonexistent username', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/users/nonexistent'
      )

      expect(response.status).toBe(404)

      const response2Body = await response.json()

      expect(response2Body).toEqual({
        name: 'NotFoundError',
        message: 'User not found',
        action: 'Try another username',
        status_code: 404,
      })
    })
  })
})
