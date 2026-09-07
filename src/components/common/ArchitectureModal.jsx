import React from 'react';
import { X, Layers, Database, ShieldCheck, Cpu, GitBranch, Radio, Terminal } from 'lucide-react';

export function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-2xl shadow-sm">
              🏗️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                  SahakarGig Full-Stack Architecture
                </h3>
                <span className="text-xs bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full font-black">
                  SIH26089
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                4-Tier Hybrid Architecture: MongoDB Atlas Cloud + React 19 + Express 5 + Web Speech AI
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

        {/* Content */}
        <div className="my-6 space-y-6 text-xs">
          
          {/* Architecture Diagram Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-blue-600" />
              1. 4-Tier Cooperative Software Stack
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-sm">
                <span className="text-emerald-700 font-black block">1. Presentation Tier</span>
                <span className="text-[11px] text-slate-600">React 19, Tailwind CSS, Leaflet OpenStreetMap</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-300 shadow-sm">
                <span className="text-amber-700 font-black block">2. Speech & Audio AI</span>
                <span className="text-[11px] text-slate-600">Bilingual Hindi/English Web Speech API + Web Audio</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-blue-300 shadow-sm">
                <span className="text-blue-700 font-black block">3. Business & Ledger API</span>
                <span className="text-[11px] text-slate-600">Express 5 REST API, 88-7-5 Wage Calculator</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-purple-300 shadow-sm">
                <span className="text-purple-700 font-black block">4. Cloud Persistence</span>
                <span className="text-[11px] text-slate-600">MongoDB Atlas (AWS Mumbai) + Resilient In-Memory</span>
              </div>
            </div>
          </div>

          {/* Database Schema & Models */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-emerald-600" />
              2. MongoDB Atlas Cloud Collections
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-emerald-700 block">workers</strong>
                <span className="text-slate-500">Skills, KYC, Society ID, Wallet</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-amber-700 block">bookings</strong>
                <span className="text-slate-500">Dual-OTP, GPS, 88-7-5 Ledger</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-purple-700 block">proposals</strong>
                <span className="text-slate-500">1-Worker-1-Vote democratic tallies</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-rose-700 block">disputes</strong>
                <span className="text-slate-500">Peer jury conflict chamber</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <strong className="text-blue-700 block">welfaremetrics</strong>
                <span className="text-slate-500">Quarterly dividends & health fund</span>
              </div>
            </div>
          </div>

          {/* Dual-OTP Security Protocol */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Dual-Key Cryptographic OTP Handshake
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              1. <strong>Job-Start OTP</strong>: Generated when booking is placed. Customer presents it physically to the artisan at the doorstep to initiate work and prevent fake arrivals.
              <br />
              2. <strong>Job-End OTP</strong>: Unlocked only after customer inspects the completed work. Verifying this OTP instantly triggers the 88% direct payout to the worker's bank via NPCI UPI and logs the 7% welfare credit.
            </p>
          </div>

        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition"
          >
            Close Architecture Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
