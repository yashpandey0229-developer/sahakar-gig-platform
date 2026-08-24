import mongoose from 'mongoose';

const welfareMetricSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  totalReserveFund: { type: Number, default: 485000 },
  activeClaimsProcessed: { type: Number, default: 34 },
  quarterlyDividendsDistributed: { type: Number, default: 1240000 },
  zeroInterestLoansDisbursed: { type: Number, default: 620000 },
  avgWageMultiplierOverMarket: { type: Number, default: 1.38 }
}, { timestamps: true });

export default mongoose.model('WelfareMetric', welfareMetricSchema);
