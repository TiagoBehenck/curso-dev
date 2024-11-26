import { Client } from 'pg'

import { env } from '../env'

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  })

  try {
    await client.connect()
    const result = await client.query(queryObject)
    return result
  } catch (err) { 
    console.error(err)
  } finally  {
    await client.end()
  }
}

async function getMaxConnection() {
  const result = await query('SHOW max_connections;')

  return Number(result.rows[0].max_connections)
}

async function getVersion() {
  const result = await query('SHOW server_version')
  
  return result.rows[0].server_version as string
}

async function getOpenedConnections() {
  const result = await query({
    text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [env.POSTGRES_DB]
  })

  return result.rows[0].count as number
}

export default {
  query,
  getMaxConnection,
  getVersion,
  getOpenedConnections,
}