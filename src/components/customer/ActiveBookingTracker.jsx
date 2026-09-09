import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Star, 
  Radio, 
  KeyRound, 
  Award, 
  AlertCircle, 
  ChevronRight,
  Zap,
  Check,
  Navigation,
  Sparkles,
  Copy,
  Receipt,
  FileText,
  Image as ImageIcon,
  LifeBuoy,
  Ban,
  AlertTriangle,
  HelpCircle,
  X
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { LiveMap } from '../common/LiveMap';
import { CooperativeReceiptModal } from '../common/CooperativeReceiptModal';
import { HelpSupportModal } from '../common/HelpSupportModal';
import { speechService } from '../../services/speechService';

export function ActiveBookingTracker({ booking, onOpenReviewModal }) {
  const { updateBookingStatus, setCurrentRole, setActiveWorkerId, addNotification } = useAppState();
  const [copiedOtp, setCopiedOtp] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Issue resolved on my own');

  if (!booking) return null;

  const handleConfirmCancel = () => {
    updateBookingStatus(booking.id, 'CANCELLED');
    setShowCancelModal(false);
    speechService.playChime('alert');
    speechService.speak('आपकी बुकिंग रद्द कर दी गई है। पूरा रिफंड आपके खाते में जमा है।', 'hi');
    addNotification(
      'Booking Cancelled',
      `Booking #${booking.id} was cancelled. Reason: ${cancelReason}. 100% full refund initiated.`,
      'info'
    );
  };

  const steps = [
    { key: 'BROADCASTING', label: 'Broadcasting', desc: 'Radar scan active' },
    { key: 'ACCEPTED', label: 'Accepted', desc: 'Artisan assigned' },
    { key: 'EN_ROUTE', label: 'En Route', desc: 'Live GPS telemetry' },
    { key: 'ARRIVED', label: 'Arrived', desc: 'Doorstep reached' },
    { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Service execution' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Settled & reviewed' }
  ];

  const getStepIndex = (status) => {
    return steps.findIndex(s => s.key === status);
  };

  const currentIndex = getStepIndex(booking.status);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedOtp(type);
    setTimeout(() => setCopiedOtp(null), 2000);
  };

  const switchToWorkerPerspective = () => {
    if (booking.workerId) {
      setActiveWorkerId(booking.workerId);
    }
    setCurrentRole('worker');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200 animate-in fade-in">
      
      {/* Tracker Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
              Live Mission Control: #{booking.id}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-300 font-mono font-bold">
              MongoDB Synced
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
            {booking.subServiceName || booking.serviceTitle}
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {booking.customerAddress}
          </p>
        </div>

        {/* Customer Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`tel:${booking.workerPhone || '9823044819'}`}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            title="Call assigned technician directly"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Specialist</span>
          </a>

          {/* Help & Support Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-300 shadow-sm"
            title="Emergency SOS & 24/7 Helpline"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
            <span>Help & SOS</span>
          </button>

          {/* Cancel Gig Button (Available if not yet completed or cancelled) */}
          {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Cancel booking with zero penalty"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Gig</span>
            </button>
          )}

          {booking.status === 'CANCELLED' && (
            <span className="px-3.5 py-1.5 rounded-2xl bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs">
              Booking Cancelled
            </span>
          )}
        </div>
      </div>

      {/* Progress Step Pipeline */}
      <div className="relative pt-2">
        <div className="grid grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-100'
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 scale-110 shadow-lg shadow-amber-500/30'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-[11px] font-bold mt-2 hidden sm:block ${
                  isCurrent ? 'text-amber-600' : isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
                <span className="text-[9px] text-slate-400 hidden md:block">{step.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Map + Right Worker & Dual-OTP Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left Column: Interactive Live Map */}
        <div className="lg:col-span-7 space-y-4">
          <LiveMap
            customerLocation={booking.customerLocation}
            workerLocation={booking.workerLocation}
            status={booking.status}
            className="h-80 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200"
          />

          {/* Customer Safety & Quality Assurance Strip */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Doorstep Verification: Only share Start OTP <strong>({booking.startOtp})</strong> when technician reaches your home.</span>
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold rounded-lg text-[11px]">
              Customer Safe
            </span>
          </div>

          {/* Job Evidence & Photo Audit Strip */}
          {(booking.problemPhoto || booking.completionPhoto) && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Job Evidence & Inspection Photos</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">
                  Mutual Verification
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {booking.problemPhoto && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">1. Your Reported Issue:</span>
                    <img 
                      src={booking.problemPhoto} 
                      alt="Reported problem" 
                      className="w-full h-24 sm:h-28 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                  </div>
                )}
                {booking.completionPhoto && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-700 font-bold block">2. Worker Fixed Proof:</span>
                    <img 
                      src={booking.completionPhoto} 
                      alt="Fixed work completion" 
                      className="w-full h-24 sm:h-28 object-cover rounded-xl border border-emerald-300 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Worker Profile & Dual-OTP Security Pass */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Worker Identity Card */}
          {booking.workerName ? (
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-3.5">
                <img
                  src={booking.workerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                  alt={booking.workerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900">{booking.workerName}</h4>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {booking.workerRating || '4.9'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-bold">
                    {booking.workerSociety || 'Pune Tech & Maintenance Cooperative'}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Skill India & NSDC Level 4 Certified</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={`tel:${booking.workerPhone || '9823044819'}`}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Artisan</span>
                </a>
                <span className="text-xs text-slate-500 font-bold">
                  ETA: <strong className="text-slate-900">{booking.etaMins || 10} mins</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center animate-pulse">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Scanning Cooperative Radar...</h4>
              <p className="text-xs text-slate-500">
                Pinging qualified artisans in your neighborhood.
              </p>
            </div>
          )}

          {/* 🎫 Authenticated Dual-OTP Security Ticket */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-300 space-y-3 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Dual-Key Security Verification Ticket</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black border border-emerald-300 uppercase">
                Anti-Fraud
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start OTP */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center shadow-sm relative group">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">
                  1. Job-Start OTP
                </span>
                <div 
                  onClick={() => copyToClipboard(booking.startOtp, 'start')}
                  className="text-2xl font-mono font-black text-amber-600 tracking-widest cursor-pointer hover:scale-105 transition"
                  title="Click to copy"
                >
                  {booking.startOtp}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block font-medium">
                  {copiedOtp === 'start' ? '✓ Copied!' : 'Give upon physical arrival'}
                </span>
              </div>

              {/* End OTP */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-center shadow-sm relative group">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">
                  2. Job-End OTP
                </span>
                <div 
                  onClick={() => copyToClipboard(booking.endOtp, 'end')}
                  className="text-2xl font-mono font-black text-emerald-600 tracking-widest cursor-pointer hover:scale-105 transition"
                  title="Click to copy"
                >
                  {booking.endOtp}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block font-medium">
                  {copiedOtp === 'end' ? '✓ Copied!' : 'Give after work is completed'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Breakdown Snapshot with 88-7-5 Split */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-black text-slate-900 text-sm">
              <span>Total Service Invoice</span>
              <span>₹{booking.totalAmount}</span>
            </div>
            <div className="space-y-1 pt-1 border-t border-slate-200">
              <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                <span>1. Artisan Direct Payout (88%)</span>
                <span>₹{booking.breakdown?.workerPayout || Math.round(booking.totalAmount * 0.88)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-700 font-semibold">
                <span>2. Healthcare & Pension Pool (7%)</span>
                <span>₹{booking.breakdown?.welfareFundContribution || Math.round(booking.totalAmount * 0.07)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                <span>3. Open-Source IT & Protocols (5%)</span>
                <span>₹{booking.breakdown?.platformMaintenance || Math.round(booking.totalAmount * 0.05)}</span>
              </div>
            </div>
          </div>

          {/* Receipt View & Download Button (Available anytime or on completion) */}
          <button
            onClick={() => setShowReceiptModal(true)}
            className="w-full py-3 rounded-2xl bg-white border-2 border-emerald-500/50 hover:bg-emerald-50 text-emerald-800 font-black text-xs flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>View & Download 88-7-5 Tax Receipt (PDF)</span>
          </button>

          {/* Rating button & verification card if completed */}
          {booking.status === 'COMPLETED' && (
            booking.ratingGiven ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 space-y-2.5 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Verified Rating Stamped
                  </span>
                  <span className="text-xs font-mono font-black text-amber-900">
                    {booking.ratingGiven}.0 / 5.0
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= booking.ratingGiven
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-black text-slate-800 ml-1.5">
                    {booking.ratingGiven === 5 ? '⭐⭐⭐⭐⭐ Outstanding (5 Stars)' : `${booking.ratingGiven} Stars Given`}
                  </span>
                </div>

                {booking.reviewText && (
                  <p className="text-xs text-slate-700 bg-white/90 p-2.5 rounded-xl border border-amber-200/80 italic font-medium leading-relaxed">
                    "{booking.reviewText}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-amber-200/70 text-[11px]">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Live on {booking.workerName || 'worker'}'s profile
                  </span>
                  <button
                    onClick={() => onOpenReviewModal(booking)}
                    className="text-amber-900 hover:text-amber-950 font-bold underline cursor-pointer"
                  >
                    Update Rating
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-400 shadow-md space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Rate {booking.workerName || 'Artisan'} in 5 Stars
                    </h4>
                  </div>
                  <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                    Awaiting Rating
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  Rate your doorstep experience. Your 5-star rating directly reflects on {booking.workerName || 'artisan'}'s cooperative profile and priority dispatch!
                </p>

                <button
                  onClick={() => onOpenReviewModal(booking)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Rate in 5 Stars & Leave Praise (5 स्टार रेटिंग दें)</span>
                </button>
              </div>
            )
          )}

        </div>

      </div>

      {/* Reusable Cooperative Tax Invoice Modal */}
      <CooperativeReceiptModal
        booking={booking}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />

      {/* 24x7 Help & Safety SOS Modal */}
      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Customer Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-700 font-black text-base font-['Outfit']">
                <AlertTriangle className="w-5 h-5" />
                <span>Cancel Service Booking</span>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Are you sure you want to cancel booking <strong>#{booking.id}</strong> ({booking.subServiceName || booking.serviceTitle})?
            </p>

            {/* Cooperative Zero Penalty Guarantee Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>🛡️ Cooperative Charter Guarantee:</span>
              </span>
              <p className="text-[11px] text-emerald-800 font-medium">
                100% full refund of ₹{booking.totalAmount}. <strong>Zero cancellation penalty</strong> applies under cooperative rules.
              </p>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                Reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Issue resolved on my own">Issue resolved on my own (समस्या खुद ठीक हो गई)</option>
                <option value="Booked wrong service by mistake">Booked wrong service by mistake (गलती से गलत सेवा चुन ली)</option>
                <option value="Specialist taking too long / delayed">Artisan delayed / Taking too long (कारीगर आने में ज्यादा देर लग रही है)</option>
                <option value="Emergency / Leaving premises">Emergency / Not at home (अचानक बाहर जाना पड़ रहा है)</option>
                <option value="Other">Other reason (अन्य कारण)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Ban className="w-4 h-4" />
                <span>Yes, Cancel Gig</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
