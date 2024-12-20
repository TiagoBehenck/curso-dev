import { expect, test } from 'vitest'

test('GET to /api/v1/migrations should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations')

  expect(response.status).toBe(200)

  const responseBody = await response.json()

  expect(Array.isArray(responseBody)).toBe(true)
  expect(responseBody.length).toBeGreaterThan(0)

  const migration = responseBody[0]

  expect(migration).toHaveProperty('path')
  expect(migration).toHaveProperty('name')
  expect(migration).toHaveProperty('timestamp')

  expect(typeof migration.path).toBe('string')
  expect(typeof migration.name).toBe('string')
  expect(typeof migration.timestamp).toBe('number')
})
