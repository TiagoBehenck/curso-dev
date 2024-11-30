
import database from 'infra/database'
import { beforeAll, expect, test } from 'vitest'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public;')
}


test('POST to /api/v1/migrations should return 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations', { 
    method: 'POST'
  })
  
  expect(response.status).toBe(200);

  const responseBody = await response.json()
  expect(Array.isArray(responseBody)).toBe(true)

  await Promise.all(responseBody.map(async (migration) => {
    expect(migration).toHaveProperty('name');
    expect(typeof migration.name).toBe('string');

    const result = await database.query({
      text: 'SELECT count(*)::int FROM public.pgmigrations WHERE name = $1;',
      values: [migration.name]
    })

    const migrationCount = result.rows[0].count
    expect(migrationCount).toBeGreaterThan(0);
  }))
})