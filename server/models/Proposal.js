import mongoose from 'mongoose';

const ProposalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleHi: { type: String },
  category: { type: String, default: 'Welfare & Safety' },
  proposedBy: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['active', 'passed', 'rejected'], default: 'active' },
  yesVotes: { type: Number, default: 0 },
  noVotes: { type: Number, default: 0 },
  totalEligibleVoters: { type: Number, default: 180 },
  deadline: { type: String, required: true },
  fundImpact: { type: String },
  hasVoted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema);
