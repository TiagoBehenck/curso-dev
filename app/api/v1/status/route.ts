import { InternalServerError } from 'infra/errors'
import {
  getVersion,
  getMaxConnection,
  getOpenedConnections,
} from 'infra/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    })

    console.log('\n Erro dentro do catch do controller')
    console.error(publicErrorObject.message)

    return NextResponse.json(
      { error: 'Failed to get status', details: publicErrorObject },
      { status: 500 }
    )
  }
}
