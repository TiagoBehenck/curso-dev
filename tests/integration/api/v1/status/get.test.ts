import { expect, test } from 'vitest'

test('GET to /api/v1/status should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status')
  
  expect(response.status).toBe(200);

  const responseBody = await response.json()

  expect(responseBody.updated_at).toBeDefined()
  expect(responseBody.dependecies.potgres_version).toBeDefined()
  expect(responseBody.dependecies.max_connections).toBeDefined()
  expect(responseBody.dependecies.opened_connections).toBeDefined()

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString()
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt)
  
  expect(responseBody.dependecies.potgres_version).toBe("16.0")
  expect(responseBody.dependecies.max_connections).toBe(100)
  expect(responseBody.dependecies.opened_connections).toBe(1)
})