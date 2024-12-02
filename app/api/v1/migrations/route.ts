import migrationRunner, { RunnerOption } from 'node-pg-migrate'
import { NextResponse } from 'next/server'
import { join } from 'path'

import { env } from 'env'

const defaultMigratioOptions: RunnerOption = {
  databaseUrl: env.DATABASE_URL,
  dir: join('infra', 'migrations'),
  direction: 'up',
  migrationsTable: 'pgmigrations',
  verbose: true,
  dryRun: true,
}

export async function GET() {
  const pendingMigrations = await migrationRunner(defaultMigratioOptions)
  
  return NextResponse.json(pendingMigrations, { status: 200 })
}

export async function POST() {
  const migratedMigrations = await migrationRunner({
    ...defaultMigratioOptions,
    dryRun: false,
  })

  const hasMigrations = migratedMigrations.length > 0
  
  return NextResponse.json(
    migratedMigrations, 
    { status: hasMigrations ? 201 : 200 }
  )
}