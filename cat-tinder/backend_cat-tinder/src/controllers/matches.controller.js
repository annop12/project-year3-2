import Match from '../models/Match.js';
import Message from '../models/Message.js';
import Owner from '../models/Owner.js';
import Cat from '../models/Cat.js';

/**
 * GET /api/matches
 * ดู matches ทั้งหมดของ owner
 */
export async function getMatches(req, res) {
  try {
    const ownerId = req.ownerId;
    const { limit = 50, skip = 0 } = req.query;

    // หา matches ที่ owner นี้เป็นส่วนหนึ่งของ match
    const matches = await Match.find({
      $or: [
        { ownerAId: ownerId },
        { ownerBId: ownerId }
      ]
    })
      .populate('catAId', 'name gender ageMonths breed photos')
      .populate('catBId', 'name gender ageMonths breed photos')
      .populate('ownerAId', 'displayName avatarUrl')
      .populate('ownerBId', 'displayName avatarUrl')
      .sort({ lastMessageAt: -1, createdAt: -1 }) // เรียงตาม lastMessage ก่อน แล้วค่อยเรียงตามวันสร้าง
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Match.countDocuments({
      $or: [
        { ownerAId: ownerId },
        { ownerBId: ownerId }
      ]
    });

    return res.json({
      success: true,
      matches,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * GET /api/matches/:id
 * ดูรายละเอียด match พร้อมข้อมูลติดต่อ
 */
export async function getMatchById(req, res) {
  try {
    const ownerId = req.ownerId;
    const { id } = req.params;

    const match = await Match.findOne({
      _id: id,
      $or: [
        { ownerAId: ownerId },
        { ownerBId: ownerId }
      ]
    })
      .populate('catAId', 'name gender ageMonths breed photos location')
      .populate('catBId', 'name gender ageMonths breed photos location')
      .populate('ownerAId', 'displayName avatarUrl contact location')
      .populate('ownerBId', 'displayName avatarUrl contact location');

    if (!match) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Match not found or you do not have access to it'
      });
    }

    return res.json({
      success: true,
      match
    });

  } catch (error) {
    console.error('Error fetching match details:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * GET /api/matches/:id/messages
 * ดูข้อความทั้งหมดใน match
 */
export async function getMessages(req, res) {
  try {
    const ownerId = req.ownerId;
    const { id } = req.params;
    const { limit = 100, skip = 0 } = req.query;

    // ตรวจสอบว่า owner นี้เป็นส่วนหนึ่งของ match หรือไม่
    const match = await Match.findOne({
      _id: id,
      $or: [
        { ownerAId: ownerId },
        { ownerBId: ownerId }
      ]
    });

    if (!match) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Match not found or you do not have access to it'
      });
    }

    // ดึงข้อความ
    const messages = await Message.find({ matchId: id })
      .populate('senderOwnerId', 'displayName avatarUrl')
      .sort({ sentAt: 1 }) // เรียงจากเก่าไปใหม่
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Message.countDocuments({ matchId: id });

    return res.json({
      success: true,
      messages,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * POST /api/matches/:id/messages
 * ส่งข้อความใน match
 */
export async function sendMessage(req, res) {
  try {
    const ownerId = req.ownerId;
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Message text is required'
      });
    }

    // ตรวจสอบว่า owner นี้เป็นส่วนหนึ่งของ match หรือไม่
    const match = await Match.findOne({
      _id: id,
      $or: [
        { ownerAId: ownerId },
        { ownerBId: ownerId }
      ]
    });

    if (!match) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Match not found or you do not have access to it'
      });
    }

    // สร้างข้อความ
    const message = await Message.create({
      matchId: id,
      senderOwnerId: ownerId,
      text: text.trim()
    });

    // Update lastMessageAt ใน match
    await Match.findByIdAndUpdate(id, {
      lastMessageAt: message.sentAt
    });

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('senderOwnerId', 'displayName avatarUrl');

    return res.status(201).json({
      success: true,
      message: populatedMessage
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
