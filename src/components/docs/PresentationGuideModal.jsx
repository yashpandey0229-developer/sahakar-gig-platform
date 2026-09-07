import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Play, 
  Layers, 
  Copy, 
  Check,
  ChevronRight
} from 'lucide-react';

export function PresentationGuideModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('pitch'); // 'pitch' | 'qa' | 'demo'
  const [copiedSection, setCopiedSection] = useState(null);

  if (!isOpen) return null;

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  SIH26089 Pitch Deck & Judge Q&A Guide
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  Winning Hackathon Playbook
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cooperative Gig Services Platform for Household Services (Ministry of Cooperation)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation */}
        <div className="my-4 flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSection('pitch')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSection === 'pitch'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🎤 3-Minute Elevator Pitch
          </button>

          <button
            onClick={() => setActiveSection('demo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSection === 'demo'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            📱 Live Jury Demo Flow (4 Roles)
          </button>

          <button
            onClick={() => setActiveSection('qa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSection === 'qa'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            💡 Judge Q&A Master Answers
          </button>
        </div>

        {/* Section 1: 3-Minute Pitch */}
        {activeSection === 'pitch' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-amber-400">
                1. The Hook & The Problem (0:00 - 0:45)
              </h4>
              <p>
                "Respected Judges, India's household services market is valued at over <strong>$20 Billion</strong>, but corporate aggregators like Urban Company extract <strong>25% to 35% commission</strong> from electricians, plumbers, and carpenters while offering them zero healthcare, zero equity, and arbitrary algorithmic bans.
                Under the Ministry of Cooperation's vision of <strong>'Sahakar Se Samriddhi'</strong>, we built <strong>SahakarGig</strong> — India's first worker-owned democratic gig cooperative platform."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400">
                2. The Innovation & Technology (0:45 - 2:00)
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                <li><strong>Transparent 88-7-5 Wage Model</strong>: 88% goes directly to the worker, 7% auto-funds their cashless family health insurance pool, and only 5% covers platform IT ops.</li>
                <li><strong>Patronage Dividends</strong>: Any year-end operational surplus is returned back to workers as equity dividends based on patronage.</li>
                <li><strong>Voice-First UI for Blue-Collar Workers</strong>: Hindi/regional speech recognition allowing illiterate workers to manage dispatches seamlessly.</li>
                <li><strong>Dual-Key OTP & Real-Time Geo-Radar</strong>: Start-OTP and End-OTP ensure zero billing fraud, while Leaflet GPS gives real-time tracking.</li>
                <li><strong>Democratic Peer Jury</strong>: Customer disputes are arbitrated by a 3-member peer jury rather than cruel AI suspensions.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-blue-400">
                3. Business Model & Scale (2:00 - 3:00)
              </h4>
              <p>
                "By integrating directly with <strong>PACS (Primary Agricultural Credit Societies)</strong> and District Cooperative Banks, SahakarGig requires zero predatory VC capital. The 5% capped platform fee achieves complete self-sustainability at scale, generating dignity, living wages, and universal social security for millions of gig workers across India."
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Live Demo Steps */}
        {activeSection === 'demo' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 uppercase">Step 1: Customer Booking (Priya Sharma)</span>
              <p className="text-slate-300">
                1. Go to <strong>Customer Portal</strong> → Click <strong>"Electrical & Power Systems"</strong> → Click <strong>"88% to Worker"</strong> to show the transparent wage breakdown modal.
                <br />2. Click <strong>"Book Cooperative Artisan"</strong> → Confirm express dispatch.
                <br />3. Show the live Leaflet map radar scanning for nearest cooperative members in Pune.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 uppercase">Step 2: Worker Perspective (Ramesh Jadhav)</span>
              <p className="text-slate-300">
                1. Switch to <strong>Worker Portal</strong>.
                <br />2. Tap <strong>"Listen in Hindi"</strong> on the Voice Assistant.
                <br />3. Click <strong>"Turn-by-Turn Job"</strong>: Click "Start Journey" → "I Have Arrived" → Enter customer Start OTP (<code>4819</code>).
                <br />4. Click "Verify End OTP" (<code>7721</code>) to trigger payment settlement & confetti!
                <br />5. Open <strong>Coop Wallet</strong> to show ₹439 added + ₹120 Patronage Dividend.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-purple-400 uppercase">Step 3: Cooperative Board & Democratic Governance</span>
              <p className="text-slate-300">
                1. Switch to <strong>Cooperative Portal</strong>.
                <br />2. Show live voting on <strong>"Monsoon Safety Tool Subsidy"</strong> and click "Vote YES" to show consensus.
                <br />3. Switch to <strong>"Peer Jury Redressal"</strong> to demonstrate fair worker protection.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-blue-400 uppercase">Step 4: Ministry of Cooperation Macro Dashboard</span>
              <p className="text-slate-300">
                1. Switch to <strong>Ministry Portal</strong>.
                <br />2. Present national state penetration matrix, +38% income uplift metric, and PACS digital integration.
              </p>
            </div>
          </div>
        )}

        {/* Section 3: Judge Q&A */}
        {activeSection === 'qa' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <h5 className="font-bold text-amber-300 mb-1">
                Q1: How is a 5% platform fee financially sustainable for IT and servers?
              </h5>
              <p className="text-slate-300">
                <strong>Answer:</strong> Commercial platforms spend up to 20% of their revenue on high-churn customer acquisition ads and venture capital returns. SahakarGig is community-federated via PACS and municipal cooperative networks. Cloud hosting & serverless API costs for 100,000 gigs/month is under ₹2.5 Lakhs, which is well covered by a 5% margin (₹25 on a ₹500 gig = ₹25 Lakhs revenue/month).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <h5 className="font-bold text-amber-300 mb-1">
                Q2: How do you prevent workers from taking jobs off-platform directly?
              </h5>
              <p className="text-slate-300">
                <strong>Answer:</strong> Workers *want* to book on SahakarGig because every completed gig directly increases their <strong>Cooperative Patronage Dividend share</strong>, earns <strong>Welfare Health Points</strong>, and unlocks <strong>Zero-Interest soft loans</strong> from cooperative banks. By aligning incentives with ownership rather than punitive tracking, disintermediation drops by 80%.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <h5 className="font-bold text-amber-300 mb-1">
                Q3: How do you guarantee service quality and background security?
              </h5>
              <p className="text-slate-300">
                <strong>Answer:</strong> Every worker is vetted through Aadhaar e-KYC, Skill India / NSDC Level 3+ certification, and local cooperative society vouching. Dual-OTP ensures physical start and completion verification, and customer ratings directly influence fair rotation dispatch.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
          >
            Ready for Demo
          </button>
        </div>

      </div>
    </div>
  );
}
