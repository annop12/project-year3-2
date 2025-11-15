import Cat from '../models/Cat.js';
import Swipe from '../models/Swipe.js';

/**
 * GET /api/cats/feed
 * ดูแมวสำหรับ swipe (ยกเว้นแมวที่ swipe ไปแล้ว)
 */
export async function getCatFeed(req, res) {
  try {
    const ownerId = req.ownerId;
    const { gender, purpose, limit = 10 } = req.query;

    // หาแมวของ owner นี้
    const myCats = await Cat.find({ ownerId, active: true }).select('_id');
    const myCatIds = myCats.map(cat => cat._id);

    if (myCatIds.length === 0) {
      return res.json({
        success: true,
        cats: [],
        message: 'You need to add a cat first'
      });
    }

    // หาแมวที่เคย swipe ไปแล้ว (โดยแมวทุกตัวของเรา)
    const swipedCats = await Swipe.find({
      swiperOwnerId: ownerId,
      swiperCatId: { $in: myCatIds }
    }).distinct('targetCatId');

    // Build query
    const query = {
      _id: {
        $nin: [...myCatIds, ...swipedCats] // ยกเว้นแมวของเราและแมวที่ swipe แล้ว
      },
      ownerId: { $ne: ownerId }, // ไม่ใช่แมวของเราเอง
      active: true
    };

    // Filter by gender
    if (gender && ['male', 'female'].includes(gender)) {
      query.gender = gender;
    }

    // Filter by purpose
    if (purpose) {
      query.purpose = purpose;
    }

    // ดึงแมว
    const cats = await Cat.find(query)
      .populate('ownerId', 'displayName avatarUrl location')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      cats,
      myCatId: myCatIds[0] // ส่ง cat ID ของเราไปด้วย (สำหรับ swipe)
    });

  } catch (error) {
    console.error('Error fetching cat feed:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * GET /api/cats/my
 * ดูแมวของตัวเอง
 */
export async function getMyCats(req, res) {
  try {
    const ownerId = req.ownerId;

    const cats = await Cat.find({ ownerId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      cats
    });

  } catch (error) {
    console.error('Error fetching my cats:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
