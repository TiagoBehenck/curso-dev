import retry from 'async-retry'
import { query } from 'infra/database'
import { runPendingMigrations as modelRunPendingMigrations } from 'models/migrator'

export async function waitForAllServices() {
  await waitForWebServer()
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  })
}

async function fetchStatusPage() {
  const response = await fetch('http://localhost:3000/api/v1/status')
  if (response.status !== 200) {
    throw Error()
  }
}

export async function cleanDatabase() {
  await query('drop schema public cascade; create schema public;')
}

export async function runPendingMigrations() {
  await modelRunPendingMigrations()
}
