import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Star, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  Receipt,
  UserCheck
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { CooperativeReceiptModal } from '../common/CooperativeReceiptModal';

export function CustomerHistory({ onSelectBooking }) {
  const { bookings, submitReview, customer } = useAppState();
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Strict customer isolation: only show bookings belonging to THIS logged-in customer / teammate
  const myBookings = bookings.filter(b => 
    b.customerId === customer?.id || 
    (customer?.email && b.customerEmail && b.customerEmail.toLowerCase() === customer.email.toLowerCase()) ||
    (customer?.phone && b.customerPhone === customer.phone)
  );

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    submitReview(selectedBookingForReview.id, rating, comment);
    setSelectedBookingForReview(null);
    setComment('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner with Active Citizen Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">Service History & Receipts</h2>
            <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
              ID: {customer?.id || 'CIT-MH-501'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Verified tax & patronage receipts for <strong>{customer?.name}</strong> ({customer?.email || customer?.phone})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Verified Receipts: <strong>{myBookings.length}</strong></span>
          </span>
        </div>
      </div>

      {myBookings.length === 0 ? (
        <div className="p-16 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            🧾
          </div>
          <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
            No Past Receipts Found for {customer?.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You are logged in as <span className="font-mono font-bold text-emerald-800">{customer?.email || customer?.name}</span>. Once you request and complete a service on the portal, your audited 88-7-5 receipt will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-emerald-700">
                      #{booking.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (OTP Verified: {booking.endOtp || '7721'})
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                    booking.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  {booking.subServiceName || booking.serviceTitle}
                </h3>
                
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                {booking.workerName && (
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <img
                      src={booking.workerAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
                      alt={booking.workerName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        <span>{booking.workerName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">{booking.workerSociety}</div>
                    </div>
                  </div>
                )}

                {/* 88-7-5 Ledger Breakdown Pill */}
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] font-mono flex items-center justify-between text-emerald-950">
                  <span>88% Paid to Artisan: <strong>₹{booking.breakdown?.workerPayout || Math.round(booking.totalAmount * 0.88)}</strong></span>
                  <span className="text-slate-400">|</span>
                  <span>7% Health Pool: <strong>₹{booking.breakdown?.welfareFundContribution || Math.round(booking.totalAmount * 0.07)}</strong></span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount Paid</span>
                  <div className="text-xl font-black text-slate-900">₹{booking.totalAmount}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForReceipt(booking)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
                    title="View & Download 88-7-5 Tax Invoice"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Receipt (PDF)</span>
                  </button>

                  {booking.status === 'COMPLETED' && !booking.ratingGiven && (
                    <button
                      onClick={() => setSelectedBookingForReview(booking)}
                      className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black transition flex items-center gap-1 shadow-sm"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Rate</span>
                    </button>
                  )}
                  {booking.ratingGiven && (
                    <span className="flex items-center gap-1 text-xs text-amber-800 font-black bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{booking.ratingGiven}★</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review & Rating Modal */}
      {selectedBookingForReview && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']">Rate Cooperative Artisan</h3>
              <button
                onClick={() => setSelectedBookingForReview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="text-center py-2">
                <div className="text-xs text-slate-500 mb-2 font-medium">How was your service with {selectedBookingForReview.workerName}?</div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience (punctuality, skill, cooperative transparent billing)..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForReview(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition"
                >
                  Submit Verified Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audited Cooperative Tax & Dividend Receipt Modal */}
      <CooperativeReceiptModal
        booking={selectedBookingForReceipt}
        isOpen={!!selectedBookingForReceipt}
        onClose={() => setSelectedBookingForReceipt(null)}
      />

    </div>
  );
}
