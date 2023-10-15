import { JWT_REFRESH_COOKIE_EXPIRES_IN } from '@constants/global';
import { redis } from '@constants/redisClient';

const isJWTTokenBlackListed = async (token: string): Promise<boolean> => {
  const blacklistKey = `blacklist:${token}`;
  const result = await redis.get(blacklistKey);

  return result === token;
};

const setJWTTokenBlackListed = async (token: string): Promise<boolean> => {
  if (!token) return false;
  const blacklistKey = `blacklist:${token}`;
  const result = await redis.setex(blacklistKey, JWT_REFRESH_COOKIE_EXPIRES_IN, token);
  return result === 'OK';
};
export { isJWTTokenBlackListed, setJWTTokenBlackListed };
