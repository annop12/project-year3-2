import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true },
  avatarUrl: String,
  location: { province: String, district: String, lat: Number, lng: Number },
  contact: { lineId: String, phone: String, facebookUrl: String },
}, { timestamps: true });

export default mongoose.model('Owner', ownerSchema);
