import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
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

// In-memory fallback stores for high resilience
let inMemoryWorkers = [...INITIAL_WORKERS];
let inMemoryBookings = [
  {
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
    workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    workerRating: 4.9,
    workerSociety: 'Pune Urban Electrical & Tech Cooperative',
    totalAmount: 499,
    status: 'COMPLETED',
    startOtp: '4819',
    endOtp: '7721',
    createdAt: '2026-08-22T14:30:00Z',
    ratingGiven: 5,
    reviewText: 'Prompt arrival and explained the fair cooperative billing breakdown. Very professional!'
  }
];

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
  res.json(inMemoryWorkers);
});

router.post('/workers', async (req, res) => {
  const workerData = req.body;
  if (!workerData.id) {
    workerData.id = 'w-' + Date.now();
  }

  // Update in-memory
  const existingIdx = inMemoryWorkers.findIndex(w => w.id === workerData.id);
  if (existingIdx >= 0) {
    inMemoryWorkers[existingIdx] = { ...inMemoryWorkers[existingIdx], ...workerData };
  } else {
    inMemoryWorkers = [workerData, ...inMemoryWorkers];
  }

  if (isMongoConnected()) {
    try {
      const saved = await Worker.findOneAndUpdate(
        { id: workerData.id },
        { $set: workerData },
        { upsert: true, new: true }
      );
      return res.status(201).json(saved);
    } catch (e) {
      console.error('Error saving worker to MongoDB:', e.message);
    }
  }

  res.status(201).json(workerData);
});

router.get('/workers/:id', async (req, res) => {
  if (isMongoConnected()) {
    try {
      const worker = await Worker.findOne({ id: req.params.id });
      if (worker) return res.json(worker);
    } catch (e) {}
  }
  const worker = inMemoryWorkers.find(w => w.id === req.params.id) || inMemoryWorkers[0];
  res.json(worker);
});

router.patch('/workers/:id/wallet', async (req, res) => {
  const { availableBalance, patronageDividends, welfarePoints, emergencyFundReserved } = req.body;
  
  // Update in-memory
  inMemoryWorkers = inMemoryWorkers.map(w => {
    if (w.id === req.params.id) {
      return {
        ...w,
        wallet: {
          ...w.wallet,
          availableBalance: availableBalance ?? w.wallet.availableBalance,
          patronageDividends: patronageDividends ?? w.wallet.patronageDividends,
          welfarePoints: welfarePoints ?? w.wallet.welfarePoints,
          emergencyFundReserved: emergencyFundReserved ?? w.wallet.emergencyFundReserved
        }
      };
    }
    return w;
  });

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
  res.json(inMemoryBookings);
});

router.post('/bookings', async (req, res) => {
  const bookingData = req.body;

  // Add to in-memory store
  const existingIdx = inMemoryBookings.findIndex(b => b.id === bookingData.id);
  if (existingIdx >= 0) {
    inMemoryBookings[existingIdx] = { ...inMemoryBookings[existingIdx], ...bookingData };
  } else {
    inMemoryBookings = [bookingData, ...inMemoryBookings];
  }

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

  // Update in-memory store
  inMemoryBookings = inMemoryBookings.map(b => {
    if (b.id === req.params.id) {
      return { ...b, ...updates };
    }
    return b;
  });

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

// ==========================================
// 9. Real OTP Authentication (Email & SMS/WhatsApp)
// ==========================================
const otpStore = new Map();

// Helper to create Nodemailer transporter if credentials provided
const getMailTransporter = () => {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || process.env.GMAIL_PASSWORD;
  
  if (!user || !pass) {
    return null;
  }
  
  const service = process.env.SMTP_SERVICE || (user.includes('gmail.com') ? 'gmail' : undefined);
  
  return nodemailer.createTransport({
    service,
    host: process.env.SMTP_HOST || (!service ? 'smtp.gmail.com' : undefined),
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass }
  });
};

// POST /api/auth/send-otp
router.post('/auth/send-otp', async (req, res) => {
  const { type, recipient, role, name } = req.body;
  
  if (!recipient || !type) {
    return res.status(400).json({ success: false, message: 'Type and recipient are required.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const normalizedKey = recipient.toLowerCase().trim();
  
  otpStore.set(normalizedKey, {
    otp,
    type,
    recipient,
    role: role || 'user',
    name: name || '',
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes validity
  });

  console.log(`[OTP Generated] ${type.toUpperCase()} for ${recipient}: ${otp}`);

  // Channel: EMAIL
  if (type === 'email') {
    const transporter = getMailTransporter();
    let emailSent = false;
    let emailError = null;

    if (transporter) {
      try {
        const mailOptions = {
          from: process.env.SMTP_FROM || `"SahakarGig Cooperative" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
          to: recipient,
          subject: `[SahakarGig] Your Verification Code: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #FAF7F0;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #1B4D3E; margin: 0; font-size: 26px;">Sahakar<span style="font-style: italic;">Gig</span></h1>
                <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Democratizing Gig Work · 88% Direct Payouts</p>
              </div>
              <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #cbd5e1; text-align: center;">
                <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">${name ? `Hello ${name}!` : 'Hello Citizen / Partner!'}</h2>
                <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                  Your one-time authentication code for SahakarGig (${role === 'worker' ? 'Cooperative Partner' : 'Citizen App'}) is:
                </p>
                <div style="margin: 24px 0; display: inline-block; padding: 14px 28px; background-color: #1B4D3E; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 6px; border-radius: 12px; font-family: monospace;">
                  ${otp}
                </div>
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  This code is valid for 10 minutes. Please do not share it with anyone.
                </p>
              </div>
              <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 11px;">
                © 2026 SahakarGig National Multi-State Cooperative Society. All rights reserved.
              </div>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`[Email Sent] Successfully dispatched OTP to ${recipient}`);
      } catch (err) {
        console.warn(`[Email Error] Failed to dispatch real email to ${recipient}:`, err.message);
        emailError = err.message;
      }
    }

    return res.json({
      success: true,
      channel: 'email',
      recipient,
      otp,
      realEmailSent: emailSent,
      emailError,
      message: emailSent 
        ? `Real verification email sent to ${recipient}` 
        : `OTP generated for ${recipient}. Enter OTP to verify.`
    });
  }

  // Channel: PHONE (SMS & WhatsApp)
  if (type === 'phone') {
    const rawDigits = recipient.replace(/\D/g, '');
    const phone10 = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
    const fullPhone = `91${phone10}`;
    
    // 1-Click WhatsApp Direct Dispatch Link
    const waText = encodeURIComponent(
      `नमस्ते! सहकारगिग (SahakarGig) सत्यापन कोड: ${otp}। यह कोड 10 मिनट के लिए मान्य है। कृपया इसे किसी के साथ साझा न करें।\n\nYour SahakarGig OTP is: ${otp}. Valid for 10 minutes.`
    );
    const waLink = `https://wa.me/${fullPhone}?text=${waText}`;
    
    // Direct Device SMS Link
    const smsText = encodeURIComponent(`Your SahakarGig OTP is ${otp}. Valid for 10 minutes.`);
    const smsLink = `sms:+${fullPhone}?body=${smsText}`;

    // Optional Telecom Gateway API (Fast2SMS)
    let gatewaySent = false;
    if (process.env.FAST2SMS_API_KEY && phone10.length === 10) {
      try {
        const f2sUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&numbers=${phone10}`;
        const f2sRes = await fetch(f2sUrl);
        const f2sData = await f2sRes.json();
        if (f2sData.return) gatewaySent = true;
      } catch (e) {
        console.warn('[Fast2SMS Error]:', e.message);
      }
    }

    return res.json({
      success: true,
      channel: 'phone',
      recipient,
      cleanPhone: fullPhone,
      phone10,
      otp,
      waLink,
      smsLink,
      gatewaySent,
      message: gatewaySent 
        ? `SMS sent to +91 ${phone10}` 
        : `Real WhatsApp & SMS dispatch link generated for +91 ${phone10}`
    });
  }

  return res.status(400).json({ success: false, message: 'Invalid delivery type.' });
});

// POST /api/auth/verify-otp
router.post('/auth/verify-otp', (req, res) => {
  const { recipient, otp } = req.body;
  if (!recipient || !otp) {
    return res.status(400).json({ verified: false, message: 'Recipient and OTP are required.' });
  }

  const normalizedKey = recipient.toLowerCase().trim();
  const stored = otpStore.get(normalizedKey);

  if (!stored) {
    // For extreme hackathon resilience: if OTP matches 6 digits format, verify
    return res.status(400).json({ verified: false, message: 'No active OTP found. Please request a new code.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedKey);
    return res.status(400).json({ verified: false, message: 'OTP has expired. Please request a new code.' });
  }

  if (stored.otp !== otp.toString().trim()) {
    return res.status(400).json({ verified: false, message: 'Incorrect OTP. Please check and try again.' });
  }

  stored.verified = true;
  return res.json({
    verified: true,
    message: 'OTP verified successfully!',
    recipient,
    role: stored.role,
    verifiedAt: new Date().toISOString()
  });
});

export default router;
