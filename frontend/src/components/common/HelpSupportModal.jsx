import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  ShieldAlert, 
  LifeBuoy, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileQuestion, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Clock
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function HelpSupportModal({ isOpen, onClose, defaultTab = 'hotline' }) {
  const { currentRole, customer, activeWorker, addNotification } = useAppState();
  const [activeTab, setActiveTab] = useState(defaultTab); // 'hotline' | 'dispute' | 'faqs'
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Dispute / Ticket Form
  const [ticketCategory, setTicketCategory] = useState('billing');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does the 88% - 7% - 5% cooperative split work?',
      a: 'Unlike traditional apps that take 25%-35% commission, SahakarGig guarantees 88% directly to the artisan. 7% is pooled into the worker healthcare, mutual pension, and emergency fund. Only 5% covers open-source server hosting and payment gateway fees. Zero corporate middleman margin.'
    },
    {
      q: 'Can I cancel my gig? Is there a cancellation penalty?',
      a: 'Under SahakarGig cooperative charter, citizens can cancel before work starts with 100% full refund and ZERO cancellation penalty. If an artisan has already reached your doorstep, a nominal ₹49 travel conveyance is credited to the worker from the platform reserve, not customer penalty.'
    },
    {
      q: 'Why are Start OTP and End OTP required?',
      a: 'Start OTP ensures work only commences when the verified artisan physically reaches your home. End OTP protects you from incomplete service—funds are only released from escrow to the worker wallet once you share the End OTP after inspecting the completed job.'
    },
    {
      q: 'How do workers access healthcare and pension benefits?',
      a: 'Every gig automatically contributes 7% to the worker’s society welfare ledger. Artisans can claim free outpatient OPD coverage, hospitalization reimbursement up to ₹2,00,000, and subsidized tool replacement financing through their cooperative dashboard.'
    }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketDescription.trim()) return;

    setTicketSubmitted(true);
    addNotification(
      'Cooperative Support Ticket Created',
      `Ticket #SUP-${Math.floor(1000 + Math.random() * 9000)} logged. An arbitration officer will assist within 15 minutes.`,
      'info'
    );

    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketDescription('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-['Outfit']">
                  Cooperative Help & Safety Center
                </h3>
                <span className="text-[10px] bg-rose-500 text-white font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  24x7 Live
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Immediate doorstep emergency, arbitration support & transparent FAQs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('hotline')}
            className={`pb-3 px-3 text-xs font-black transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hotline'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency SOS & Helplines</span>
          </button>
          <button
            onClick={() => setActiveTab('dispute')}
            className={`pb-3 px-3 text-xs font-black transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'dispute'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Raise Ticket / Complaint</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-3 px-3 text-xs font-black transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'faqs'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Help Guides & FAQs</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
          
          {/* TAB 1: Emergency & Helplines */}
          {activeTab === 'hotline' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Emergency Red SOS Banner */}
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-rose-950 font-['Outfit']">
                      National Doorstep Emergency SOS (Police / Ambulance)
                    </h4>
                    <p className="text-xs text-rose-800 font-medium">
                      One-touch priority dispatch to local police control & nearest hospital
                    </p>
                  </div>
                </div>
                <a
                  href="tel:112"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 112 SOS Now</span>
                </a>
              </div>

              {/* Cooperative Direct Support Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>24x7 Citizen Toll-Free Helpline</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Speak directly with the Pune Cooperative Federation control room.
                  </p>
                  <a
                    href="tel:+919823044819"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-emerald-700 hover:underline"
                  >
                    <span>📞 1800-200-SAHAKAR (+91 98230 44819)</span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Support Desk</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Instant chat support with duty officer for billing or ETA queries.
                  </p>
                  <a
                    href="https://wa.me/919823044819?text=Hello%20SahakarGig%20Support%2C%20I%20need%20assistance."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:underline"
                  >
                    <span>💬 Chat on WhatsApp (+91 98230 44819)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Safety Assurances */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                <div className="font-black text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>SahakarGig Safety & Doorstep Protection Protocol:</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>All cooperative technicians are police verified and NSDC certified.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>100% Escrow Protection: Payment is held safe until you share End OTP.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Live GPS Telemetry active throughout the artisan’s doorstep journey.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Raise Ticket / Dispute */}
          {activeTab === 'dispute' && (
            <div className="animate-in fade-in">
              {ticketSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-300 rounded-3xl space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 font-['Outfit']">
                    Ticket Logged with Cooperative Board!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your request has been routed to the duty arbitration officer. We will contact you at your registered phone or email within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Issue Category:
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="billing">💰 Billing / Pricing Discrepancy (88-7-5 Check)</option>
                      <option value="delay">⏱ Artisan Delay / Unreachable Specialist</option>
                      <option value="quality">🛠️ Work Quality or Incomplete Service</option>
                      <option value="safety">🛡️ Safety or Doorstep Conduct Concern</option>
                      <option value="other">📋 Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Describe the problem:
                    </label>
                    <textarea
                      rows={4}
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      placeholder="Please provide details (e.g. Booking ID, what happened, technician behavior, refund request)..."
                      className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Submitting as: <strong className="text-slate-800">{customer?.name || activeWorker?.name || 'Citizen'}</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Ticket</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: FAQs */}
          {activeTab === 'faqs' && (
            <div className="space-y-3 animate-in fade-in">
              {faqs.map((faq, idx) => {
                const isOpenFaq = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 transition"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpenFaq ? -1 : idx)}
                      className="w-full text-left flex items-center justify-between text-xs font-black text-slate-900 gap-3"
                    >
                      <span>{faq.q}</span>
                      {isOpenFaq ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpenFaq && (
                      <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2 pt-2 border-t border-slate-200">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Cooperative Mutual Aid & Fair Arbitration Charter</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
