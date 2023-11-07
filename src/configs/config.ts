import { config } from 'dotenv';
config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = parseInt(process.env.DATABASE_PORT, 10);
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE = process.env.DATABASE;
export const JWT_SECRET_EXPIRED = process.env.JWT_SECRET_EXPIRED;
export const SALTROUNDS = parseInt(process.env.SALTROUNDS, 10);
export const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
export const JWT_SECRET_EXPIRED_REFRESH_TOKEN =
  process.env.JWT_SECRET_EXPIRED_REFRESH_TOKEN;
export const PROJECT_ID = process.env.PROJECT_ID;
export const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
export const STORAGE_BUCKET_URL = process.env.STORAGE_BUCKET_URL;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
