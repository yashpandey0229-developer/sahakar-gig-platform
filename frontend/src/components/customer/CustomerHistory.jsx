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
  Sparkles
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function CustomerHistory({ onSelectBooking }) {
  const { bookings, submitReview } = useAppState();
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    submitReview(selectedBookingForReview.id, rating, comment);
    setSelectedBookingForReview(null);
    setComment('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">Service History & Receipts</h2>
          <p className="text-xs text-slate-500 font-medium">Past household jobs completed with cooperative verified receipts</p>
        </div>
        <span className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-2xl shadow-sm">
          Total Completed: {bookings.length}
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
          <p className="text-slate-500 text-sm font-medium">No past bookings found. Book your first cooperative service above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-black text-emerald-700">
                    #{booking.id}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                    booking.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">{booking.subServiceName || booking.serviceTitle}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
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
                      <div className="font-bold text-slate-900">{booking.workerName}</div>
                      <div className="text-[11px] text-slate-500">{booking.workerSociety}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Paid</span>
                  <div className="text-lg font-black text-slate-900">₹{booking.totalAmount}</div>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'COMPLETED' && !booking.ratingGiven && (
                    <button
                      onClick={() => setSelectedBookingForReview(booking)}
                      className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-black transition flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>Rate</span>
                    </button>
                  )}
                  {booking.ratingGiven && (
                    <span className="flex items-center gap-1 text-xs text-amber-800 font-black bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                      ⭐ {booking.ratingGiven}/5
                    </span>
                  )}
                  <button
                    onClick={() => onSelectBooking(booking.id)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rate & Review Modal */}
      {selectedBookingForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
              Rate {selectedBookingForReview.workerName}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Your feedback ensures quality governance and rewards cooperative merit.
            </p>

            <div className="my-6 flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition"
                >
                  <Star
                    className={`w-9 h-9 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a brief comment on punctuality, quality of work, and billing clarity..."
              rows={3}
              className="w-full p-4 rounded-2xl glass-input text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setSelectedBookingForReview(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
