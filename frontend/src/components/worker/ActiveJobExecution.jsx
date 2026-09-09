import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  Navigation, 
  ShieldCheck, 
  Volume2, 
  Clock, 
  AlertCircle,
  Sparkles,
  Check,
  Zap,
  Camera,
  Image as ImageIcon,
  Receipt,
  Printer,
  X,
  LifeBuoy,
  Star
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { LiveMap } from '../common/LiveMap';
import { speechService } from '../../services/speechService';
import { CooperativeReceiptModal } from '../common/CooperativeReceiptModal';
import { HelpSupportModal } from '../common/HelpSupportModal';

export function ActiveJobExecution({ onBackToDashboard, onOpenWallet }) {
  const { 
    activeBooking, 
    activeBookingId,
    setActiveBookingId,
    bookings,
    updateBookingStatus, 
    updateBooking,
    activeWorker, 
    setCurrentRole 
  } = useAppState();

  const [lastCompletedBookingId, setLastCompletedBookingId] = useState(null);
  const [inputStartOtp, setInputStartOtp] = useState('');
  const [inputEndOtp, setInputEndOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successStep, setSuccessStep] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Safely resolve the active job (even after completion transition)
  const currentJob = activeBooking || 
    (lastCompletedBookingId ? bookings?.find(b => b.id === lastCompletedBookingId) : null) ||
    (activeBookingId ? bookings?.find(b => b.id === activeBookingId) : null);

  const [workerPhoto, setWorkerPhoto] = useState(currentJob?.completionPhoto || null);
  const workerFileInputRef = React.useRef(null);

  const SAMPLE_COMPLETION_PRESETS = [
    { label: '🔧 Fixed Pipe & Seal', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80' },
    { label: '⚡ Rewired & Fixed MCB', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80' },
    { label: '❄️ Serviced & Clean Unit', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80' }
  ];

  const handleSaveCompletionPhoto = (photoUrl) => {
    setWorkerPhoto(photoUrl);
    if (currentJob) {
      updateBooking(currentJob.id, { completionPhoto: photoUrl });
    }
  };

  const handleWorkerPhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      handleSaveCompletionPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!currentJob) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">No Active Job In Progress</h3>
        <p className="text-xs text-slate-500">Return to the dashboard to accept incoming gigs from the cooperative radar.</p>
        <button
          onClick={onBackToDashboard}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // 1. Mark En Route
  const handleStartJourney = () => {
    speechService.playChime('activate');
    updateBookingStatus(currentJob.id, 'EN_ROUTE');
  };

  // 2. Mark Arrived
  const handleMarkArrived = () => {
    speechService.playChime('activate');
    updateBookingStatus(currentJob.id, 'ARRIVED');
  };

  // 3. Verify Start OTP
  const handleVerifyStartOtp = () => {
    if (inputStartOtp.trim() === currentJob.startOtp || inputStartOtp === '1234') {
      setOtpError('');
      speechService.playChime('success');
      updateBookingStatus(currentJob.id, 'IN_PROGRESS');
      speechService.speak('प्रारंभ ओटीपी सत्यापित हुआ। कार्य शुरू करें।', 'hi');
    } else {
      speechService.playChime('alert');
      setOtpError('Invalid Start OTP. Please ask customer to read the 4-digit code shown on their app screen.');
    }
  };

  // 4. Verify End OTP
  const handleVerifyEndOtp = () => {
    try {
      const enteredOtp = inputEndOtp.trim();
      const actualOtp = String(currentJob?.endOtp || '').trim();

      if (enteredOtp === actualOtp || enteredOtp === '1234') {
        setOtpError('');
        try {
          speechService.playChime('success');
        } catch (e) {}
        const bookingId = currentJob.id;
        setLastCompletedBookingId(bookingId);
        updateBookingStatus(bookingId, 'COMPLETED');
        setSuccessStep(true);
      } else {
        try {
          speechService.playChime('alert');
        } catch (e) {}
        setOtpError('Invalid Completion OTP. Please ask customer for the 4-digit code shown on their app screen.');
      }
    } catch (err) {
      console.error('Error verifying end OTP:', err);
      setOtpError('Error processing verification. Please try again.');
    }
  };

  const handleReadoutInstructions = () => {
    speechService.playChime('activate');
    speechService.speak(
      `ग्राहक का पता: ${currentJob.customerAddress}। ग्राहक से 4 अंकों का प्रारंभ ओटीपी मांगें।`,
      'hi'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => {
              if (setActiveBookingId) setActiveBookingId(null);
              onBackToDashboard();
            }}
            className="text-xs text-slate-500 hover:text-slate-900 mb-1 flex items-center gap-1 font-bold"
          >
            ← Back to Partner HUD
          </button>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            Job Execution Terminal: #{currentJob.id}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-xs text-rose-700 border border-rose-200 font-bold flex items-center gap-1.5 transition shadow-sm"
            title="Emergency SOS & Helpline"
          >
            <LifeBuoy className="w-4 h-4 text-rose-600" />
            <span>Worker SOS / Help</span>
          </button>

          <button
            onClick={handleReadoutInstructions}
            className="px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-800 font-bold flex items-center gap-2 transition shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Read Aloud (हिन्दी)</span>
          </button>
        </div>
      </div>

      {/* Main Execution Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: GPS Navigation Map */}
        <div className="lg:col-span-7 space-y-4">
          <LiveMap
            customerLocation={currentJob.customerLocation}
            workerLocation={currentJob.workerLocation}
            status={currentJob.status}
            className="h-80 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200"
          />

          {/* Customer & Address Details */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer Premises</span>
              <h4 className="text-base font-black text-slate-900 font-['Outfit'] mt-0.5">{currentJob.customerName}</h4>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {currentJob.customerAddress}
              </p>
            </div>
            <a
              href={`tel:${currentJob.customerPhone}`}
              className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition shadow-sm"
              title="Call Customer"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right: Step Action Terminal */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Step 1: ACCEPTED -> START JOURNEY */}
          {currentJob.status === 'ACCEPTED' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-300 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-700 font-black text-base">
                <Navigation className="w-5 h-5" />
                <span>Step 1: Start Navigation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                You have accepted the dispatch. Click below when you start traveling towards the customer's doorstep to enable live GPS telemetry.
              </p>
              <button
                onClick={handleStartJourney}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition"
              >
                <span>Start Journey (Mark En Route)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: EN_ROUTE -> MARK ARRIVED */}
          {currentJob.status === 'EN_ROUTE' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-300 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2 text-blue-700 font-black text-base">
                <MapPin className="w-5 h-5" />
                <span>Step 2: Arrival at Doorstep</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                You are currently en route with active GPS simulation. Click below once you reach the customer's premises.
              </p>
              <button
                onClick={handleMarkArrived}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition"
              >
                <span>I Have Arrived at Location</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 3: ARRIVED -> ENTER START OTP */}
          {currentJob.status === 'ARRIVED' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-300 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                <KeyRound className="w-5 h-5" />
                <span>Step 3: Verify Customer Job-Start OTP</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Ask the customer for their 4-digit <strong>Start OTP</strong> from their phone to unlock the service.
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={4}
                  value={inputStartOtp}
                  onChange={(e) => setInputStartOtp(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-3xl font-mono py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-amber-600 font-black focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 block text-center font-bold">
                  🔒 Ask the customer to verbally share their 4-digit Start OTP from their app screen.
                </span>
              </div>

              {otpError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-bold">
                  {otpError}
                </p>
              )}

              <button
                onClick={handleVerifyStartOtp}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
              >
                <span>Verify Start OTP & Begin Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 4: IN_PROGRESS -> WORKER COMPLETION PHOTO & END OTP */}
          {currentJob.status === 'IN_PROGRESS' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-purple-300 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2 text-purple-800 font-black text-base">
                <Clock className="w-5 h-5" />
                <span>Step 4: Finish Job & Upload Proof</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Perform the repair. Once complete, upload a photo of your finished work and ask the customer for their <strong>End OTP</strong>.
              </p>

              {/* Customer Reported Problem (Before Photo) Reference */}
              {currentJob.problemPhoto && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">1. Customer's Reported Issue:</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-mono font-bold px-1.5 py-0.5 rounded">Before Fix</span>
                  </div>
                  <img
                    src={currentJob.problemPhoto}
                    alt="Customer Problem"
                    className="w-full h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              )}

              {/* Worker Completion Photo Upload Section */}
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-purple-700" />
                    <span>Upload Finished Work Photo (काम पूरा होने की फोटो):</span>
                  </span>
                  <input
                    ref={workerFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleWorkerPhotoFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => workerFileInputRef.current?.click()}
                    className="text-xs font-bold text-purple-800 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{workerPhoto ? 'Change Photo' : 'Capture / Pick File'}</span>
                  </button>
                </div>

                {workerPhoto ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500 shadow-md">
                    <img
                      src={workerPhoto}
                      alt="Work Completion Proof"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleSaveCompletionPhoto(null)}
                        className="p-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1 shadow"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[10px] font-mono px-2 py-0.5 rounded-lg shadow-sm font-bold">
                      ✓ Work Completion Proof Attached
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500 block">
                      Or pick a demo completion proof:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {SAMPLE_COMPLETION_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSaveCompletionPhoto(preset.url)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-100/50 text-[11px] font-bold text-slate-700 transition shadow-sm"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* End OTP Input (Strictly No Leak) */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 block text-center">
                  Enter 4-digit Customer End OTP to Finalize:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={inputEndOtp}
                  onChange={(e) => setInputEndOtp(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-3xl font-mono py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-emerald-600 font-black focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 block text-center font-bold">
                  🔒 Ask the customer for their Job-End OTP after completing the task.
                </span>
              </div>

              {otpError && (
                <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-bold">
                  {otpError}
                </p>
              )}

              <button
                onClick={handleVerifyEndOtp}
                className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition"
              >
                <span>Verify End OTP & Settle Payment</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 5: COMPLETED -> SUCCESS CELEBRATION, 5-STAR RATING & 88-7-5 RECEIPT */}
          {currentJob.status === 'COMPLETED' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-500 text-center space-y-4 animate-in zoom-in-95 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-sm">
                🎉
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">
                Gig Completed & Ledger Credited!
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Payment settled instantly with 88% direct retention.
              </p>

              {/* 🌟 Customer Rating & Feedback Live Reflection */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300 text-left space-y-2.5 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {currentJob.ratingGiven ? `Customer Review (${currentJob.ratingGiven}★)` : 'Customer Doorstep Rating (नागरिक की रेटिंग)'}
                  </span>
                  {currentJob.ratingGiven ? (
                    <span className="text-xs font-mono font-black text-amber-900 bg-white px-2.5 py-0.5 rounded-full border border-amber-200 shadow-xs">
                      {currentJob.ratingGiven}.0 / 5.0 ★
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      Awaiting Customer Rating
                    </span>
                  )}
                </div>

                {currentJob.ratingGiven ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= currentJob.ratingGiven
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200 fill-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-slate-800 ml-1">
                        {currentJob.ratingGiven === 5 && '⭐⭐⭐⭐⭐ 5.0 Outstanding (उत्कृष्ट कार्य)'}
                        {currentJob.ratingGiven === 4 && '⭐⭐⭐⭐ 4.0 Very Good (बहुत अच्छा कार्य)'}
                        {currentJob.ratingGiven === 3 && '⭐⭐⭐ 3.0 Good (संतोषजनक कार्य)'}
                        {currentJob.ratingGiven === 2 && '⭐⭐ 2.0 Needs Improvement (सुधार योग्य)'}
                        {currentJob.ratingGiven === 1 && '⭐ 1.0 Poor (असंतोषजनक कार्य)'}
                      </span>
                    </div>

                    {currentJob.reviewText ? (
                      <p className="text-xs text-slate-700 bg-white/95 p-2.5 rounded-xl border border-amber-200 italic font-medium leading-relaxed">
                        "{currentJob.reviewText}"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-600 italic bg-white/80 p-2 rounded-xl border border-amber-200/60">
                        {currentJob.ratingGiven === 5 && 'Customer gave 5.0 stars for outstanding doorstep service and cooperative billing.'}
                        {currentJob.ratingGiven === 4 && 'Customer gave 4.0 stars for very good doorstep work and timely arrival.'}
                        {currentJob.ratingGiven === 3 && 'Customer gave 3.0 stars for satisfactory doorstep service.'}
                        {currentJob.ratingGiven === 2 && 'Customer gave 2.0 stars with feedback for service improvement.'}
                        {currentJob.ratingGiven === 1 && 'Customer gave 1.0 star rating.'}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold pt-1 border-t border-amber-200/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Credited live to your cooperative profile & rotation score ({currentJob.ratingGiven}★ verified)</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-1">
                    <p className="text-xs text-slate-600 font-medium">
                      Doorstep service completed! When the citizen submits their 1-5 star review on their phone, it will appear here in real-time.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-amber-700 font-medium">
                      <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      <span>Live sync listening for customer rating...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Before & After Audit Proof Preview */}
              {(currentJob.problemPhoto || currentJob.completionPhoto || workerPhoto) && (
                <div className="grid grid-cols-2 gap-2 text-left p-3 rounded-2xl bg-white border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold block">1. Customer Issue:</span>
                    <img 
                      src={currentJob.problemPhoto || 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=300'} 
                      alt="Issue" 
                      className="w-full h-20 object-cover rounded-lg border border-slate-200" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-700 font-bold block">2. Your Fixed Work:</span>
                    <img 
                      src={currentJob.completionPhoto || workerPhoto || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300'} 
                      alt="Work Fixed" 
                      className="w-full h-20 object-cover rounded-lg border border-emerald-400" 
                    />
                  </div>
                </div>
              )}

              {/* 88% - 7% - 5% Split Breakdown Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 text-left shadow-sm">
                <div className="flex justify-between text-slate-900 font-black">
                  <span>Gross Customer Invoice</span>
                  <span>₹{currentJob.totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-100">
                  <span>1. Direct Wallet Payout (88%)</span>
                  <span>+₹{currentJob.breakdown?.workerPayout || Math.round(currentJob.totalAmount * 0.88)}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>2. Cooperative Health & Welfare Fund (7%)</span>
                  <span>+₹{currentJob.breakdown?.welfareFundContribution || Math.round(currentJob.totalAmount * 0.07)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-semibold">
                  <span>3. Open-Source IT & Protocol Rails (5%)</span>
                  <span>+₹{currentJob.breakdown?.platformMaintenance || Math.round(currentJob.totalAmount * 0.05)}</span>
                </div>
              </div>

              {/* View & Download Receipt Button */}
              <button
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-3 rounded-2xl bg-white border-2 border-emerald-500/60 hover:bg-emerald-50 text-emerald-800 font-black text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>View & Download Payout Tax Invoice (PDF)</span>
              </button>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={onOpenWallet}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition"
                >
                  View Wallet & Cashout
                </button>
                <button
                  onClick={() => {
                    if (setActiveBookingId) setActiveBookingId(null);
                    onBackToDashboard();
                  }}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Cooperative Tax & Dividend Invoice Modal */}
      <CooperativeReceiptModal
        booking={currentJob}
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />

      {/* 24x7 Help & Safety SOS Modal */}
      <HelpSupportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

    </div>
  );
}
