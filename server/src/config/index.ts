import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  sftp: {
    port: parseInt(process.env.SFTP_PORT || '2222'),
    host: process.env.SFTP_HOST || '0.0.0.0',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [
          'http://localhost:5000',
          'http://localhost:5173',
          'https://abt-warranty-portal-production-0129.up.railway.app'
        ],
  },

  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
};
