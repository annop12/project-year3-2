import express from 'express';
import { createSwipe, getSwipeHistory } from '../controllers/swipes.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// ทุก route ต้องผ่าน auth middleware
router.use(authMiddleware);

// POST /api/swipes - บันทึกการ swipe
router.post('/', createSwipe);

// GET /api/swipes/history - ดูประวัติการ swipe
router.get('/history', getSwipeHistory);

export default router;
