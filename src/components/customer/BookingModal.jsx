import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Check, 
  Sparkles, 
  Info, 
  Calendar,
  Radio,
  Crosshair,
  Loader2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function BookingModal({ service, isOpen, onClose, onBookingSuccess }) {
  const { customer, createBooking, detectUserLocation, isLocating } = useAppState();
  const [selectedSubService, setSelectedSubService] = useState(
    service?.subServices[0] || null
  );
  const [scheduleType, setScheduleType] = useState('express');
  const [selectedDate, setSelectedDate] = useState('Today, 4:00 PM - 6:00 PM');
  const [address, setAddress] = useState(customer.address);
  const [notes, setNotes] = useState('');
  const [problemPhoto, setProblemPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef(null);

  const SAMPLE_PROBLEM_PRESETS = [
    { label: '💧 Leaking Tap / Pipe', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80' },
    { label: '⚡ Sparking Switch / MCB', url: 'https://images.unsplash.com/photo-1558389186-438424b00a32?w=500&auto=format&fit=crop&q=80' },
    { label: '❄️ AC Water Leak / Coil', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80' }
  ];

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProblemPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen || !service) return null;

  const currentPrice = selectedSubService ? selectedSubService.price : service.basePrice;
  const workerCut = Math.round((currentPrice * service.workerSharePercent) / 100);
  const welfareCut = Math.round((currentPrice * service.welfareSharePercent) / 100);

  const handleFetchGps = async () => {
    try {
      const real = await detectUserLocation();
      setAddress(real.address);
    } catch (e) {}
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const bookingId = createBooking(service, selectedSubService, {
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        address,
        location: customer.location,
        scheduledTime: scheduleType === 'express' ? 'Immediate Express (ETA 10-15m)' : selectedDate,
        notes: notes + (problemPhoto ? ' [Issue Photo Attached]' : ''),
        problemPhoto
      });
      setIsSubmitting(false);
      if (onBookingSuccess) onBookingSuccess(bookingId);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl shadow-sm">
              🛠️
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                Book {service.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Verified Cooperative Worker Dispatch • Zero Commission Markup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select Sub-Service */}
        <div className="mt-6 space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
            1. Select Required Service Package:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.subServices.map((sub) => {
              const isSelected = selectedSubService?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubService(sub)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{sub.name}</span>
                    <span className="text-sm font-black text-emerald-700">₹{sub.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Est. Time: {sub.duration}</span>
                    {isSelected && <span className="text-emerald-700 font-black">✓ Selected</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Dispatch Time */}
        <div className="mt-6 space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
            2. Choose Dispatch Time:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setScheduleType('express')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                scheduleType === 'express'
                  ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-sm ring-2 ring-amber-400/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-black text-amber-800">
                <Radio className="w-4 h-4" />
                <span>Express Live Radar</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Nearest cooperative artisan dispatched now (ETA 10-15m)
              </p>
            </button>

            <button
              onClick={() => setScheduleType('scheduled')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                scheduleType === 'scheduled'
                  ? 'bg-blue-50 border-blue-400 text-slate-900 shadow-sm ring-2 ring-blue-400/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-black text-blue-800">
                <Calendar className="w-4 h-4" />
                <span>Schedule Later</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                Choose a planned date & time slot
              </p>
            </button>
          </div>
        </div>

        {/* Step 3: Address Details with Real GPS Detection */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              3. Service Location & Address:
            </label>
            <button
              type="button"
              onClick={handleFetchGps}
              disabled={isLocating}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-black flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-xl transition shadow-sm"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
              <span>{isLocating ? 'Detecting...' : '📍 Auto-Fill Real GPS Location'}</span>
            </button>
          </div>
          
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your complete address with landmark"
              className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe issue (e.g. leaking kitchen pipe, sparking switchboard)"
              className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Customer Problem Photo Upload Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Upload Problem Photo (समस्या की फोटो):</span>
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-xl transition flex items-center gap-1 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{problemPhoto ? 'Change Photo' : 'Choose File / Camera'}</span>
              </button>
            </div>

            {/* If Photo Selected, Show Preview */}
            {problemPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                <img 
                  src={problemPhoto} 
                  alt="Problem evidence" 
                  className="w-full h-36 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setProblemPhoto(null)}
                    className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1 shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-lg">
                  ✓ Photo Attached for Artisan
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-500">
                  Or pick a sample defect for instant demo:
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROBLEM_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProblemPhoto(preset.url)}
                      className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-[11px] font-bold text-slate-700 transition shadow-sm"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Breakdown Summary */}
        <div className="mt-6 p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Estimated Total (Inclusive of Taxes)</span>
            <span className="text-2xl font-black text-slate-900">₹{currentPrice}</span>
          </div>

          <div className="text-xs pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
            <span className="text-emerald-700">
              Worker Direct Net: ₹{workerCut} (88%)
            </span>
            <span className="text-amber-700">
              Welfare Health Fund: ₹{welfareCut} (7%)
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-7 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Broadcasting to Nearest Radar...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Broadcast to Radar</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
