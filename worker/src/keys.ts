type Keys = {
  redisHost: string;
  redisPort: number;
};

export const getKeys = (): Keys => ({
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT || '6379'),
});
