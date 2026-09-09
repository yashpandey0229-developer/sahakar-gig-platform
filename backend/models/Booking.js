import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  serviceId: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  subServiceName: { type: String },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  workerId: { type: String },
  workerName: { type: String },
  workerPhone: { type: String },
  workerAvatar: { type: String },
  workerRating: { type: Number },
  workerSociety: { type: String },
  workerLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  totalAmount: { type: Number, required: true },
  breakdown: {
    workerPayout: { type: Number },
    workerPercent: { type: Number, default: 88 },
    welfareFundContribution: { type: Number },
    welfarePercent: { type: Number, default: 7 },
    platformMaintenance: { type: Number },
    platformPercent: { type: Number, default: 5 },
    estimatedPatronageDividend: { type: Number }
  },
  status: { 
    type: String, 
    enum: ['BROADCASTING', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'BROADCASTING'
  },
  startOtp: { type: String, required: true },
  endOtp: { type: String, required: true },
  etaMins: { type: Number, default: 12 },
  scheduledTime: { type: String },
  notes: { type: String },
  problemPhoto: { type: String },
  completionPhoto: { type: String },
  ratingGiven: { type: Number },
  reviewText: { type: String },
  quotes: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
