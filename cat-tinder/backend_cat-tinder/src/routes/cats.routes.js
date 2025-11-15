import express from 'express';
import { getCatFeed, getMyCats } from '../controllers/cats.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// ทุก route ต้องผ่าน auth middleware
router.use(authMiddleware);

// GET /api/cats/feed - ดูแมวสำหรับ swipe
router.get('/feed', getCatFeed);

// GET /api/cats/my - ดูแมวของตัวเอง
router.get('/my', getMyCats);

export default router;
