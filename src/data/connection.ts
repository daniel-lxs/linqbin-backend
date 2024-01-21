import postgres from 'postgres';

const queryClient = postgres(process.env.DB_PG_URL);

export function getClient(): postgres.Sql {
  if (!queryClient) {
    throw new Error('Connection: Database is invalid or nonexistent');
  }

  return queryClient;
}
