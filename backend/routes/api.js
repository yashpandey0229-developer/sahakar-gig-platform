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

// ==========================================
// 4B. Real Transactional Email Engine (Brevo API & SMTP)
// ==========================================
const getMailTransporter = () => {
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || process.env.GMAIL_PASSWORD || '').replace(/\s+/g, '');
  
  if (!user || !pass) {
    return null;
  }
  
  const service = process.env.SMTP_SERVICE || (user.includes('gmail.com') ? 'gmail' : undefined);
  
  if (service === 'gmail' || (!service && user.includes('gmail.com'))) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: { user, pass }
  });
};

// Generic Email Dispatcher (Brevo API -> Resend API -> SMTP)
async function sendCustomEmail({ to, subject, htmlContent }) {
  if (!to || !to.includes('@')) return false;
  const cleanTo = to.toLowerCase().trim();

  // 1. Brevo REST API (Active)
  if (process.env.BREVO_API_KEY) {
    try {
      const senderEmail = (process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'yashpandey8894@gmail.com').trim();
      const senderName = process.env.BREVO_SENDER_NAME || 'SahakarGig Cooperative';
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': (process.env.BREVO_API_KEY || '').trim(),
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: cleanTo }],
          subject,
          htmlContent
        })
      });
      if (res.ok) {
        console.log(`[Email Sent via Brevo API] Delivered "${subject}" to ${cleanTo}`);
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn('[Brevo Warning]:', errData.message || res.statusText);
      }
    } catch (e) {
      console.error('[Brevo Error]:', e.message);
    }
  }

  // 2. Resend REST API
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(process.env.RESEND_API_KEY || '').trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'SahakarGig <onboarding@resend.dev>',
          to: [cleanTo],
          subject,
          html: htmlContent
        })
      });
      if (res.ok) {
        console.log(`[Email Sent via Resend API] Delivered "${subject}" to ${cleanTo}`);
        return true;
      }
    } catch (e) {
      console.error('[Resend Error]:', e.message);
    }
  }

  // 3. Gmail / SMTP via Nodemailer
  const transporter = getMailTransporter();
  if (transporter) {
    try {
      const senderUser = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"SahakarGig Security" <${senderUser}>`,
        to: cleanTo,
        subject,
        html: htmlContent
      });
      console.log(`[Email Sent via SMTP] Delivered "${subject}" to ${cleanTo}`);
      return true;
    } catch (e) {
      console.error('[SMTP Error]:', e.message);
    }
  }

  return false;
}

// 1. Customer Booking Confirmation Email Template
const getBookingConfirmationEmailHtml = ({ booking }) => `
  <div style="background-color: #f8fafc; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #111C26 0%, #1B4D3E 100%); padding: 32px 24px; text-align: center;">
        <div style="font-size: 28px; margin-bottom: 8px;">🛠️</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">Booking Confirmed!</h1>
        <p style="margin: 6px 0 0 0; color: #6ee7b7; font-size: 13px; font-weight: 700; font-family: monospace;">
          Booking ID: #${booking.id}
        </p>
      </div>

      <div style="padding: 30px 24px;">
        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
          Hello ${booking.customerName || 'Citizen'},
        </p>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 13px; line-height: 1.6;">
          Your service booking for <strong>${booking.subServiceName || booking.serviceTitle}</strong> is confirmed. A cooperative artisan is assigned to your location.
        </p>

        <!-- Start OTP Card -->
        <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px; padding: 18px; margin: 20px 0; text-align: center;">
          <div style="color: #166534; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
            Doorstep Start OTP (कारीगर के आने पर दें)
          </div>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1B4D3E; font-family: monospace; margin: 10px 0;">
            ${booking.startOtp}
          </div>
          <div style="color: #15803d; font-size: 11px;">
            Share this 4-digit code ONLY when the worker arrives at your door.
          </div>
        </div>

        <!-- Service Table -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin: 20px 0; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569;">
            <span>Service:</span> <strong style="color: #0f172a;">${booking.serviceTitle}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569;">
            <span>Package:</span> <strong style="color: #0f172a;">${booking.subServiceName || booking.serviceTitle}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #475569;">
            <span>Total Payable:</span> <strong style="color: #1B4D3E; font-size: 15px;">₹${booking.totalAmount}</strong>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px; color: #64748b; font-size: 12px;">
            <span>Address:</span> <strong>${booking.customerAddress || 'Customer Location'}</strong>
          </div>
        </div>

        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #065f46; line-height: 1.5;">
          <strong>Cooperative Model:</strong> 88% of your payment (₹${Math.round(booking.totalAmount * 0.88)}) goes directly to the worker, and 7% to their healthcare reserve.
        </div>
      </div>

      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px;">
        SahakarGig • Democratic Gig Work Protocol • Ministry of Cooperation Initiative
      </div>
    </div>
  </div>
`;

// 2. Worker Partner Gig Dispatch Email Template
const getWorkerGigDispatchEmailHtml = ({ booking }) => `
  <div style="background-color: #f8fafc; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #1c1917 0%, #b45309 100%); padding: 32px 24px; text-align: center;">
        <div style="font-size: 28px; margin-bottom: 8px;">🧰</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">New Gig Dispatched!</h1>
        <p style="margin: 6px 0 0 0; color: #fde68a; font-size: 13px; font-weight: 700; font-family: monospace;">
          Gig #${booking.id} • ${booking.serviceTitle}
        </p>
      </div>

      <div style="padding: 30px 24px;">
        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
          Hello Partner ${booking.workerName || ''},
        </p>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 13px; line-height: 1.6;">
          A new gig service matching your trade has been assigned to you near your GPS sector:
        </p>

        <!-- Payout Card -->
        <div style="background-color: #fffbeb; border: 2px solid #fde68a; border-radius: 14px; padding: 18px; margin: 20px 0; text-align: center;">
          <div style="color: #92400e; font-size: 11px; font-weight: 800; text-transform: uppercase;">
            Your Direct Payout (88% Artisan Share)
          </div>
          <div style="font-size: 36px; font-weight: 800; color: #b45309; font-family: monospace; margin: 8px 0;">
            ₹${Math.round(booking.totalAmount * 0.88)}
          </div>
          <div style="color: #78350f; font-size: 11px;">
            + ₹${Math.round(booking.totalAmount * 0.07)} credited to your Health Fund
          </div>
        </div>

        <!-- Details -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin: 20px 0; font-size: 13px;">
          <div style="margin-bottom: 6px; color: #475569;">
            Customer: <strong style="color: #0f172a;">${booking.customerName}</strong> (${booking.customerPhone || 'Verified Citizen'})
          </div>
          <div style="margin-bottom: 6px; color: #475569;">
            Address: <strong style="color: #0f172a;">${booking.customerAddress}</strong>
          </div>
          <div style="color: #475569;">
            Service: <strong style="color: #0f172a;">${booking.subServiceName || booking.serviceTitle}</strong>
          </div>
        </div>
      </div>

      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px;">
        SahakarGig Partner Network • Democratic Cooperative
      </div>
    </div>
  </div>
`;

// 3. Official Cooperative Invoice & Tax Receipt Email Template
const getInvoiceReceiptEmailHtml = ({ booking, recipientType = 'customer' }) => `
  <div style="background-color: #f8fafc; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #111C26 0%, #1B4D3E 100%); padding: 32px 24px; text-align: center;">
        <div style="font-size: 28px; margin-bottom: 8px;">🧾</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">Cooperative Tax Invoice</h1>
        <p style="margin: 6px 0 0 0; color: #6ee7b7; font-size: 13px; font-weight: 700; font-family: monospace;">
          Invoice #${booking.id} • Status: COMPLETED ✓
        </p>
      </div>

      <div style="padding: 30px 24px;">
        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 15px; font-weight: 600;">
          ${recipientType === 'worker' ? `Payout Receipt for ${booking.workerName}` : `Service Receipt for ${booking.customerName}`},
        </p>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 13px; line-height: 1.6;">
          The gig service <strong>${booking.subServiceName || booking.serviceTitle}</strong> has been successfully completed and mutually verified!
        </p>

        <!-- Breakdown Table -->
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 10px; border-bottom: 2px solid #cbd5e1;">Item</th>
              <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: center;">Share</th>
              <th style="padding: 10px; border-bottom: 2px solid #cbd5e1; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Artisan Payout (${booking.workerName || 'Worker'})</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #166534; font-weight: bold;">88%</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #166534; font-weight: bold;">₹${Math.round(booking.totalAmount * 0.88)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Healthcare & Welfare Reserve</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #0369a1; font-weight: bold;">7%</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0369a1; font-weight: bold;">₹${Math.round(booking.totalAmount * 0.07)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Platform IT Operations</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569; font-weight: bold;">5%</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #475569; font-weight: bold;">₹${Math.round(booking.totalAmount * 0.05)}</td>
            </tr>
            <tr style="background-color: #f8fafc; font-weight: bold;">
              <td style="padding: 12px; font-size: 14px;">Total Paid</td>
              <td style="padding: 12px; text-align: center;">100%</td>
              <td style="padding: 12px; text-align: right; font-size: 16px; color: #1B4D3E;">₹${booking.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px;">
        SahakarGig Cooperative • Official Receipt
      </div>
    </div>
  </div>
`;

// 4. Two-Factor Authenticator Passcode Email Template
const getOtpEmailHtml = ({ otp, name, role, recipient }) => `
  <div style="background-color: #f8fafc; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
      <div style="background: linear-gradient(135deg, #111C26 0%, #1B4D3E 100%); padding: 32px 24px; text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background-color: rgba(255,255,255,0.15); border-radius: 50%; color: #ffffff; font-size: 20px; font-weight: bold; margin-bottom: 12px;">★</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800;">Sahakar<span style="color: #6ee7b7; font-style: italic;">Gig</span></h1>
        <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
          Official Cooperative Two-Factor Authentication
        </p>
      </div>

      <div style="padding: 36px 32px; text-align: center;">
        <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
          ${name ? `Hello ${name}!` : 'Verify Your Identity'}
        </h2>
        <p style="margin: 0 0 24px 0; color: #475569; font-size: 14px;">
          Use the verification passcode below to authenticate your <strong>${role === 'worker' ? 'Cooperative Partner' : 'Citizen App'}</strong> account:
        </p>

        <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px; padding: 22px; margin: 24px 0;">
          <div style="font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #1B4D3E; font-family: monospace; margin-left: 10px;">
            ${otp}
          </div>
          <div style="margin-top: 10px; color: #15803d; font-size: 12px; font-weight: 700;">
            ⏱ Valid for 10 minutes only
          </div>
        </div>

        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 14px; text-align: left;">
          <p style="margin: 0; color: #9f1239; font-size: 12px; line-height: 1.4;">
            <strong>Security Advisory:</strong> Sahakar officers will NEVER ask for this passcode. If you did not initiate this request, discard this email.
          </p>
        </div>
      </div>

      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; color: #94a3b8; font-size: 11px;">
        This message was sent to <strong>${recipient}</strong> • Ministry of Cooperation Initiative
      </div>
    </div>
  </div>
`;

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

  // 1. Live Email Dispatch: Customer Booking Confirmation & Start OTP
  if (bookingData.customerEmail && bookingData.customerEmail.includes('@')) {
    sendCustomEmail({
      to: bookingData.customerEmail,
      subject: `[SahakarGig] Booking Confirmed #${bookingData.id} - ${bookingData.serviceTitle}`,
      htmlContent: getBookingConfirmationEmailHtml({ booking: bookingData })
    }).catch(err => console.warn('[Booking Email Error]:', err.message));
  }

  // 2. Live Email Dispatch: Worker Partner Gig Notification (if pre-assigned)
  if (bookingData.workerEmail && bookingData.workerEmail.includes('@')) {
    sendCustomEmail({
      to: bookingData.workerEmail,
      subject: `[SahakarGig Partner] New Gig Dispatched #${bookingData.id} - ₹${bookingData.totalAmount}`,
      htmlContent: getWorkerGigDispatchEmailHtml({ booking: bookingData })
    }).catch(err => console.warn('[Worker Gig Email Error]:', err.message));
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
  const current = inMemoryBookings.find(b => b.id === req.params.id) || {};
  const updatedBooking = { ...current, ...updates };

  // Update in-memory store
  inMemoryBookings = inMemoryBookings.map(b => {
    if (b.id === req.params.id) {
      return updatedBooking;
    }
    return b;
  });

  // 1. Live Email Dispatch: If Worker assigned/accepted, send dispatch notification
  if (updates.workerEmail && updates.workerEmail.includes('@') && updates.workerEmail !== current.workerEmail) {
    sendCustomEmail({
      to: updates.workerEmail,
      subject: `[SahakarGig Partner] New Gig Assigned #${req.params.id} - ₹${updatedBooking.totalAmount}`,
      htmlContent: getWorkerGigDispatchEmailHtml({ booking: updatedBooking })
    }).catch(err => console.warn('[Worker Assignment Email Error]:', err.message));
  }

  // 2. Live Email Dispatch: If Gig Completed, send official invoices & payout receipts
  if (updates.status === 'COMPLETED' && current.status !== 'COMPLETED') {
    if (updatedBooking.customerEmail && updatedBooking.customerEmail.includes('@')) {
      sendCustomEmail({
        to: updatedBooking.customerEmail,
        subject: `[SahakarGig Invoice] Receipt for #${req.params.id} (${updatedBooking.serviceTitle})`,
        htmlContent: getInvoiceReceiptEmailHtml({ booking: updatedBooking, recipientType: 'customer' })
      }).catch(err => console.warn('[Customer Receipt Email Error]:', err.message));
    }
    if (updatedBooking.workerEmail && updatedBooking.workerEmail.includes('@')) {
      sendCustomEmail({
        to: updatedBooking.workerEmail,
        subject: `[SahakarGig Payout] ₹${Math.round(updatedBooking.totalAmount * 0.88)} Credited for #${req.params.id}`,
        htmlContent: getInvoiceReceiptEmailHtml({ booking: updatedBooking, recipientType: 'worker' })
      }).catch(err => console.warn('[Worker Payout Email Error]:', err.message));
    }
  }

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
  res.json(updatedBooking);
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
// 9. Real OTP Authentication (Email APIs & SMTP)
// ==========================================
const otpStore = new Map();

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
    recipient: normalizedKey,
    role: role || 'user',
    name: name || '',
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes validity
  });

  console.log(`[OTP Generated] ${type.toUpperCase()} for ${normalizedKey}: ${otp}`);

  // Dispatch real email via Brevo API / SMTP
  const emailSent = await sendCustomEmail({
    to: normalizedKey,
    subject: `[SahakarGig] ${otp} is your verification passcode`,
    htmlContent: getOtpEmailHtml({ otp, name, role, recipient: normalizedKey })
  });

  return res.json({
    success: true,
    channel: 'email',
    recipient: normalizedKey,
    otp,
    realEmailSent: emailSent,
    message: emailSent 
      ? `Real security code dispatched to ${normalizedKey}` 
      : `Passcode generated for ${normalizedKey}. Enter code to verify.`
  });
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
