const PORT: number = parseInt(process.env.PORT || '1337');
const DATABASE_URL: string = process.env.DATABASE_URL || '';
const JWT_ACCESS_SECRET_KEY: string = process.env.JWT_ACCESS_SECRET_KEY || '';
const JWT_REFRESH_SECRET_KEY: string = process.env.JWT_REFRESH_SECRET_KEY || '';
const JWT_ACCESS_EXPIRES_IN: string = process.env.JWT_ACCESS_EXPIRES_IN || '0m';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '0m';
const JWT_REFRESH_COOKIE_EXPIRES_IN: number = parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES_IN || '0');
const SES_SENDERS_EMAIL_ADDRESS: string = process.env.SES_SENDERS_EMAIL_ADDRESS || '';

const IS_TESTING = process.env.NODE_ENV || false;

export {
  PORT,
  DATABASE_URL,
  JWT_ACCESS_SECRET_KEY,
  SES_SENDERS_EMAIL_ADDRESS,
  IS_TESTING,
  JWT_REFRESH_SECRET_KEY,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_COOKIE_EXPIRES_IN,
};
