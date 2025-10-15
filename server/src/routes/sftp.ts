import { Router } from 'express';
import * as sftpController from '../controllers/sftpController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/credentials', sftpController.getSftpCredentials);
router.post('/credentials', sftpController.createSftpCredential);
router.patch('/credentials/:id', sftpController.updateSftpCredential);
router.delete('/credentials/:id', sftpController.deleteSftpCredential);

export default router;
