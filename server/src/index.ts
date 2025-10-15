import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { config } from './config/index.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import sftpRoutes from './routes/sftp.js';
import fileRoutes from './routes/files.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/sftp', sftpRoutes);
app.use('/api/files', fileRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Ensure required directories exist
function ensureDirectories() {
  const dirs = [
    config.upload.dir,
    'logs',
    path.join(config.upload.dir, 'buckslips'),
    path.join(config.upload.dir, 'letters'),
    path.join(config.upload.dir, 'envelopes'),
    path.join(config.upload.dir, 'maillists'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
}

// Start servers
async function start() {
  try {
    ensureDirectories();

    // Start Express server
    app.listen(config.port, () => {
      logger.info(`🚀 API server listening on http://localhost:${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });

    // Note about SFTP
    logger.warn('⚠️  SFTP server disabled - Use external SFTP server (OpenSSH) or FileZilla Server');
    logger.info('💡 Customers can upload files via web portal at /api/files/upload');
    logger.info('💡 SFTP credentials are managed in the database for future external SFTP integration');

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

start();
