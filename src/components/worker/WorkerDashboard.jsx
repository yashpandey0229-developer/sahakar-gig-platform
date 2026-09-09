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
  Navigation,
  Crosshair,
  Loader2,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { speechService } from '../../services/speechService';
import { calculateDistanceKm } from '../../services/dispatchEngine';

export function WorkerDashboard({ onOpenJobExecution, onOpenWallet, onOpenHistory }) {
  const { 
    activeWorker, 
    activeBooking, 
    bookings,
    updateBookingStatus, 
    acceptJobByWorker,
    submitWorkerQuote,
    pendingBroadcastingGigs,
    language,
    detectWorkerLocation,
    isWorkerLocating,
    simulateWorkerNearCustomer,
    customer
  } = useAppState();

  const [isOnline, setIsOnline] = useState(true);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNote, setQuoteNote] = useState('');

  // Doorstep ratings & reviews reflection for this worker
  const completedWorkerBookings = (bookings || []).filter(
    b => (b.workerId === activeWorker?.id || (b.workerName && b.workerName === activeWorker?.name)) && typeof b.ratingGiven === 'number' && b.ratingGiven > 0
  );
  const customWorkerReviews = Array.isArray(activeWorker?.reviews) ? activeWorker.reviews : [];

  const defaultSeedReviews = [
    {
      id: 'seed-rev-1',
      customerName: 'Priya Sharma (Shivajinagar)',
      serviceTitle: activeWorker?.skills?.[0] ? `${activeWorker.skills[0].toUpperCase()} Service` : 'Electrical & Appliance',
      rating: 5,
      comment: 'Arrived promptly in 14 minutes. Very courteous and showed transparent 88-7-5 breakup on phone receipt!',
      date: 'Yesterday',
      isVerified: true
    },
    {
      id: 'seed-rev-2',
      customerName: 'Kunal Deshmukh (FC Road)',
      serviceTitle: 'Troubleshooting & Maintenance',
      rating: 5,
      comment: 'Certified cooperative technician. Solved the issue with genuine spares and zero extra charges. 5 Stars!',
      date: '3 days ago',
      isVerified: true
    }
  ];

  const getDynamicFallbackComment = (r) => {
    if (r === 5) return 'Outstanding doorstep service and transparent cooperative billing.';
    if (r === 4) return 'Very good doorstep execution and timely arrival.';
    if (r === 3) return 'Satisfactory service completion at customer premises.';
    if (r === 2) return 'Service completed with feedback for improvement.';
    return 'Doorstep service completed.';
  };

  // Real reviews from actual completed customer bookings
  const liveReviewsCombined = [
    ...completedWorkerBookings.map(b => ({
      id: 'booking-' + b.id,
      customerName: b.customerName || 'Verified Citizen',
      serviceTitle: b.subServiceName || b.serviceTitle || 'Cooperative Doorstep Gig',
      rating: Number(b.ratingGiven),
      comment: b.reviewText || getDynamicFallbackComment(Number(b.ratingGiven)),
      date: new Date(b.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      isVerified: true,
      isNew: true
    })),
    ...customWorkerReviews
  ];

  const uniqueReviewsMap = new Map();
  liveReviewsCombined.forEach(r => {
    const key = r.id || (r.customerName + '-' + r.comment);
    if (!uniqueReviewsMap.has(key)) {
      uniqueReviewsMap.set(key, r);
    }
  });

  const displayReviews = completedWorkerBookings.length > 0
    ? Array.from(uniqueReviewsMap.values())
    : (uniqueReviewsMap.size > 0 ? Array.from(uniqueReviewsMap.values()) : defaultSeedReviews);

  const ratedWorkerBookings = completedWorkerBookings.filter(b => typeof b.ratingGiven === 'number' && b.ratingGiven > 0);
  const currentWorkerRatingNum = ratedWorkerBookings.length > 0
    ? (ratedWorkerBookings.reduce((acc, b) => acc + Number(b.ratingGiven), 0) / ratedWorkerBookings.length)
    : (typeof activeWorker?.rating === 'number' ? activeWorker.rating : 4.9);
  const formattedRating = currentWorkerRatingNum.toFixed(1);

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
              <span className="flex items-center gap-1.5 text-amber-900 font-black bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{formattedRating} ★</span>
                <span className="text-amber-700 font-normal">({activeWorker.totalJobsCompleted} jobs)</span>
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

      {/* Worker Live GPS Telemetry Bar & Geofence Indicator */}
      <div className="bg-white border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm">
            <Compass className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                WORKER REAL GPS TELEMETRY
              </span>
              <span className="text-xs text-slate-600 font-mono font-bold">
                {activeWorker.location ? `${activeWorker.location.lat.toFixed(4)}, ${activeWorker.location.lng.toFixed(4)}` : '18.5298, 73.8472'}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium truncate max-w-lg mt-0.5">
              📍 {activeWorker.address || 'Pune Urban Sector (Shivajinagar Hub)'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Detect Worker Real GPS */}
          <button
            onClick={() => detectWorkerLocation(activeWorker.id)}
            disabled={isWorkerLocating}
            className="px-3.5 py-2 rounded-xl bg-[#111C26] hover:bg-[#1E2D3D] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Pin this phone's real GPS latitude & longitude"
          >
            {isWorkerLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isWorkerLocating ? 'Detecting GPS...' : '📍 Update Worker Real GPS'}</span>
          </button>

          {/* Hackathon Stage Proximity Helper */}
          <button
            onClick={() => simulateWorkerNearCustomer(1.8)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition flex items-center gap-1.5"
            title="Sets worker coordinates 1.8 km from customer to test 10 km geofence match live"
          >
            <span>⚡ Set &lt; 2 km for Demo</span>
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
            <span>Instant UPI Cashout (0% Fee)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Accrued Patronage Dividends */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-amber-500 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-bold">
            <span>Quarterly Dividend</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-700">
            ₹{activeWorker.wallet.patronageDividends}
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 font-medium">
            Accrued cooperative profit share
          </span>
        </div>

        {/* Welfare Points */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-blue-500 transition">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-bold">
            <span>Welfare & Health Fund</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-700">
            {activeWorker.wallet.welfarePoints} pts
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 font-medium">
            Health insurance & micro-credit pool
          </span>
        </div>

        {/* Dynamic Optimization Priority */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-emerald-500 transition">
          <div className="flex items-center justify-between text-xs text-emerald-700 mb-1 font-bold">
            <span>Dynamic Dispatch Rank</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              ₹{activeWorker.hourlyRate || 249}
            </span>
            <span className="text-xs text-slate-500 font-semibold">/hr base</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              ★ {activeWorker.rating || 4.9}
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              📍 Nearest Priority
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1.5 font-medium">
            Optimized: Distance • Rating • Cost
          </span>
        </div>

      </div>

      {/* Incoming Live Dispatch Alert with 10 km Geofence Verification (Uber/Ola Matching) */}
      {pendingBroadcastingGigs && pendingBroadcastingGigs.length > 0 && (!activeBooking || activeBooking.status === 'COMPLETED') && (() => {
        const gig = pendingBroadcastingGigs[0];
        const custLoc = gig.customerLocation || customer?.location || { lat: 18.5298, lng: 73.8472 };
        const workerLoc = activeWorker?.location || { lat: 18.5298, lng: 73.8472 };
        const distanceKm = calculateDistanceKm(workerLoc.lat, workerLoc.lng, custLoc.lat, custLoc.lng);
        const isWithin10Km = distanceKm <= 10.0;

        return (
          <div className={`p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4 animate-in zoom-in-95 border-4 transition-all duration-300 ${
            isWithin10Km
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-300 shadow-emerald-900/30'
              : 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 text-white border-rose-300 shadow-rose-900/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-black uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white animate-ping" />
                {isWithin10Km ? (
                  <span>🎯 LIVE GIG WITHIN RANGE · 10 KM DISPATCH RADAR (तत्काल नया कार्य)</span>
                ) : (
                  <span>⚠️ GIG OUT OF RANGE · BEYOND 10 KM RADIUS (दायरे से बाहर)</span>
                )}
              </span>
              
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-black ${
                  isWithin10Km ? 'bg-white text-emerald-900' : 'bg-white text-rose-900'
                }`}>
                  📍 {distanceKm.toFixed(1)} km away {isWithin10Km ? '(≤ 10 km Range)' : '(> 10 km Geofence)'}
                </span>
                <span className="bg-slate-950 text-amber-300 px-3 py-1 rounded-full text-[10px] font-mono">
                  LIVE RADAR
                </span>
              </div>
            </div>

            {/* Gig Details Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    {gig.serviceTitle}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isWithin10Km ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isWithin10Km ? '✅ WITHIN 10 KM' : '🚫 BEYOND 10 KM'}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-950 font-['Outfit'] mt-1">
                  {gig.subServiceName || gig.serviceTitle}
                </h3>
                
                <p className="text-xs text-slate-700 mt-1 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  {gig.customerAddress}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Citizen: <strong>{gig.customerName}</strong> ({gig.customerPhone})
                </p>

                {/* Proximity distance indicator */}
                <div className="mt-2 text-xs font-mono font-bold text-slate-600 flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your GPS to Customer: <strong>{distanceKm.toFixed(2)} km</strong></span>
                  <span className="text-slate-400">|</span>
                  <span>Max Limit: <strong>10.00 km</strong></span>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className="text-xs text-slate-500 font-bold block">88% Direct Payout</span>
                <div className="text-3xl font-black text-emerald-700">
                  ₹{gig.breakdown?.workerPayout || Math.round(gig.totalAmount * 0.88)}
                </div>
                <span className="text-[10px] text-amber-800 font-bold block">
                  +₹{gig.breakdown?.estimatedPatronageDividend || 120} patronage dividend
                </span>
              </div>
            </div>

            {/* Out of range alert message if > 10 km */}
            {!isWithin10Km && (
              <div className="bg-rose-950/40 border border-rose-300/40 rounded-xl p-3 text-xs text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />
                  <span>
                    Cooperative bylaws restrict dispatches to within a <strong>10 km radius</strong> for rapid 15-minute arrival. Because you are <strong>{distanceKm.toFixed(1)} km</strong> away, this gig cannot be accepted by your terminal.
                  </span>
                </div>
                <button
                  onClick={() => simulateWorkerNearCustomer(1.8)}
                  className="px-3 py-1.5 rounded-lg bg-white text-rose-950 text-xs font-black hover:bg-rose-100 transition whitespace-nowrap"
                >
                  ⚡ Simulate Nearby (&lt; 2 km)
                </button>
              </div>
            )}

            {/* Custom Quotation / Reverse Bidding Section */}
            {(() => {
              const myQuote = gig.quotes?.find(q => q.workerId === activeWorker?.id);

              return (
                <div className="space-y-3">
                  {/* If this worker has already submitted a quote */}
                  {myQuote ? (
                    <div className="bg-slate-950/90 border border-emerald-400/40 rounded-2xl p-4 text-white space-y-2 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-black text-xs text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>YOUR CUSTOM BID IS LIVE (आपकी दर दर्ज है)</span>
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 px-3 py-0.5 rounded-full font-mono font-black text-xs">
                          ₹{myQuote.quotedAmount} Quoted
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-1">
                        <span>Your 88% Direct Payout: <strong className="text-white font-mono">₹{myQuote.workerPayout}</strong></span>
                        <span>Dynamic Match Rank: <strong className="text-amber-300 font-mono">{myQuote.optimizationScore}% Optimal</strong></span>
                      </div>
                      {myQuote.quoteNotes && (
                        <p className="text-[11px] text-slate-300 italic bg-white/5 p-2 rounded-lg">
                          "{myQuote.quoteNotes}"
                        </p>
                      )}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setIsQuoting(true);
                            setQuoteAmount(myQuote.quotedAmount);
                            setQuoteNote(myQuote.quoteNotes || '');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                        >
                          ✏️ Edit Your Quote
                        </button>
                        <button
                          onClick={() => {
                            acceptJobByWorker(gig.id, activeWorker, myQuote.quotedAmount);
                            onOpenJobExecution();
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md"
                        >
                          ⚡ Accept at ₹{myQuote.quotedAmount}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Quoting Input Drawer */}
                  {isQuoting && isWithin10Km && (
                    <div className="bg-slate-950 border border-amber-400/50 rounded-2xl p-4 sm:p-5 text-white space-y-3 shadow-2xl animate-in zoom-in-95">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-amber-400" />
                          <span className="font-bold text-xs sm:text-sm text-white font-['Outfit']">
                            Quote Your Custom Amount (अपनी दर / बोली लगाएं)
                          </span>
                        </div>
                        <button
                          onClick={() => setIsQuoting(false)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-bold">Quick Presets:</span>
                        {[
                          { label: `-₹50 (₹${Math.max(150, gig.totalAmount - 50)})`, val: Math.max(150, gig.totalAmount - 50) },
                          { label: `Base (₹${gig.totalAmount})`, val: gig.totalAmount },
                          { label: `+₹50 (₹${gig.totalAmount + 50})`, val: gig.totalAmount + 50 },
                          { label: `+₹100 (₹${gig.totalAmount + 100})`, val: gig.totalAmount + 100 },
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setQuoteAmount(p.val)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                              Number(quoteAmount) === p.val
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-300 font-bold block mb-1">
                            Your Quoted Amount to Citizen (₹)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              min="100"
                              step="10"
                              value={quoteAmount}
                              onChange={(e) => setQuoteAmount(e.target.value)}
                              placeholder={gig.totalAmount.toString()}
                              className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-amber-400/40 rounded-xl text-white font-black text-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-300 font-bold block mb-1">
                            Message / Notes (सामान / समय विवरण)
                          </label>
                          <input
                            type="text"
                            value={quoteNote}
                            onChange={(e) => setQuoteNote(e.target.value)}
                            placeholder="e.g. Bringing tools, can arrive in 12 mins"
                            className="w-full px-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-white text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none h-[42px]"
                          />
                        </div>
                      </div>

                      {/* Transparent math breakdown */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-wrap items-center justify-between text-xs">
                        <span>Citizen Pays: <strong className="text-white font-mono">₹{quoteAmount || gig.totalAmount}</strong></span>
                        <span className="text-emerald-400">Your Take-Home (88%): <strong className="font-mono">₹{Math.round((Number(quoteAmount) || gig.totalAmount) * 0.88)}</strong></span>
                        <span className="text-sky-300">Health Reserve (7%): <strong className="font-mono">₹{Math.round((Number(quoteAmount) || gig.totalAmount) * 0.07)}</strong></span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const finalVal = Number(quoteAmount) || gig.totalAmount;
                            submitWorkerQuote(gig.id, activeWorker, finalVal, quoteNote);
                            setIsQuoting(false);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition"
                        >
                          📤 Submit Quote to Citizen (बोली सबमिट करें)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const finalVal = Number(quoteAmount) || gig.totalAmount;
                            acceptJobByWorker(gig.id, activeWorker, finalVal);
                            onOpenJobExecution();
                          }}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition"
                        >
                          ⚡ Accept Immediately at ₹{quoteAmount || gig.totalAmount}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => handleReadoutGig(gig)}
                      className="px-4 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-900 text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>Listen in Hindi (हिन्दी में सुनें)</span>
                    </button>

                    {isWithin10Km ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {!isQuoting && !myQuote && (
                          <button
                            onClick={() => {
                              setIsQuoting(true);
                              setQuoteAmount(gig.totalAmount);
                            }}
                            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transition"
                          >
                            <DollarSign className="w-4 h-4 text-slate-950" />
                            <span>Quote Custom Amount (दर तय करें)</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            acceptJobByWorker(gig.id, activeWorker);
                            onOpenJobExecution();
                          }}
                          className="px-7 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-black shadow-2xl flex items-center gap-2 transition scale-105"
                        >
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>ACCEPT AT BASE RATE (₹{gig.totalAmount})</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          disabled
                          className="px-6 py-3 rounded-2xl bg-white/20 text-white/60 text-xs font-bold cursor-not-allowed flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>OUT OF RANGE (&gt; 10 km)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}
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
            You are online with Dynamic Optimization active ({activeWorker.rating}★ rating • ₹{activeWorker.hourlyRate || 249}/hr rate). Incoming citizen gig dispatches will dynamically match via Nearest Distance, Best Rating & Less Cost.
          </p>
        </div>
      )}

      {/* 🌟 Verified Citizen Doorstep Ratings & 5-Star Reviews Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit']">
                  Verified Citizen Ratings & Reviews
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-300 uppercase">
                  100% Anti-Fraud
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                नागरिकों द्वारा दी गई लाइव रेटिंग एवं समीक्षाएं • Stamped with doorstep OTP verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 font-mono">
              Total Reviews: <strong className="text-slate-900">{activeWorker.totalJobsCompleted || displayReviews.length}</strong>
            </span>
            {onOpenHistory && (
              <button
                onClick={onOpenHistory}
                className="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>View Job History →</span>
              </button>
            )}
          </div>
        </div>

        {/* Rating Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Scorecard */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-300/80 flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                Overall Doorstep Score
              </span>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-4xl sm:text-5xl font-black text-slate-950 font-mono">
                  {formattedRating}
                </span>
                <span className="text-base text-slate-400 font-bold">/ 5.0</span>
              </div>

              {/* 5 Gold Stars */}
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(currentWorkerRatingNum)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-600 mt-2 font-medium">
                Calculated from verified customer completions. Zero algorithm penalties.
              </p>
            </div>

            {/* Cooperative Standing Guarantee */}
            <div className="pt-3 border-t border-amber-200/80 space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-800">
                <span>Cooperative Priority Queue:</span>
                <span className="text-emerald-900 font-black">Top Tier (Tier-1)</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Fair Rotation Weight:</span>
                <span className="font-bold text-slate-700">{activeWorker.fairRotationScore || 94}%</span>
              </div>
            </div>
          </div>

          {/* Right Reviews Feed */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Customer Praise & Feedback Ledger (ग्राहकों की प्रतिक्रिया)</span>
            </h4>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {displayReviews.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {rev.customerName}
                        </span>
                        {rev.isNew && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {rev.serviceTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Number(rev.rating || 5)
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-200 fill-slate-100'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-black text-slate-800 ml-1">
                        {Number(rev.rating || 5).toFixed(1)} ★
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic bg-white/80 p-2.5 rounded-xl border border-slate-100 font-medium leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Doorstep OTP Stamped
                    </span>
                    <span>{rev.date || 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
