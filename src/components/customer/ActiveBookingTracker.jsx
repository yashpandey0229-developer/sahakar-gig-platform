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
  Ticket
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { LiveMap } from '../common/LiveMap';

export function ActiveBookingTracker({ booking, onOpenReviewModal }) {
  const { updateBookingStatus, setCurrentRole, setActiveWorkerId } = useAppState();
  const [copiedOtp, setCopiedOtp] = useState(null);

  if (!booking) return null;

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

        {/* Action Switch to Worker Portal */}
        <div className="flex items-center gap-2">
          <button
            onClick={switchToWorkerPerspective}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/25 transition"
            title="Switch to Worker Partner Companion view"
          >
            <span>View Worker Partner HUD</span>
            <ChevronRight className="w-4 h-4" />
          </button>
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

          {/* Quick Demo Controls for SIH Hackathon Jury Testing */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              SIH Fast-Forward Telemetry:
            </span>
            <div className="flex gap-2">
              {booking.status === 'ACCEPTED' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'EN_ROUTE')}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-bold hover:bg-amber-200 transition"
                >
                  Trigger "En Route"
                </button>
              )}
              {booking.status === 'EN_ROUTE' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'ARRIVED')}
                  className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-300 font-bold hover:bg-blue-200 transition"
                >
                  Trigger "Arrived"
                </button>
              )}
              {booking.status === 'ARRIVED' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                  className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 font-bold hover:bg-purple-200 transition"
                >
                  Trigger "In Progress"
                </button>
              )}
              {booking.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold hover:bg-emerald-200 transition"
                >
                  Trigger "Completed"
                </button>
              )}
            </div>
          </div>
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

          {/* Price Breakdown Snapshot */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-black text-slate-900 text-sm">
              <span>Total Service Invoice</span>
              <span>₹{booking.totalAmount}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
              <span>Worker Direct Net Payout</span>
              <span>₹{booking.breakdown?.workerPayout} (88%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-amber-700 font-semibold">
              <span>Cooperative Health & Welfare Pool</span>
              <span>₹{booking.breakdown?.welfareFundContribution} (7%)</span>
            </div>
          </div>

          {/* Rating button if completed */}
          {booking.status === 'COMPLETED' && (
            <button
              onClick={() => onOpenReviewModal(booking)}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Leave Cooperative Review & Tip</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
