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
  const { customer, createBooking, detectUserLocation, isLocating, workers } = useAppState();
  
  const matchingWorkersCount = (workers || []).filter(w => {
    const isOnline = (w.status === 'online' || w.isOnline);
    const skills = Array.isArray(w.skills) ? w.skills : [w.skills];
    return isOnline && skills.some(s => s && (s === service?.id || service?.id?.includes(s) || s?.includes(service?.id)));
  }).length;

  const [selectedSubService, setSelectedSubService] = useState(
    service?.subServices[0] || null
  );
  const [scheduleType, setScheduleType] = useState('express');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];
  const dayAfterDate = new Date();
  dayAfterDate.setDate(dayAfterDate.getDate() + 2);

  const [scheduledDateOption, setScheduledDateOption] = useState('tomorrow'); // 'today' | 'tomorrow' | 'dayAfter' | 'custom'
  const [customDate, setCustomDate] = useState(tomorrowStr);
  const [scheduledSlot, setScheduledSlot] = useState('02:00 PM - 04:00 PM');

  const TIME_SLOTS = [
    { id: 'morning', time: '09:00 AM - 11:00 AM', label: 'Morning' },
    { id: 'midday', time: '11:00 AM - 01:00 PM', label: 'Midday' },
    { id: 'afternoon', time: '02:00 PM - 04:00 PM', label: 'Afternoon' },
    { id: 'evening', time: '04:00 PM - 06:00 PM', label: 'Evening' },
    { id: 'late', time: '06:00 PM - 08:00 PM', label: 'Night' }
  ];

  const getFormattedScheduledTime = () => {
    if (scheduleType === 'express') return 'Immediate Express (ETA 10-15m)';
    let dateLabel = 'Today';
    if (scheduledDateOption === 'tomorrow') dateLabel = 'Tomorrow (' + tomorrowDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) + ')';
    else if (scheduledDateOption === 'dayAfter') {
      dateLabel = dayAfterDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (scheduledDateOption === 'custom') {
      const parsed = new Date(customDate);
      dateLabel = !isNaN(parsed) ? parsed.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : customDate;
    }
    return `${dateLabel} • ${scheduledSlot}`;
  };

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
      try {
        const bookingId = createBooking(service, selectedSubService, {
          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          address,
          location: customer.location,
          scheduledTime: getFormattedScheduledTime(),
          notes: notes + (problemPhoto ? ' [Issue Photo Attached]' : ''),
          problemPhoto
        });
        setIsSubmitting(false);
        if (onBookingSuccess) onBookingSuccess(bookingId);
        onClose();
      } catch (err) {
        console.error('Failed to create booking:', err);
        setIsSubmitting(false);
      }
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

        {/* Live Rapido Availability Status Strip */}
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>
              ⚡ <strong>{matchingWorkersCount} Verified {service?.title ? service.title.split(' ')[0] : 'Artisan'}{matchingWorkersCount === 1 ? '' : 's'} Available</strong> in your Pune sector
            </span>
          </div>
          <span className="text-[10px] bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded-md">
            Live Radar Ready
          </span>
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

          {/* Interactive Schedule Later Date & Time Slot Picker */}
          {scheduleType === 'scheduled' && (
            <div className="mt-3 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 border-2 border-blue-200 shadow-sm space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black text-slate-900 font-['Outfit']">
                    Select Planned Date & Arrival Window
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  Guaranteed Slot
                </span>
              </div>

              {/* A. Date Selector Chips */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-700 block">
                  Choose Service Date (दिनांक चुनें):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduledDateOption('today')}
                    className={`p-2.5 rounded-2xl border text-center transition ${
                      scheduledDateOption === 'today'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <span className="text-xs block font-bold">Today</span>
                    <span className="text-[10px] opacity-80 block">{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduledDateOption('tomorrow')}
                    className={`p-2.5 rounded-2xl border text-center transition ${
                      scheduledDateOption === 'tomorrow'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <span className="text-xs block font-bold">Tomorrow</span>
                    <span className="text-[10px] opacity-80 block">{tomorrowDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduledDateOption('dayAfter')}
                    className={`p-2.5 rounded-2xl border text-center transition ${
                      scheduledDateOption === 'dayAfter'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <span className="text-xs block font-bold">{dayAfterDate.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                    <span className="text-[10px] opacity-80 block">{dayAfterDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduledDateOption('custom')}
                    className={`p-2.5 rounded-2xl border text-center transition ${
                      scheduledDateOption === 'custom'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <span className="text-xs block font-bold">Pick Date</span>
                    <span className="text-[10px] opacity-80 block">Custom 📅</span>
                  </button>
                </div>

                {scheduledDateOption === 'custom' && (
                  <div className="pt-2">
                    <input
                      type="date"
                      min={todayStr}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                )}
              </div>

              {/* B. Time Slot Chips */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-black text-slate-700 flex items-center justify-between">
                  <span>Select 2-Hour Arrival Window (समय चुनें):</span>
                  <span className="text-[10px] text-blue-700 font-bold font-mono">Selected: {scheduledSlot}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const isSelected = scheduledSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setScheduledSlot(slot.time)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 text-xs'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] uppercase font-mono block opacity-80">{slot.label}</span>
                          <span className="text-xs font-bold">{slot.time}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* C. Selected Slot Summary Badge */}
              <div className="p-3 bg-white border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Confirmed Appointment:</strong> {getFormattedScheduledTime()}
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  ✓ Slot Ready
                </span>
              </div>

            </div>
          )}
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
                <span>{scheduleType === 'scheduled' ? 'Confirming Scheduled Appointment...' : 'Broadcasting to Nearest Radar...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{scheduleType === 'scheduled' ? 'Confirm & Schedule Appointment' : 'Confirm & Broadcast to Radar'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
