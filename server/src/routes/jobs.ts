import { Router } from 'express';
import * as jobController from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.get('/:id', jobController.getJob);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);
router.post('/:jobId/proof-events', jobController.addProofEvent);

export default router;
