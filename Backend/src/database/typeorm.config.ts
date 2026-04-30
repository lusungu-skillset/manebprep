import { DataSourceOptions } from 'typeorm';

const entities = [__dirname + '/../**/*.entity.{ts,js}'];

export function getTypeOrmConfig(): DataSourceOptions {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities,
    synchronize: process.env.NODE_ENV !== 'production', // false in production

    // ✅ REQUIRED for Supabase
    ssl: {
      rejectUnauthorized: false,
    },

    logging: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],

    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      connectionTimeoutMillis: 10000,
    },
  };
}

// Alias for backwards compatibility
export const getDataSourceOptions = getTypeOrmConfig;