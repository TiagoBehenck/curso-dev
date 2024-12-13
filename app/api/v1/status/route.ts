import {
  getVersion,
  getMaxConnection,
  getOpenedConnections,
} from 'infra/database'
import { NextResponse } from 'next/server'

export async function GET() {
  const updatedAt = new Date().toISOString()
  const version = await getVersion()
  const maxConnections = await getMaxConnection()
  const openedConnections = await getOpenedConnections()

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
