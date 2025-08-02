import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined in .env. Please set it.');
  process.exit(1);
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export { schema };