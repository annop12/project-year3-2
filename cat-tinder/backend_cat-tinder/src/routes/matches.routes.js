import express from 'express';
import {
  getMatches,
  getMatchById,
  getMessages,
  sendMessage
} from '../controllers/matches.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// ทุก route ต้องผ่าน auth middleware
router.use(authMiddleware);

// GET /api/matches - ดู matches ทั้งหมด
router.get('/', getMatches);

// GET /api/matches/:id - ดูรายละเอียด match
router.get('/:id', getMatchById);

// GET /api/matches/:id/messages - ดูข้อความใน match
router.get('/:id/messages', getMessages);

// POST /api/matches/:id/messages - ส่งข้อความใน match
router.post('/:id/messages', sendMessage);

export default router;
