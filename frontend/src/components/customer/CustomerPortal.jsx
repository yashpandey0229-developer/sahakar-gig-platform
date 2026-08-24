import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Radio, 
  FileText, 
  Grid, 
  Receipt
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { ServiceGrid } from './ServiceGrid';
import { BookingModal } from './BookingModal';
import { ActiveBookingTracker } from './ActiveBookingTracker';
import { CustomerHistory } from './CustomerHistory';
import { TransparentPriceModal } from '../common/TransparentPriceModal';

export function CustomerPortal() {
  const { activeBooking, activeBookingId, setActiveBookingId, bookings } = useAppState();
  
  const [activeTab, setActiveTab] = useState(activeBooking ? 'active' : 'services');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [priceModalConfig, setPriceModalConfig] = useState({ isOpen: false, service: null, amount: 500 });
  const [reviewBooking, setReviewBooking] = useState(null);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Portal Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full font-black uppercase tracking-wider">
              CITIZEN / CUSTOMER PORTAL
            </span>
            <span className="text-xs text-slate-500 font-bold">Pune Cooperative District</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
            Democratic Household Services
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'services'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Browse Services</span>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'active'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>Active Gig Radar</span>
            {activeBooking && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>History & Receipts</span>
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

    </div>
  );
}
