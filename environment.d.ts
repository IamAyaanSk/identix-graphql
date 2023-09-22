declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DATABASE_URL?: string;
      JWT_SECRET_KEY?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_SESSION_TOKEN?: string;
      DOMAIN_NAME?: string;
      SES_SENDERS_EMAIL_ADDRESS?: string;
    }
  }
}

export {};
