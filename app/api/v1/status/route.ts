import database from 'infra/database'
import { NextResponse } from 'next/server'

export async function GET() {
  const updatedAt = new Date().toISOString()
  const version = await database.getVersion()
  const maxConnections = await database.getMaxConnection()
  const openedConnections = await database.getOpenedConnections()

  return NextResponse.json(
    {
      updated_at: updatedAt,
      dependecies: {
        database: {
          potgres_version: version,
          max_connections: maxConnections,
          opened_connections: openedConnections,
        },
      },
    },
    { status: 200 }
  )
}
