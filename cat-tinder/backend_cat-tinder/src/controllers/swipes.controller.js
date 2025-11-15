import Swipe from '../models/Swipe.js';
import Match from '../models/Match.js';
import Cat from '../models/Cat.js';

/**
 * POST /api/swipes
 * บันทึกการ swipe (like/pass) และตรวจสอบว่ามี match หรือไม่
 */
export async function createSwipe(req, res) {
  try {
    const ownerId = req.ownerId; // จาก auth middleware
    const { swiperCatId, targetCatId, action } = req.body;

    // Validate input
    if (!swiperCatId || !targetCatId || !action) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'swiperCatId, targetCatId, and action are required'
      });
    }

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'action must be either "like" or "pass"'
      });
    }

    // ตรวจสอบว่าแมวที่ swipe เป็นของ owner นี้จริงหรือไม่
    const swiperCat = await Cat.findOne({ _id: swiperCatId, ownerId });
    if (!swiperCat) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'This cat does not belong to you'
      });
    }

    // ตรวจสอบว่าแมวเป้าหมายมีอยู่จริง
    const targetCat = await Cat.findById(targetCatId);
    if (!targetCat) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Target cat not found'
      });
    }

    // บันทึก swipe (ถ้า swipe ซ้ำจะ error จาก unique index)
    let swipe;
    try {
      swipe = await Swipe.create({
        swiperOwnerId: ownerId,
        swiperCatId,
        targetCatId,
        action
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Duplicate swipe',
          message: 'You already swiped this cat'
        });
      }
      throw err;
    }

    let match = null;

    // ถ้า action เป็น 'like' ให้ตรวจสอบว่าอีกฝั่ง like กลับมาหรือไม่
    if (action === 'like') {
      // หาว่าแมวเป้าหมาย like กลับมาหรือไม่
      const reverseSwipe = await Swipe.findOne({
        swiperOwnerId: targetCat.ownerId,
        swiperCatId: targetCatId,
        targetCatId: swiperCatId,
        action: 'like'
      });

      if (reverseSwipe) {
        // มี mutual like! สร้าง match
        // เรียง catId ให้ A < B เพื่อป้องกัน duplicate match
        const [catAId, catBId] = [swiperCatId, targetCatId].sort();
        const [ownerAId, ownerBId] = swiperCatId < targetCatId
          ? [ownerId, targetCat.ownerId]
          : [targetCat.ownerId, ownerId];

        try {
          match = await Match.create({
            catAId,
            ownerAId,
            catBId,
            ownerBId
          });

          // Populate ข้อมูลแมวและเจ้าของ
          match = await Match.findById(match._id)
            .populate('catAId', 'name gender ageMonths breed photos')
            .populate('catBId', 'name gender ageMonths breed photos')
            .populate('ownerAId', 'displayName avatarUrl contact')
            .populate('ownerBId', 'displayName avatarUrl contact');

        } catch (err) {
          // ถ้า match ซ้ำก็ไม่เป็นไร (มี unique index)
          if (err.code !== 11000) {
            throw err;
          }
          // หา match ที่มีอยู่แล้ว
          match = await Match.findOne({
            $or: [
              { catAId: catAId, catBId: catBId },
              { catAId: catBId, catBId: catAId }
            ]
          })
          .populate('catAId', 'name gender ageMonths breed photos')
          .populate('catBId', 'name gender ageMonths breed photos')
          .populate('ownerAId', 'displayName avatarUrl contact')
          .populate('ownerBId', 'displayName avatarUrl contact');
        }
      }
    }

    return res.status(201).json({
      success: true,
      swipe,
      match: match ? {
        matched: true,
        matchId: match._id,
        matchData: match
      } : {
        matched: false
      }
    });

  } catch (error) {
    console.error('Error creating swipe:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * GET /api/swipes/history
 * ดูประวัติการ swipe ของแมวทั้งหมดที่เป็นของ owner
 */
export async function getSwipeHistory(req, res) {
  try {
    const ownerId = req.ownerId;
    const { catId, action, limit = 50, skip = 0 } = req.query;

    // Build query
    const query = { swiperOwnerId: ownerId };

    if (catId) {
      query.swiperCatId = catId;
    }

    if (action && ['like', 'pass'].includes(action)) {
      query.action = action;
    }

    const swipes = await Swipe.find(query)
      .populate('swiperCatId', 'name gender ageMonths breed photos')
      .populate('targetCatId', 'name gender ageMonths breed photos')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Swipe.countDocuments(query);

    return res.json({
      success: true,
      swipes,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching swipe history:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
