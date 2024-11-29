import migrationRunner, { RunnerOption } from 'node-pg-migrate'
import { NextResponse } from 'next/server'
import { join } from 'path'

import { env } from 'env'

export async function GET() {
  const migrations = await migrationRunner({
    databaseUrl: env.DATABASE_URL,
    dir: join('infra', 'migrations'),
    direction: 'up',
    migrationsTable: 'pgmigrations',
    verbose: true,
    dryRun: true,
  })
  
  return NextResponse.json(migrations, { status: 200 })
}

export async function POST() {
  const migrations = await migrationRunner({
    databaseUrl: env.DATABASE_URL,
    dir: join('infra', 'migrations'),
    direction: 'up',
    migrationsTable: 'pgmigrations',
    verbose: true,
    dryRun: false,
  })

  return NextResponse.json(migrations, { status: 200 })
}