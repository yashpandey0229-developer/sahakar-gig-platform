import mongoose from 'mongoose';

const DisputeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  customerName: { type: String, required: true },
  workerName: { type: String, required: true },
  service: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  issueCategory: { type: String, required: true },
  description: { type: String, required: true },
  workerStatement: { type: String, required: true },
  evidenceUrls: [{ type: String }],
  status: { type: String, enum: ['pending_jury', 'resolved_mutual', 'dismissed'], default: 'pending_jury' },
  juryMembers: [{ type: String }],
  verdict: { type: String, default: null }
}, { timestamps: true });

export default mongoose.models.Dispute || mongoose.model('Dispute', DisputeSchema);
