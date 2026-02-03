import express from 'express';
import { applyForJob } from '../controllers/applyController.js';
import { getStats } from '../controllers/statsController.js';

const router = express.Router();

router.post('/apply', applyForJob);
router.get('/stats', getStats);

export default router;
