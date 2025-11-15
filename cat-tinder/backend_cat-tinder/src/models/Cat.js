import mongoose from 'mongoose';

const catSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true, index: true },
  name: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true, index: true },
  ageMonths: { type: Number, min: 0, index: true },
  breed: String,
  weightKg: Number,
  purpose: [{ type: String, enum: ['mate','friend','foster'] }], // multi-select
  health: { vaccinated: Boolean, neutered: Boolean, notes: String },
  traits: [String],
  photos: [{ url: String, publicId: String }],
  location: { province: String, district: String, lat: Number, lng: Number },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

// ตัวอย่างดัชนีที่มีประโยชน์เวลา feed/ค้นหา
catSchema.index({ 'location.province': 1, active: 1, gender: 1, ageMonths: 1, createdAt: -1 });

export default mongoose.model('Cat', catSchema);
