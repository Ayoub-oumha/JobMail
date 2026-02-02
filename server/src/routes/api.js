import express from 'express';
import { applyForJob } from '../controllers/applyController.js';

const router = express.Router();

router.post('/apply', applyForJob);

export default router;
