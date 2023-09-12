import { JWT_SECRET_KEY } from '../constants/global.js';
import jwt from 'jsonwebtoken';

interface MyJwtPayload {
  id?: string | undefined;
}

const getDecodedJWT = (token: string): jwt.JwtPayload & MyJwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (typeof decoded === 'string') {
      return {};
    }

    return decoded;
  } catch (error) {
    console.log(error);

    return {};
  }
};

export { getDecodedJWT };
