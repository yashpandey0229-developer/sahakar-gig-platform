import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  workerName: { type: String, required: true },
  customerName: { type: String, required: true },
  issue: { type: String, required: true },
  workerNotes: { type: String },
  customerNotes: { type: String },
  stakeAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['open_jury_review', 'resolved_mutual', 'escalated_ombudsman'],
    default: 'open_jury_review'
  },
  juryMembers: [{ type: String }],
  verdict: { type: String }
}, { timestamps: true });

export default mongoose.model('Dispute', disputeSchema);
