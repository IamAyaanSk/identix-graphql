import Redis from 'ioredis';

const redisClient: Redis = new Redis();

redisClient.on('connect', () => {
  console.log('Client connected to redis..');
});

redisClient.on('ready', () => {
  console.log('Redis client is redy to use');
});

redisClient.on('error', (err) => {
  console.log(err.message);
});

redisClient.on('end', () => {
  console.log('Redis client discvonnected');
});

process.on('SIGINT', () => {
  redisClient.quit();
});

export { redisClient as redis };
