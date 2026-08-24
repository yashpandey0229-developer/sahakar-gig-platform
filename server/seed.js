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

      // Seed sample completed booking
      await Booking.create({
        id: 'BK-7821',
        serviceId: 'electrical',
        serviceTitle: 'Electrical & Power Systems',
        subServiceName: 'MCB / Short Circuit Troubleshooting',
        customerId: 'c-501',
        customerName: 'Priya Sharma',
        customerPhone: '+91 98221 55601',
        customerAddress: 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune',
        customerLocation: { lat: 18.5298, lng: 73.8472 },
        workerId: 'w-101',
        workerName: 'Ramesh Jadhav',
        workerPhone: '+91 98230 44819',
        workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
        workerRating: 4.9,
        workerSociety: 'Pune Urban Electrical & Tech Cooperative',
        totalAmount: 499,
        status: 'COMPLETED',
        startOtp: '4819',
        endOtp: '7721',
        breakdown: {
          totalAmount: 499,
          workerPayout: 439,
          workerPercent: 88,
          welfareFundContribution: 35,
          welfarePercent: 7,
          platformMaintenance: 25,
          platformPercent: 5,
          estimatedPatronageDividend: 20
        },
        ratingGiven: 5,
        reviewText: 'Prompt arrival and explained the fair cooperative billing breakdown. Very professional!'
      });
      console.log('✅ Seeded sample completed booking into MongoDB.');
    } else {
      console.log(`ℹ️ MongoDB already initialized with ${workerCount} cooperative artisans.`);
    }
  } catch (error) {
    console.error('Error during autoSeedDatabase:', error.message);
  }
}
