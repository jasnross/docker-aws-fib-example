type Keys = {
  redisHost: string;
  redisPort: number;
  pgUser: string;
  pgHost: string;
  pgDatabase: string;
  pgPassword: string;
  pgPort: number;
};

export const getKeys = (): Keys => ({
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT || '6379'),
  pgUser: process.env.PGUSER || '',
  pgHost: process.env.PGHOST || '',
  pgDatabase: process.env.PGDATABASE || '',
  pgPassword: process.env.PGPASSWORD || '',
  pgPort: Number(process.env.PGPORT || '5432'),
});
