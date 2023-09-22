import { User } from '@prisma/client';
import { dateToEpochTimestamp } from './dateToEpochTimestamp.js';
import { compare, genSalt, hash } from 'bcrypt';

const getPasswordResetSecret = async (user: User): Promise<string> => {
  const salt = await genSalt(12);

  const contentToHash = user.password + '-' + dateToEpochTimestamp(user.createdAt);

  return hash(contentToHash, salt);
};

const checkPasswordResetSecret = async (user: User, hashedPasswordResetSecret: string): Promise<boolean> => {
  const contentToCompare = user.password + '-' + dateToEpochTimestamp(user.createdAt);

  return compare(contentToCompare, hashedPasswordResetSecret);
};

export { getPasswordResetSecret, checkPasswordResetSecret };
