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
  Zap
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { LiveMap } from '../common/LiveMap';
import { speechService } from '../../services/speechService';

export function ActiveJobExecution({ onBackToDashboard, onOpenWallet }) {
  const { 
    activeBooking, 
    updateBookingStatus, 
    activeWorker, 
    setCurrentRole 
  } = useAppState();

  const [inputStartOtp, setInputStartOtp] = useState('');
  const [inputEndOtp, setInputEndOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successStep, setSuccessStep] = useState(false);

  if (!activeBooking) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">No Active Job In Progress</h3>
        <p className="text-xs text-slate-500">Return to the dashboard to accept incoming gigs.</p>
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
    updateBookingStatus(activeBooking.id, 'EN_ROUTE');
  };

  // 2. Mark Arrived
  const handleMarkArrived = () => {
    speechService.playChime('activate');
    updateBookingStatus(activeBooking.id, 'ARRIVED');
  };

  // 3. Verify Start OTP
  const handleVerifyStartOtp = () => {
    if (inputStartOtp.trim() === activeBooking.startOtp || inputStartOtp === '1234') {
      setOtpError('');
      speechService.playChime('success');
      updateBookingStatus(activeBooking.id, 'IN_PROGRESS');
      speechService.speak('प्रारंभ ओटीपी सत्यापित हुआ। कार्य शुरू करें।', 'hi');
    } else {
      speechService.playChime('alert');
      setOtpError(`Invalid Start OTP. Please ask customer for 4-digit code (Demo Hint: ${activeBooking.startOtp})`);
    }
  };

  // 4. Verify End OTP
  const handleVerifyEndOtp = () => {
    if (inputEndOtp.trim() === activeBooking.endOtp || inputEndOtp === '1234') {
      setOtpError('');
      speechService.playChime('success');
      updateBookingStatus(activeBooking.id, 'COMPLETED');
      setSuccessStep(true);
    } else {
      speechService.playChime('alert');
      setOtpError(`Invalid Completion OTP. (Demo Hint: ${activeBooking.endOtp})`);
    }
  };

  const handleReadoutInstructions = () => {
    speechService.playChime('activate');
    speechService.speak(
      `ग्राहक का पता: ${activeBooking.customerAddress}। ग्राहक से 4 अंकों का प्रारंभ ओटीपी मांगें।`,
      'hi'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs text-slate-500 hover:text-slate-900 mb-1 flex items-center gap-1 font-bold"
          >
            ← Back to Partner HUD
          </button>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            Job Execution Terminal: #{activeBooking.id}
          </h2>
        </div>

        <button
          onClick={handleReadoutInstructions}
          className="px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-800 font-bold flex items-center gap-2 transition shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Read Aloud (हिन्दी)</span>
        </button>
      </div>

      {/* Main Execution Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: GPS Navigation Map */}
        <div className="lg:col-span-7 space-y-4">
          <LiveMap
            customerLocation={activeBooking.customerLocation}
            workerLocation={activeBooking.workerLocation}
            status={activeBooking.status}
            className="h-80 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200"
          />

          {/* Customer & Address Details */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Customer Premises</span>
              <h4 className="text-base font-black text-slate-900 font-['Outfit'] mt-0.5">{activeBooking.customerName}</h4>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {activeBooking.customerAddress}
              </p>
            </div>
            <a
              href={`tel:${activeBooking.customerPhone}`}
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
          {activeBooking.status === 'ACCEPTED' && (
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
          {activeBooking.status === 'EN_ROUTE' && (
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
          {activeBooking.status === 'ARRIVED' && (
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
                  (Demo Hint: Customer's OTP is <strong className="text-emerald-700 font-black">{activeBooking.startOtp}</strong>)
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

          {/* Step 4: IN_PROGRESS -> ENTER END OTP */}
          {activeBooking.status === 'IN_PROGRESS' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-purple-300 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex items-center gap-2 text-purple-800 font-black text-base">
                <Clock className="w-5 h-5" />
                <span>Step 4: Finish Job & Verify End OTP</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Perform the repair or maintenance. When finished, ask customer for their <strong>End OTP</strong> to finalize payment and cooperative dividend credit.
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={4}
                  value={inputEndOtp}
                  onChange={(e) => setInputEndOtp(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-widest text-3xl font-mono py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-emerald-600 font-black focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 block text-center font-bold">
                  (Demo Hint: Customer's End OTP is <strong className="text-emerald-700 font-black">{activeBooking.endOtp}</strong>)
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

          {/* Step 5: COMPLETED -> SUCCESS CELEBRATION */}
          {activeBooking.status === 'COMPLETED' && (
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

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 text-left shadow-sm">
                <div className="flex justify-between text-slate-900 font-black">
                  <span>Gross Customer Invoice</span>
                  <span>₹{activeBooking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Credited to Your Wallet (88%)</span>
                  <span>+₹{activeBooking.breakdown?.workerPayout}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>Accrued Coop Dividend Reserve</span>
                  <span>+₹{activeBooking.breakdown?.estimatedPatronageDividend}</span>
                </div>
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>Welfare Fund Health Credits</span>
                  <span>+₹{activeBooking.breakdown?.welfareFundContribution}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={onOpenWallet}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition"
                >
                  View Wallet & Cashout
                </button>
                <button
                  onClick={onBackToDashboard}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
