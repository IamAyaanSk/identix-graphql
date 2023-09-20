const PORT: number = parseInt(process.env.PORT || '1337');
const DATABASE_URL: string = process.env.DATABASE_URL || '';
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || '';
const SENDERS_EMAIL_ADDRESS: string = process.env.SENDERS_EMAIL_ADDRESS || '';

export { PORT, DATABASE_URL, JWT_SECRET_KEY, SENDERS_EMAIL_ADDRESS };
