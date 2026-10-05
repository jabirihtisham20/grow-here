import 'server-only';
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

type CmsGlobal = typeof globalThis & { __growHereCmsPool?: Pool };

export function getCmsPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('CMS_DATABASE_NOT_CONFIGURED');
  }

  const globalForCms = globalThis as CmsGlobal;
  if (!globalForCms.__growHereCmsPool) {
    globalForCms.__growHereCmsPool = new Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_SIZE || 5),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      application_name: 'grow-here-cms',
    });
  }
  return globalForCms.__growHereCmsPool;
}

export async function withCmsTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getCmsPool().connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export function cmsQuery<T extends QueryResultRow = QueryResultRow>(
  query: string,
  values: unknown[] = []
): Promise<QueryResult<T>> {
  return getCmsPool().query<T>(query, values);
}
