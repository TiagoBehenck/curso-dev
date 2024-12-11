import database from 'infra/database'
import { expect, test } from 'vitest'

test('POST to /api/v1/migrations should return 200', async () => {
  const response1 = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  })

  expect(response1.status).toBe(201)

  const responseBody = await response1.json()
  expect(Array.isArray(responseBody)).toBe(true)

  await Promise.allSettled(
    responseBody.map(async (migration) => {
      expect(migration).toHaveProperty('name')
      expect(typeof migration.name).toBe('string')

      const result = await database.query({
        text: 'SELECT count(*)::int FROM public.pgmigrations WHERE name = $1;',
        values: [migration.name],
      })

      const migrationCount = result.rows[0].count
      expect(migrationCount).toBeGreaterThan(0)

      const response2 = await fetch('http://localhost:3000/api/v1/migrations', {
        method: 'POST',
      })

      expect(response2.status).toBe(200)

      const response2Body = await response2.json()

      expect(Array.isArray(response2Body)).toBe(true)
      expect(response2Body.length).toBe(0)
    }),
  )
})
