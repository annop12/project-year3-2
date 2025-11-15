// src/config/env.js
import 'dotenv/config';

export const env = {
  node: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongo: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES || '7d',
  corsOrigin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean),
};
