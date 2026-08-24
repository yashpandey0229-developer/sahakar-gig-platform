import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  rating: { type: Number, default: 4.9 },
  totalJobsCompleted: { type: Number, default: 0 },
  skills: [{ type: String }],
  societyName: { type: String, required: true },
  cooperativeMemberId: { type: String, required: true },
  bankAccountMasked: { type: String, required: true },
  isOnline: { type: Boolean, default: true },
  fairRotationScore: { type: Number, default: 95 },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  wallet: {
    grossEarnings: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    patronageDividends: { type: Number, default: 0 },
    welfarePoints: { type: Number, default: 0 },
    emergencyFundReserved: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Worker', workerSchema);
