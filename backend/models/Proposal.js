import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  yesVotes: { type: Number, default: 0 },
  noVotes: { type: Number, default: 0 },
  daysLeft: { type: Number, default: 7 },
  hasVoted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Proposal', proposalSchema);
