import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  serviceId: { type: String, required: true },
  serviceTitle: { type: String },
  subServiceName: { type: String },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  scheduledTime: { type: String, default: 'Immediate Express' },
  notes: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  breakdown: {
    totalAmount: Number,
    workerPayout: Number,
    workerPercent: Number,
    welfareFundContribution: Number,
    welfarePercent: Number,
    platformMaintenance: Number,
    platformPercent: Number,
    estimatedPatronageDividend: Number
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'BROADCASTING', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'BROADCASTING'
  },
  startOtp: { type: String, required: true },
  endOtp: { type: String, required: true },
  workerId: { type: String, default: null },
  workerName: { type: String, default: null },
  workerPhone: { type: String, default: null },
  workerAvatar: { type: String, default: null },
  workerRating: { type: Number, default: 4.9 },
  workerSociety: { type: String, default: null },
  workerLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  etaMins: { type: Number, default: 10 },
  ratingGiven: { type: Number, default: null },
  reviewText: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
