import express from 'express';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Proposal from '../models/Proposal.js';
import Dispute from '../models/Dispute.js';
import WelfareMetric from '../models/WelfareMetric.js';
import { 
  SERVICES_CATALOG, 
  MINISTRY_STATS, 
  INITIAL_WORKERS, 
  INITIAL_PROPOSALS, 
  INITIAL_DISPUTES, 
  COOP_WELFARE_METRICS 
} from '../data/mockData.js';

const router = express.Router();

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// 1. Health & Status
router.get('/health', async (req, res) => {
  const connected = isMongoConnected();
  let workerCount = INITIAL_WORKERS.length;
  let bookingCount = 1;

  if (connected) {
    try {
      workerCount = await Worker.countDocuments();
      bookingCount = await Booking.countDocuments();
    } catch (e) {}
  }

  res.json({
    status: 'ok',
    database: connected ? 'MongoDB Atlas (AWS Mumbai)' : 'Local In-Memory Mode',
    connected,
    stats: {
      workers: workerCount,
      bookings: bookingCount
    },
    timestamp: new Date().toISOString()
  });
});

// 2. Real Google Gemini AI Voice & Chat Endpoint (/api/ai/chat)
router.post('/ai/chat', async (req, res) => {
  const { message, history = [], role = 'customer', apiKey: clientApiKey } = req.body;
  const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

  const systemInstruction = `
You are "Sahakar AI" (सहकार एआई), an intelligent, conversational voice agent for "SahakarGig" — a democratic cooperative platform for household gig services (electricians, plumbers, AC repair, home cleaning, carpentry, painting, caretaking).
Key Knowledge:
- 88% of customer payment goes directly to the worker, 7% to collective healthcare, 5% to platform IT maintenance.
- Keep responses concise (1 to 3 spoken sentences) in natural Hindi/English (Hinglish).
- Provide practical advice for home repair questions and guide them to book certified cooperative artisans.
- Output clean text without markdown or bullet points.
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }]
          }
        ]
      });

      if (response && response.text) {
        return res.json({ reply: response.text.trim(), source: 'gemini-2.5-flash' });
      }
    } catch (err) {
      console.warn('Gemini API Error:', err.message);
    }
  }

  // Resilient fallback
  let fallbackReply = `नमस्ते! मैंने आपकी बात समझी: "${message}"। आप नल रिपेयर, बिजली, एसी सर्विसिंग या सफाई के लिए कारीगर बुक कर सकते हैं जिसमें 88% भुगतान सीधे कामगार को जाता है।`;
  const text = (message || '').toLowerCase();
  if (text.includes('plumb') || text.includes('नल') || text.includes('पानी')) {
    fallbackReply = 'प्लंबिंग लीकेज के लिए हमारे पास प्रमाणित प्लंबर उपलब्ध हैं। न्यूनतम दर ₹349 है जिसमें 88% सीधे प्लंबर को जाता है। क्या मैं बुकिंग शुरू करूँ?';
  } else if (text.includes('electr') || text.includes('बिजली') || text.includes('वायर')) {
    fallbackReply = 'शॉर्ट सर्किट या वायरिंग समस्या के लिए कुशल इलेक्ट्रीशियन 10 से 15 मिनट में पहुंच सकते हैं। तुरंत सेवा के लिए इलेक्ट्रिकल कार्ड चुनें।';
  } else if (text.includes('ac') || text.includes('कूल')) {
    fallbackReply = 'एसी सर्विसिंग और गैस रीफिलिंग के लिए ऊर्जा-दक्ष सहकारी तकनीशियन उपलब्ध हैं। संपूर्ण सफाई पैकेज ₹599 से शुरू है।';
  }

  res.json({ reply: fallbackReply, source: 'smart-cooperative-engine' });
});

// 3. Services Catalog
router.get('/services', (req, res) => {
  res.json(SERVICES_CATALOG);
});

// 4. Workers Endpoints
router.get('/workers', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const workers = await Worker.find().sort({ fairRotationScore: -1 });
      if (workers && workers.length > 0) return res.json(workers);
    } catch (err) {
      console.error(err);
    }
  }
  res.json(INITIAL_WORKERS);
});

router.get('/workers/:id', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const worker = await Worker.findOne({ id: req.params.id });
      if (worker) return res.json(worker);
    } catch (e) {}
  }
  const worker = INITIAL_WORKERS.find(w => w.id === req.params.id) || INITIAL_WORKERS[0];
  res.json(worker);
});

router.patch('/workers/:id/wallet', async (req, res) => {
  const { availableBalance, patronageDividends, welfarePoints, emergencyFundReserved } = req.body;
  if (isMongoConnected()) {
    try {
      const updated = await Worker.findOneAndUpdate(
        { id: req.params.id },
        { 
          $set: { 
            'wallet.availableBalance': availableBalance,
            'wallet.patronageDividends': patronageDividends,
            'wallet.welfarePoints': welfarePoints,
            'wallet.emergencyFundReserved': emergencyFundReserved
          } 
        },
        { new: true }
      );
      if (updated) return res.json(updated);
    } catch (e) {
      console.error(e);
    }
  }
  res.json({ success: true, message: 'Wallet updated in local mode' });
});

// 5. Bookings Endpoints
router.get('/bookings', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      if (bookings && bookings.length > 0) return res.json(bookings);
    } catch (e) {
      console.error(e);
    }
  }
  res.json([]);
});

router.post('/bookings', async (req, res) => {
  const bookingData = req.body;
  if (isMongoConnected()) {
    try {
      const newBooking = await Booking.create(bookingData);
      return res.status(201).json(newBooking);
    } catch (e) {
      console.error('Error creating booking in MongoDB:', e);
    }
  }
  res.status(201).json(bookingData);
});

router.patch('/bookings/:id', async (req, res) => {
  const updates = req.body;
  if (isMongoConnected()) {
    try {
      const updated = await Booking.findOneAndUpdate(
        { id: req.params.id },
        { $set: updates },
        { new: true }
      );
      if (updated) return res.json(updated);
    } catch (e) {
      console.error('Error updating booking in MongoDB:', e);
    }
  }
  res.json({ id: req.params.id, ...updates });
});

// 6. Governance Proposals Endpoints
router.get('/proposals', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const proposals = await Proposal.find().sort({ createdAt: -1 });
      if (proposals && proposals.length > 0) return res.json(proposals);
    } catch (e) {}
  }
  res.json(INITIAL_PROPOSALS);
});

router.post('/proposals', async (req, res) => {
  const proposalData = req.body;
  if (isMongoConnected()) {
    try {
      const newProp = await Proposal.create(proposalData);
      return res.status(201).json(newProp);
    } catch (e) {}
  }
  res.status(201).json(proposalData);
});

router.post('/proposals/:id/vote', async (req, res) => {
  const { voteType } = req.body;
  if (isMongoConnected()) {
    try {
      const field = voteType === 'yes' ? 'yesVotes' : 'noVotes';
      const updated = await Proposal.findOneAndUpdate(
        { id: req.params.id },
        { 
          $inc: { [field]: 1 },
          $set: { hasVoted: true }
        },
        { new: true }
      );
      if (updated) return res.json(updated);
    } catch (e) {}
  }
  res.json({ success: true, message: 'Vote recorded' });
});

// 7. Disputes Endpoints
router.get('/disputes', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const disputes = await Dispute.find().sort({ createdAt: -1 });
      if (disputes && disputes.length > 0) return res.json(disputes);
    } catch (e) {}
  }
  res.json(INITIAL_DISPUTES);
});

router.patch('/disputes/:id/resolve', async (req, res) => {
  const { verdict } = req.body;
  if (isMongoConnected()) {
    try {
      const updated = await Dispute.findOneAndUpdate(
        { id: req.params.id },
        { 
          $set: { 
            status: 'resolved_mutual',
            verdict 
          } 
        },
        { new: true }
      );
      if (updated) return res.json(updated);
    } catch (e) {}
  }
  res.json({ id: req.params.id, status: 'resolved_mutual', verdict });
});

// 8. Welfare & Ministry Endpoints
router.get('/welfare', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const metric = await WelfareMetric.findOne({ id: 'primary_metrics' });
      if (metric) return res.json(metric);
    } catch (e) {}
  }
  res.json(COOP_WELFARE_METRICS);
});

router.get('/ministry-stats', (req, res) => {
  res.json(MINISTRY_STATS);
});

export default router;
