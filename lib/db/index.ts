import "server-only";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL ?? "";
export const isDatabaseConfigured = Boolean(databaseUrl);

/** Shared Neon-compatible pool; connections are opened lazily at runtime. */
export const db = new Pool({
  connectionString: databaseUrl || undefined,
  ssl: databaseUrl ? { rejectUnauthorized: false } : undefined,
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});
