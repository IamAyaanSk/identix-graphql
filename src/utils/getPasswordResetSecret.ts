import { User } from '@prisma/client';
import { dateToEpochTimestamp } from './dateToEpochTimestamp';

const getPasswordResetSecret = (user: User): string => {
  const secret = user.password + '-' + dateToEpochTimestamp(user.createdAt);
  return secret;
};

export { getPasswordResetSecret };
