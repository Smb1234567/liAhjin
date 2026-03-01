import { neon } from '@neondatabase/serverless';

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || '';

export function getDb() {
  if (!connectionString) {
    throw new Error('Missing NEON_DATABASE_URL (or DATABASE_URL).');
  }
  return neon(connectionString);
}
