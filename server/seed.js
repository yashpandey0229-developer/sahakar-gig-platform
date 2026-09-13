import Worker from './models/Worker.js';
import Proposal from './models/Proposal.js';
import Dispute from './models/Dispute.js';
import WelfareMetric from './models/WelfareMetric.js';
import Booking from './models/Booking.js';
import { 
  INITIAL_WORKERS, 
  INITIAL_PROPOSALS, 
  INITIAL_DISPUTES, 
  COOP_WELFARE_METRICS 
} from '../src/services/mockData.js';

export async function autoSeedDatabase() {
  try {
    const workerCount = await Worker.countDocuments();
    if (workerCount === 0) {
      console.log('🌱 MongoDB database is empty. Auto-seeding initial cooperative data...');

      // Seed Workers
      await Worker.insertMany(INITIAL_WORKERS);
      console.log(`✅ Seeded ${INITIAL_WORKERS.length} cooperative artisans into MongoDB.`);

      // Seed Proposals
      await Proposal.insertMany(INITIAL_PROPOSALS);
      console.log(`✅ Seeded ${INITIAL_PROPOSALS.length} policy proposals into MongoDB.`);

      // Seed Disputes
      await Dispute.insertMany(INITIAL_DISPUTES);
      console.log(`✅ Seeded ${INITIAL_DISPUTES.length} dispute cases into MongoDB.`);

      // Seed Welfare Metric
      await WelfareMetric.create(COOP_WELFARE_METRICS);
      console.log('✅ Seeded collective welfare reserve metrics into MongoDB.');
    } else {
      console.log(`ℹ️ MongoDB already initialized with ${workerCount} cooperative artisans.`);
    }
  } catch (error) {
    console.error('Error during autoSeedDatabase:', error.message);
  }
}
