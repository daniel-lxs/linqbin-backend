import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

try {
  const migrationClient = postgres(process.env.DB_PG_URL, { max: 1 });
  migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
} catch (error) {
  throw `Failed to run migrations: ${error}`;
}
