import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { config } from '../config/index.js';
import * as fileController from '../controllers/fileController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs and common image formats
    const allowedTypes = /pdf|png|jpg|jpeg|csv|xlsx|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, images, and spreadsheet files are allowed'));
    }
  },
});

router.use(authenticate);

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/job/:jobId', fileController.getJobFiles);
router.get('/:id', fileController.getFile);
router.delete('/:id', fileController.deleteFile);

export default router;
