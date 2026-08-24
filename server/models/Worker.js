import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameHi: { type: String },
  phone: { type: String, required: true },
  avatar: { type: String },
  skills: [{ type: String }],
  experienceYears: { type: Number, default: 5 },
  rating: { type: Number, default: 4.9 },
  totalJobsCompleted: { type: Number, default: 0 },
  cooperativeMemberId: { type: String, required: true },
  societyName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  status: { type: String, enum: ['online', 'busy', 'offline'], default: 'online' },
  fairRotationScore: { type: Number, default: 90 },
  certification: { type: String },
  aadhaarVerified: { type: Boolean, default: true },
  skillIndiaBadge: { type: Boolean, default: true },
  languages: [{ type: String }],
  wallet: {
    grossEarnings: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    patronageDividends: { type: Number, default: 0 },
    welfarePoints: { type: Number, default: 0 },
    emergencyFundReserved: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
