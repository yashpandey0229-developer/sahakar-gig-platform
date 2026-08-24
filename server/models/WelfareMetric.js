import mongoose from 'mongoose';

const WelfareMetricSchema = new mongoose.Schema({
  id: { type: String, default: 'primary_metrics', unique: true },
  totalReserveFund: { type: Number, default: 1485200 },
  healthInsuranceClaimsSettled: { type: Number, default: 42 },
  toolSubsidiesDisbursed: { type: Number, default: 118 },
  emergencyFamilyAssistanceDisbursed: { type: Number, default: 18 },
  averageWorkerHourlyUplift: { type: Number, default: 38.4 },
  platformTakeRate: { type: Number, default: 5.2 },
  workerTakeRate: { type: Number, default: 87.8 },
  welfareTakeRate: { type: Number, default: 7.0 },
  activeCooperativesFederated: { type: Number, default: 24 },
  pacsConnectedCount: { type: Number, default: 68 }
}, { timestamps: true });

export default mongoose.models.WelfareMetric || mongoose.model('WelfareMetric', WelfareMetricSchema);
