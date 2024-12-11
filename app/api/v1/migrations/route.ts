import type { RunnerOptionConfig } from "node-pg-migrate/dist/types";
import type { RunMigration } from "node-pg-migrate/dist/migration";
import migrationRunner from "node-pg-migrate";
import { NextResponse } from "next/server";
import { resolve } from "node:path";

import database from "infra/database";

const defaultMigratioOptions: RunnerOptionConfig = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
  verbose: true,
  dryRun: true,
};

async function runMigration({
  dryRun = true,
  ...rest
}: Partial<RunnerOptionConfig> = {}): Promise<{ migrations: RunMigration[] }> {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migrations = await migrationRunner({
      ...defaultMigratioOptions,
      ...rest,
      dbClient,
      dryRun,
    });

    return { migrations };
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}

export async function GET() {
  try {
    const { migrations: pendingMigrations } = await runMigration();

    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Migration check failed", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const { migrations: migratedMigrations } = await runMigration({
      dryRun: false,
    });

    const hasMigrations = migratedMigrations.length > 0;

    return NextResponse.json(migratedMigrations, {
      status: hasMigrations ? 201 : 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Migration execution failed", details: error.message },
      { status: 500 },
    );
  }
}
