import React from 'react';
import { X, Layers, Database, ShieldCheck, Cpu, Radio, Network, GitBranch, ArrowDown, ArrowRight } from 'lucide-react';

export function ArchitectureDiagramModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  SahakarGig System Architecture (SDE Flex)
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  SIH26089 Engineering Design
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end data flow, fair rotation dispatch, ledger state machine & telemetry pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Architecture Diagram Interactive Blocks */}
        <div className="my-6 space-y-6 text-xs">
          
          {/* Layer 1: Client Frontends */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                1. Multi-Role Presentation Layer (React 19 + PWA + Web Speech)
              </span>
              <span className="text-[10px] text-slate-500">Frontend Tier</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="font-bold text-white block">Customer Portal</span>
                <p className="text-[10px] text-slate-400 mt-1">Catalog, Live Radar, Dual-OTP, Review</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="font-bold text-amber-400 block">Worker Voice PWA</span>
                <p className="text-[10px] text-slate-400 mt-1">Hindi Speech UI, GPS Steps, Wallet</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="font-bold text-purple-400 block">Coop Board Portal</span>
                <p className="text-[10px] text-slate-400 mt-1">Policy Voting, Welfare Pool, Peer Jury</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="font-bold text-blue-400 block">Ministry Dashboard</span>
                <p className="text-[10px] text-slate-400 mt-1">NCD Bridge, State Matrix, Telemetry</p>
              </div>
            </div>
          </div>

          {/* Flow Indicator */}
          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-5 h-5 animate-bounce text-emerald-500" />
          </div>

          {/* Layer 2: Realtime Dispatch & Geolocation Engine */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                2. Smart Fair-Dispatch & Telemetry Engine
              </span>
              <span className="text-[10px] text-slate-500">Business Logic & Algorithms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Fair-Rotation Algorithm</span>
                <p className="text-[11px] text-slate-300">
                  Scores workers via: Proximity (40%) + Rotation Opportunity (35%) + Skill Level (15%) + Rating (10%). Prevents star rating monopolies.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Live GPS Radar & Telemetry</span>
                <p className="text-[11px] text-slate-300">
                  Leaflet.js + Turf.js geohash indexing with simulated sub-second GPS coordinate interpolation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block mb-1">Dual-Key OTP Verification</span>
                <p className="text-[11px] text-slate-300">
                  Cryptographically matches Start OTP (upon physical arrival) and End OTP (service satisfaction) before payment trigger.
                </p>
              </div>
            </div>
          </div>

          {/* Flow Indicator */}
          <div className="flex justify-center text-slate-600">
            <ArrowDown className="w-5 h-5 animate-bounce text-amber-500" />
          </div>

          {/* Layer 3: Cooperative Financial Ledger & State Machine */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-blue-400">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                3. Cooperative Relational Ledger & State Machine
              </span>
              <span className="text-[10px] text-slate-500">Persistence & Accounting</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Worker Direct Split (88%)</span>
                <p className="text-[11px] text-slate-300">
                  Instant escrow settlement directly to worker's connected UPI/bank account.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Welfare Reserve Pool (7%)</span>
                <p className="text-[11px] text-slate-300">
                  Funds health insurance claims, safety gear subsidies, and soft emergency loans.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">Patronage Surplus (5% ops)</span>
                <p className="text-[11px] text-slate-300">
                  Covers platform maintenance; all year-end surplus distributed as worker dividends.
                </p>
              </div>
            </div>
          </div>

          {/* Layer 4: National Cooperative Grid & PACS Integration */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-400">
              <span className="flex items-center gap-1.5">
                <Network className="w-4 h-4" />
                4. PACS & National Cooperative Network Integrations
              </span>
              <span className="text-[10px] text-slate-500">Government Interoperability</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Direct hooks to <strong>PACS (Primary Agricultural Credit Societies)</strong> for rural youth onboarding, <strong>DigiLocker / Skill India</strong> for certificate verification, and <strong>District Central Cooperative Banks (DCCBs)</strong> for cashless welfare fund settlement.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
          >
            Close Architecture
          </button>
        </div>

      </div>
    </div>
  );
}
