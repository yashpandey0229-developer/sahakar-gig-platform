import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin, 
  Receipt, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  FileText,
  Lock,
  DollarSign,
  UserCheck,
  Camera
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CooperativeReceiptModal } from '../common/CooperativeReceiptModal';

export function WorkerJobHistory({ onOpenJobExecution }) {
  const { bookings, activeWorker, language } = useAppState();
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);

  // Strict Worker Isolation: Only show jobs completed by THIS logged-in worker
  const myCompletedJobs = (bookings || []).filter(b => {
    const isThisWorker = 
      b.workerId === activeWorker?.id ||
      (b.workerEmail && activeWorker?.email && b.workerEmail.toLowerCase() === activeWorker.email.toLowerCase()) ||
      (b.workerName && activeWorker?.name && b.workerName.toLowerCase() === activeWorker.name.toLowerCase());
    return isThisWorker && (b.status === 'COMPLETED' || b.status === 'CANCELLED');
  });

  // Calculate total earnings across completed jobs
  const totalEarned = myCompletedJobs
    .filter(b => b.status === 'COMPLETED')
    .reduce((acc, b) => acc + (b.breakdown?.workerPayout || Math.round((b.totalAmount || 0) * 0.88)), 0);

  // Calculate real average rating from completed & rated jobs
  const ratedJobs = myCompletedJobs.filter(b => typeof b.ratingGiven === 'number' && b.ratingGiven > 0);
  const formattedRating = ratedJobs.length > 0 
    ? (ratedJobs.reduce((acc, b) => acc + Number(b.ratingGiven), 0) / ratedJobs.length).toFixed(1) 
    : (typeof activeWorker?.rating === 'number' ? activeWorker.rating.toFixed(1) : '4.9');

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner: Authenticated Worker Header & Privacy Isolation */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={activeWorker?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
              alt={activeWorker?.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                  {activeWorker?.name}'s Completed Jobs & Ratings
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                  VERIFIED LEDGER
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Private Job History • Visible <strong>ONLY to you</strong> (ID: {activeWorker?.cooperativeMemberId || 'COOP-MH-4819'})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-2xl bg-white border border-amber-200 shadow-xs text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Net 88% Earnings</span>
              <span className="text-lg font-black text-emerald-700">₹{totalEarned}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white border border-amber-200 shadow-xs text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Citizen Rating</span>
              <span className="text-lg font-black text-amber-900 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {formattedRating} ★
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {myCompletedJobs.length === 0 ? (
        <div className="p-16 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
            🧰
          </div>
          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
            No Completed Jobs Yet for {activeWorker?.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You are logged in as <strong className="text-slate-800">{activeWorker?.name}</strong>. Accept and complete service dispatches on your 10km radar to build your verified 5-star history and patronage dividends!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCompletedJobs.map((booking) => {
            const hasRating = typeof booking.ratingGiven === 'number' && booking.ratingGiven > 0;
            const ratingScore = hasRating ? Number(booking.ratingGiven) : null;
            const payout = booking.breakdown?.workerPayout || Math.round((booking.totalAmount || 0) * 0.88);

            return (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition space-y-4"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-800">
                        #{booking.id}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        OTP Verified ({booking.endOtp || '7721'})
                      </span>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      booking.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Service & Citizen Details */}
                  <div className="mt-3">
                    <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                      {booking.subServiceName || booking.serviceTitle}
                    </h3>
                    
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{booking.customerAddress}</span>
                    </p>
                    
                    <p className="text-xs text-slate-500 mt-0.5">
                      Citizen: <strong className="text-slate-800">{booking.customerName}</strong> ({booking.customerPhone})
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* 🌟 Customer Rating & Feedback Card */}
                  {hasRating ? (
                    <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-300/90 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Customer Rating: {ratingScore}.0 / 5.0 ★
                          </span>
                        </div>
                        <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                          ✓ Verified {ratingScore}★ Stamped
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= ratingScore
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200 fill-slate-100'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-black text-slate-800 ml-1">
                          {ratingScore === 5 && '⭐⭐⭐⭐⭐ 5.0 Outstanding (उत्कृष्ट)'}
                          {ratingScore === 4 && '⭐⭐⭐⭐ 4.0 Very Good (बहुत अच्छा)'}
                          {ratingScore === 3 && '⭐⭐⭐ 3.0 Good (संतोषजनक)'}
                          {ratingScore === 2 && '⭐⭐ 2.0 Needs Improvement (सुधार योग्य)'}
                          {ratingScore === 1 && '⭐ 1.0 Poor (असंतोषजनक)'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 italic bg-white/90 p-2 rounded-xl border border-amber-200/70 font-medium leading-relaxed">
                        "{booking.reviewText || (
                          ratingScore === 5 ? 'Outstanding doorstep service and transparent cooperative billing.' :
                          ratingScore === 4 ? 'Very good doorstep work and timely arrival.' :
                          ratingScore === 3 ? 'Satisfactory service completion at customer premises.' :
                          ratingScore === 2 ? 'Service completed with feedback for improvement.' :
                          'Service completed.'
                        )}"
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-bold text-slate-700">Citizen Doorstep Rating</span>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                          ⏳ Awaiting Rating
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 text-slate-200 fill-slate-100" />
                        ))}
                        <span className="text-[11px] text-slate-400 font-medium ml-1">
                          Awaiting citizen review on customer app
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Before & After Photos if present */}
                  {(booking.problemPhoto || booking.completionPhoto) && (
                    <div className="mt-3 grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                      {booking.problemPhoto && (
                        <div>
                          <span className="text-[9px] text-slate-500 font-bold block mb-1">Issue Photo (Before)</span>
                          <img
                            src={booking.problemPhoto}
                            alt="Issue"
                            className="w-full h-16 object-cover rounded-lg border border-slate-200"
                          />
                        </div>
                      )}
                      {booking.completionPhoto && (
                        <div>
                          <span className="text-[9px] text-emerald-700 font-bold block mb-1">Your Fix (After)</span>
                          <img
                            src={booking.completionPhoto}
                            alt="Fix"
                            className="w-full h-16 object-cover rounded-lg border border-emerald-400"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 88% Payout Breakdown */}
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-mono flex items-center justify-between text-emerald-950">
                    <span>88% Direct Payout: <strong>₹{payout}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span className="text-amber-800 font-bold">+₹{booking.breakdown?.estimatedPatronageDividend || 120} dividend</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Gig Value</span>
                    <div className="text-lg font-black text-slate-900">₹{booking.totalAmount}</div>
                  </div>

                  <button
                    onClick={() => setSelectedBookingForReceipt(booking)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
                    title="View & Download Official 88-7-5 Tax Invoice"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Receipt (PDF)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Reusable Cooperative Tax Invoice Modal */}
      <CooperativeReceiptModal
        booking={selectedBookingForReceipt}
        isOpen={!!selectedBookingForReceipt}
        onClose={() => setSelectedBookingForReceipt(null)}
      />

    </div>
  );
}
