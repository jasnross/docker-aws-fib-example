import { getKeys } from './keys';
import redis = require('redis');

const keys = getKeys();

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

const fib = (index: number): number => {
  if (index < 2) {
    return 1;
  }
  return fib(index - 1) + fib(index - 2);
};

sub.on('message', (channel, message) => {
  console.log(`MESSAGE: ${message}`);
  const result = fib(parseInt(message)).toString();
  redisClient.hset('values', message, result);
});

sub.subscribe('insert');

console.log('Worker started.');
