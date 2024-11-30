import { Client } from 'pg'

import { env } from '../env'

async function query(queryObject) {
  const client = new Client({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    database: env.POSTGRES_DB,
    password: env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  })

  try {
    await client.connect()
    const result = await client.query(queryObject)
    return result
  } catch (err) { 
    console.error(err)
    throw err
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

function getSSLValues() {
  if (env.POSTGRES_CA) {
    return { 
      ca: env.POSTGRES_CA,
    }
  }

  return process.env.NODE_ENV === 'production' ? true : false
}

export default {
  query,
  getMaxConnection,
  getVersion,
  getOpenedConnections,
  getSSLValues,
}