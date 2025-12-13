import dotenv from 'dotenv';

dotenv.config();

export const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongodb_uri: process.env.MONGODB_URI!,
  jwt_secret: process.env.JWT_SECRET!,
  jwt_expire: process.env.JWT_EXPIRE || '7d',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE || '30d',
  client_url: process.env.CLIENT_URL || 'http://localhost:3000',
};

// Validate required env variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
