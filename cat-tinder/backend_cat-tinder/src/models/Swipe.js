import mongoose from 'mongoose';

const swipeSchema = new mongoose.Schema({
  swiperOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true, index: true },
  swiperCatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true, index: true },
  targetCatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true, index: true },
  action: { type: String, enum: ['like','pass'], required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

// ป้องกันปัดซ้ำคู่เดิม
swipeSchema.index({ swiperOwnerId: 1, swiperCatId: 1, targetCatId: 1 }, { unique: true });

export default mongoose.model('Swipe', swipeSchema);
