import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Radio, 
  FileText, 
  Grid, 
  Receipt,
  User,
  Crosshair,
  Loader2,
  X,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ServiceGrid } from './ServiceGrid';
import { BookingModal } from './BookingModal';
import { ActiveBookingTracker } from './ActiveBookingTracker';
import { CustomerHistory } from './CustomerHistory';
import { TransparentPriceModal } from '../common/TransparentPriceModal';

export function CustomerPortal() {
  const { 
    activeBooking, 
    activeBookingId, 
    setActiveBookingId, 
    bookings, 
    customer, 
    updateCustomerProfile, 
    detectUserLocation, 
    isLocating,
    submitReview
  } = useAppState();
  
  const [activeTab, setActiveTab] = useState('services');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [priceModalConfig, setPriceModalConfig] = useState({ isOpen: false, service: null, amount: 500 });
  const [reviewBooking, setReviewBooking] = useState(null);
  const [modalRating, setModalRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [modalComment, setModalComment] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: customer.name,
    email: customer.email || 'priya.sharma@sahakar.org',
    phone: customer.phone,
    address: customer.address
  });

  useEffect(() => {
    setProfileForm({
      name: customer.name || '',
      email: customer.email || 'priya.sharma@sahakar.org',
      phone: customer.phone || '',
      address: customer.address || ''
    });
  }, [customer]);

  // Robust unrated completed order resolver: Always prompts citizen to rate their artisan
  const unratedBooking = (activeBooking && activeBooking.status === 'COMPLETED' && !activeBooking.ratingGiven ? activeBooking : null) ||
    (bookings || []).find(b => 
      (b.customerId === customer?.id || (customer?.email && b.customerEmail && b.customerEmail.toLowerCase() === customer.email.toLowerCase())) &&
      b.status === 'COMPLETED' &&
      !b.ratingGiven
    );

  const handleOpenPriceModal = (service, amount) => {
    setPriceModalConfig({ isOpen: true, service, amount });
  };

  const handleServiceSelect = (service) => {
    setSelectedServiceForBooking(service);
  };

  const handleBookingSuccess = (bookingId) => {
    setActiveTab('active');
  };

  const handleSelectHistoryBooking = (bookingId) => {
    setActiveBookingId(bookingId);
    setActiveTab('active');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCustomerProfile(profileForm);
    setShowProfileModal(false);
  };

  const handleGpsDetect = async () => {
    try {
      const real = await detectUserLocation();
      setProfileForm(prev => ({ ...prev, address: real.address }));
    } catch (e) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Consumer Location & Navigation Bar (Urban Company Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xl shadow-md">
            🏠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#1B4D3E]" />
                <span>Your Service Location:</span>
              </span>
              <button
                onClick={detectUserLocation}
                disabled={isLocating}
                className="text-xs text-[#1B4D3E] font-bold hover:underline flex items-center gap-1 font-mono"
                title="Click to detect device GPS"
              >
                {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                <span>{customer.address ? customer.address.split(',')[0] : 'Auto-detect GPS'}</span>
                <span className="text-[10px] text-slate-400">· 📍 Refresh GPS</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate max-w-lg">
              {customer.address}
            </p>
          </div>
        </div>

        {/* Right side: View Switcher Tabs & Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'services'
                  ? 'bg-[#1B4D3E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Explore Services</span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'active'
                  ? 'bg-[#1B4D3E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Active Orders</span>
              {activeBooking && activeBooking.status !== 'COMPLETED' && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1 right-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'history'
                  ? 'bg-[#1B4D3E] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Receipts</span>
            </button>
          </div>

          <button
            onClick={() => {
              setProfileForm({
                name: customer.name,
                phone: customer.phone,
                address: customer.address
              });
              setShowProfileModal(true);
            }}
            className="p-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100 transition flex items-center gap-1.5 shadow-sm text-xs font-bold"
            title="View & Edit My Citizen ID / Profile"
          >
            <User className="w-3.5 h-3.5 text-[#1B4D3E]" />
            <span className="font-mono text-[11px] font-bold text-emerald-800">{customer.id || 'CIT-MH-501'}</span>
            <span className="hidden md:inline font-sans text-slate-700">· {customer.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'services' && (
        <ServiceGrid
          onSelectService={handleServiceSelect}
          onOpenPriceModal={handleOpenPriceModal}
        />
      )}

      {activeTab === 'active' && (
        <div>
          {activeBooking ? (
            <ActiveBookingTracker
              booking={activeBooking}
              onOpenReviewModal={(b) => setReviewBooking(b)}
            />
          ) : (
            <div className="p-16 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
                <Radio className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit']">No Active Booking In-Flight</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Browse our cooperative service catalog to book an electrician, plumber, or cleaning specialist with transparent pricing and live radar dispatch.
              </p>
              <button
                onClick={() => setActiveTab('services')}
                className="mt-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition"
              >
                Explore Services Catalog
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <CustomerHistory onSelectBooking={handleSelectHistoryBooking} />
      )}

      {/* Booking Configuration Modal */}
      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          isOpen={!!selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Transparent Price Breakdown Modal */}
      <TransparentPriceModal
        service={priceModalConfig.service}
        amount={priceModalConfig.amount}
        isOpen={priceModalConfig.isOpen}
        onClose={() => setPriceModalConfig({ isOpen: false, service: null, amount: 500 })}
      />

      {/* Rate Worker in 5 Stars Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 bg-slate-100">
                  <img
                    src={reviewBooking.workerAvatar || '/images/hero_artisan.jpg'}
                    alt={reviewBooking.workerName || 'Worker'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">
                      Rate {reviewBooking.workerName || 'Cooperative Artisan'}
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {reviewBooking.subServiceName || reviewBooking.serviceTitle} • {reviewBooking.workerSociety || 'Pune Multi-Trade Cooperative'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReviewBooking(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Star Rating Section */}
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-5 text-center space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                How would you rate the service quality and doorstep conduct?
              </span>

              {/* 5 Interactive Gold Stars */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setModalRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-all transform hover:scale-125 focus:outline-none"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                        star <= (hoverRating || modalRating)
                          ? 'fill-amber-400 text-amber-500 drop-shadow-md'
                          : 'text-slate-300 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Dynamic Sentiment Label */}
              <div className="inline-block px-3.5 py-1 rounded-full text-xs font-black bg-white border border-amber-300 text-amber-900 shadow-sm font-mono">
                {modalRating === 5 && '⭐⭐⭐⭐⭐ 5.0 OUTSTANDING (उत्कृष्ट कार्य)'}
                {modalRating === 4 && '⭐⭐⭐⭐ 4.0 VERY GOOD (बहुत अच्छा)'}
                {modalRating === 3 && '⭐⭐⭐ 3.0 GOOD (संतोषजनक)'}
                {modalRating === 2 && '⭐⭐ 2.0 NEEDS IMPROVEMENT (सुधार योग्य)'}
                {modalRating === 1 && '⭐ 1.0 POOR (असंतोषजनक)'}
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">
                Quick Praise Tags (Click to add to feedback):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '⚡ Punctual & On-Time',
                  '🛠️ Highly Skilled Work',
                  '🤝 Transparent 88% Billing',
                  '🧼 Clean & Respectful Conduct',
                  '💯 Polite & Professional'
                ].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => {
                      setModalComment(prev => prev ? `${prev} • ${tag}` : tag);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 text-[11px] font-medium transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Written Review & Feedback (Optional)
              </label>
              <textarea
                rows={3}
                value={modalComment}
                onChange={(e) => setModalComment(e.target.value)}
                placeholder="Share your experience (e.g. prompt arrival, diagnosed fault quickly, transparent pricing)..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Cooperative Impact Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Your <strong>{modalRating}★ rating</strong> directly boosts {reviewBooking.workerName || 'the artisan'}'s rank in the Dynamic Optimization Engine (Top-Rated Priority)!
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2.5 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  submitReview(reviewBooking.id, modalRating, modalComment);
                  setReviewBooking(null);
                  setModalComment('');
                  setModalRating(5);
                }}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit {modalRating}★ Rating & Update Profile</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Customer Profile Customization Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                    Citizen Identity & Profile
                  </h3>
                  <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    {customer.id || 'CIT-MH-501'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Your Citizen ID is saved permanently across browser sessions</p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name (आपका नाम)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yash Pandey"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address (ईमेल पता)</label>
                <input
                  type="email"
                  required
                  placeholder="teammate@example.com"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Phone (फोन नंबर)</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98221 55601"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Home Address</label>
                  <button
                    type="button"
                    onClick={handleGpsDetect}
                    disabled={isLocating}
                    className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                    <span>Auto-detect GPS</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Flat 402, Rohan Heights, FC Road, Pune"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-medium"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md transition"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
