const PORT: number = parseInt(process.env.PORT || '1337');
const DATABASE_CONNECTION_URL: string = process.env.DATABASE_CONNECTION_URL || '';
const JWT_ACCESS_SECRET_KEY: string = process.env.JWT_ACCESS_SECRET_KEY || '';
const JWT_REFRESH_SECRET_KEY: string = process.env.JWT_REFRESH_SECRET_KEY || '';
const SES_SENDERS_EMAIL_ADDRESS: string = process.env.SES_SENDERS_EMAIL_ADDRESS || '';
const REDIS_CONNECTION_URL: string = process.env.REDIS_CONNECTION_URL || '';

const JWT_ACCESS_EXPIRES_IN: string = '20m';
const JWT_REFRESH_EXPIRES_IN: string = '15d';
const JWT_REFRESH_COOKIE_EXPIRES_IN: number = 1296000000;

const TESTING_DUMMY_PASSWORD: string = 'test12345';
const TESTING_DUMMY_USER_ID: string = '4280e50c-7737-4f1d-bd3b-331d138f10b4';
const TESTING_DUMMY_USER_LINK_ID: string = 'e511d606-b6cb-4f85-87ff-15fa9173ce06';

const IS_TESTING = process.env.NODE_ENV || false;

export {
  PORT,
  DATABASE_CONNECTION_URL,
  TESTING_DUMMY_PASSWORD,
  TESTING_DUMMY_USER_ID,
  TESTING_DUMMY_USER_LINK_ID,
  JWT_ACCESS_SECRET_KEY,
  SES_SENDERS_EMAIL_ADDRESS,
  IS_TESTING,
  JWT_REFRESH_SECRET_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_COOKIE_EXPIRES_IN,
  REDIS_CONNECTION_URL,
};
