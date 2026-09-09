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
  History
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

  const ratedJobs = myCompletedJobs.filter(b => typeof b.ratingGiven === 'number' && b.ratingGiven > 0);
  const averageRating = ratedJobs.length > 0 
    ? (ratedJobs.reduce((acc, b) => acc + Number(b.ratingGiven), 0) / ratedJobs.length).toFixed(1) 
    : (typeof activeWorker?.rating === 'number' ? activeWorker.rating.toFixed(1) : '5.0');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                  My Completed Work & Payout History
                </h2>
                <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {myCompletedJobs.length} Gigs
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Verified work completed by {activeWorker?.name || 'Partner'} • 88% Direct Payout Audited
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Average Rating</span>
              <div className="flex items-center justify-center gap-1 font-black text-sm text-amber-900">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{averageRating} / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {myCompletedJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
            📋
          </div>
          <h3 className="text-sm font-bold text-slate-800">No completed jobs yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Jobs you complete with citizen start & end OTPs will appear here along with live customer ratings and instant wallet credits.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myCompletedJobs.map((booking) => {
            const hasRating = typeof booking.ratingGiven === 'number' && booking.ratingGiven > 0;
            const ratingScore = hasRating ? Number(booking.ratingGiven) : null;
            const payoutAmount = booking.breakdown?.workerPayout || Math.round((booking.totalAmount || 0) * 0.88);

            return (
              <div 
                key={booking.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-amber-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center border border-emerald-200">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">
                          {booking.subServiceName || booking.serviceTitle}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          #{booking.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Citizen: <strong>{booking.customerName || 'Verified Citizen'}</strong></span>
                        <span>•</span>
                        <span>{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Your 88% Earning</span>
                      <span className="text-base font-black text-emerald-700">₹{payoutAmount}</span>
                    </div>
                    <button
                      onClick={() => setSelectedBookingForReceipt(booking)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      title="View & Download 88-7-5 Tax Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Receipt (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Rating Display Section */}
                <div className="pt-1">
                  {hasRating ? (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Customer Rating ({ratingScore}★)</span>
                        </span>
                        <span className="text-xs font-mono font-black text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                          {ratingScore}.0 / 5.0 ★
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

                      {booking.reviewText && (
                        <p className="text-xs text-slate-700 bg-white/90 p-2 rounded-xl border border-amber-200 italic">
                          "{booking.reviewText}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-amber-200/70 text-[11px]">
                        <span className="text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Customer Rating Verified ({ratingScore}★)</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>Awaiting Citizen Rating (नागरिक की रेटिंग प्रतीक्षित)</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Syncs Live
                      </span>
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
