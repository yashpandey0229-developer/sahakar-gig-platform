import mongoose from 'mongoose';
import Worker from './models/Worker.js';
import Booking from './models/Booking.js';
import Proposal from './models/Proposal.js';
import Dispute from './models/Dispute.js';
import WelfareMetric from './models/WelfareMetric.js';
import { 
  INITIAL_WORKERS, 
  INITIAL_PROPOSALS, 
  INITIAL_DISPUTES, 
  COOP_WELFARE_METRICS, 
  SERVICES_CATALOG 
} from './data/mockData.js';

export async function seedDatabaseIfEmpty() {
  try {
    const workerCount = await Worker.countDocuments();
    if (workerCount === 0) {
      console.log('🌱 Seeding Initial Workers into MongoDB Atlas...');
      await Worker.insertMany(INITIAL_WORKERS);
    }

    const proposalCount = await Proposal.countDocuments();
    if (proposalCount === 0) {
      console.log('🌱 Seeding Initial Governance Proposals into MongoDB Atlas...');
      await Proposal.insertMany(INITIAL_PROPOSALS);
    }

    const disputeCount = await Dispute.countDocuments();
    if (disputeCount === 0) {
      console.log('🌱 Seeding Initial Disputes into MongoDB Atlas...');
      await Dispute.insertMany(INITIAL_DISPUTES);
    }

    const welfareCount = await WelfareMetric.countDocuments();
    if (welfareCount === 0) {
      console.log('🌱 Seeding Welfare Metrics into MongoDB Atlas...');
      await WelfareMetric.create(COOP_WELFARE_METRICS);
    }

    console.log('✅ MongoDB Atlas Seed Check Complete.');
  } catch (err) {
    console.warn('⚠️ Seeding notice (using live/in-memory records):', err.message);
  }
}
