import React, { useState } from 'react';
import { 
  HardHat, 
  Power, 
  MapPin, 
  Phone, 
  Star, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Volume2, 
  Check, 
  X, 
  Radio, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { speechService } from '../../services/speechService';

export function WorkerDashboard({ onOpenJobExecution, onOpenWallet }) {
  const { 
    activeWorker, 
    activeBooking, 
    updateBookingStatus, 
    language 
  } = useAppState();

  const [isOnline, setIsOnline] = useState(true);

  const handleReadoutGig = (booking) => {
    speechService.playChime('alert');
    const text = `नया कार्य: ${booking.subServiceName || booking.serviceTitle}, ग्राहक का पता: ${booking.customerAddress}, आपकी शुद्ध कमाई: ₹${booking.breakdown?.workerPayout} रुपये। क्या आप इसे स्वीकार करेंगे?`;
    speechService.speak(text, 'hi');
  };

  const handleAcceptGig = (bookingId) => {
    speechService.playChime('success');
    updateBookingStatus(bookingId, 'ACCEPTED');
    speechService.speak('कार्य स्वीकार किया गया! ग्राहक के स्थान के लिए प्रस्थान करें।', 'hi');
  };

  return (
    <div className="space-y-6">
      
      {/* High-Visibility Daylight Driver HUD Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md relative overflow-hidden">
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <img
              src={activeWorker.avatar}
              alt={activeWorker.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-amber-500 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                {activeWorker.name}
              </h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-black tracking-wider uppercase">
                COOP MEMBER
              </span>
            </div>
            <p className="text-xs text-amber-800 font-bold mt-0.5">
              {activeWorker.societyName}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
              <span className="flex items-center gap-1 text-amber-800 font-black bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {activeWorker.rating} ({activeWorker.totalJobsCompleted} jobs)
              </span>
              <span>•</span>
              <span className="text-slate-500 font-mono text-[11px] font-bold">
                Member ID: {activeWorker.cooperativeMemberId}
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                NSDC Level 4 Certified
              </span>
            </div>
          </div>
        </div>

        {/* Giant One-Tap Duty Status Toggle */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end relative z-10">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider">Radar Duty</span>
            <span className={`text-xs sm:text-sm font-black ${isOnline ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isOnline ? '🟢 Online & Ready' : '🔴 On Break'}
            </span>
          </div>

          <button
            onClick={() => {
              speechService.playChime('activate');
              setIsOnline(!isOnline);
            }}
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-center gap-2 ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 scale-105 border-emerald-500'
                : 'bg-white border-slate-300 text-slate-400 hover:text-slate-700'
            }`}
            title="Toggle Duty Status"
          >
            <Power className="w-7 h-7" />
          </button>
        </div>

      </div>

      {/* 4 Financial & Dividend Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Available Cashout Balance */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-emerald-500 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-bold">
            <span>Available Balance</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{activeWorker.wallet.availableBalance.toLocaleString()}
          </div>
          <button
            onClick={onOpenWallet}
            className="mt-3 text-xs text-emerald-700 hover:underline flex items-center gap-1 font-bold"
          >
            <span>Instant Cashout to UPI</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Accrued Patronage Dividends */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-amber-500 transition">
          <div className="flex items-center justify-between text-xs text-amber-700 mb-1 font-bold">
            <span>Patronage Dividends</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">
            ₹{activeWorker.wallet.patronageDividends.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 font-medium">
            Quarterly cooperative profit share
          </span>
        </div>

        {/* Welfare Points */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-blue-500 transition">
          <div className="flex items-center justify-between text-xs text-blue-700 mb-1 font-bold">
            <span>Welfare Credits</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600">
            {activeWorker.wallet.welfarePoints} pts
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 font-medium">
            Health insurance & micro-credit pool
          </span>
        </div>

        {/* Fair Rotation Score */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-purple-500 transition">
          <div className="flex items-center justify-between text-xs text-purple-700 mb-1 font-bold">
            <span>Fair-Rotation Score</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-purple-600">
            {activeWorker.fairRotationScore}%
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 font-medium">
            Equitable dispatch priority
          </span>
        </div>

      </div>

      {/* Active Gig in Progress OR Incoming Dispatch Alert */}
      {activeBooking && activeBooking.status !== 'COMPLETED' ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-500 shadow-xl space-y-5 animate-in zoom-in-95">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                Assigned In-Flight Job: #{activeBooking.id}
              </span>
            </div>
            <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {activeBooking.status}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-['Outfit']">
                {activeBooking.subServiceName || activeBooking.serviceTitle}
              </h3>
              <p className="text-xs text-slate-700 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {activeBooking.customerAddress}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Customer: <strong className="text-slate-900">{activeBooking.customerName}</strong> ({activeBooking.customerPhone})
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 font-bold">Your Net Take-Home</span>
              <div className="text-3xl font-black text-emerald-700">
                ₹{activeBooking.breakdown?.workerPayout}
              </div>
              <span className="text-[11px] text-amber-700 font-bold block">
                +₹{activeBooking.breakdown?.estimatedPatronageDividend} coop dividend
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => handleReadoutGig(activeBooking)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Listen in Hindi (ऑडियो सुनें)</span>
            </button>

            <button
              onClick={onOpenJobExecution}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Turn-by-Turn Job Terminal</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
            <Radio className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
            Standing by on Cooperative Radar
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
            You are online with an outstanding fair-rotation score ({activeWorker.fairRotationScore}%). New incoming gig dispatches in Shivajinagar & Kothrud will pop up here with loud audio chimes.
          </p>
        </div>
      )}

    </div>
  );
}
