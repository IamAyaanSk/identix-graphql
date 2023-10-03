import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
} from '../constants/global.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const signJWTToken = (userId?: string, isRefresh: boolean = false): string => {
  if (!userId) return '';

  const JWTtoken: string = isRefresh
    ? jwt.sign({ id: userId, JWTAuthSecret: uuidv4() }, JWT_REFRESH_SECRET_KEY, { expiresIn: JWT_REFRESH_EXPIRES_IN })
    : jwt.sign({ id: userId }, JWT_ACCESS_SECRET_KEY, { expiresIn: JWT_ACCESS_EXPIRES_IN });

  return JWTtoken;
};

export { signJWTToken };
