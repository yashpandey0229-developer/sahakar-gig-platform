import React, { useState } from 'react';
import { 
  HardHat, 
  Wallet, 
  Zap, 
  Award, 
  Users, 
  Clock, 
  MapPin, 
  Volume2,
  ChevronDown,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { WorkerDashboard } from './WorkerDashboard';
import { ActiveJobExecution } from './ActiveJobExecution';
import { CooperativeWallet } from './CooperativeWallet';

export function WorkerPortal() {
  const { workers, activeWorker, setActiveWorkerId, activeBooking, setCurrentRole, language } = useAppState();
  const [activeTab, setActiveTab] = useState(
    activeBooking && activeBooking.status !== 'COMPLETED' ? 'execution' : 'dashboard'
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Distinct Worker Mode Header Banner */}
      <div className="bg-[#111C26] text-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-amber-500/30">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-md">
            🧰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider font-mono">
                {language === 'hi' ? 'कारीगर साथी मोड' : 'WORKER PARTNER PORTAL'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {language === 'hi' ? 'आईडी' : 'ID'}: {activeWorker?.cooperativeMemberId}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-editorial text-white mt-0.5">
              {activeWorker?.name} · <span className="text-amber-400 text-base font-sans font-normal">{activeWorker?.societyName}</span>
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Persona Switcher for testing */}
          <select
            value={activeWorker?.id}
            onChange={(e) => setActiveWorkerId(e.target.value)}
            className="bg-[#1C2A39] border border-[#2D3F54] text-white text-xs font-mono px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
          >
            {workers.map((w) => (
              <option key={w.id} value={w.id} className="bg-[#111C26] text-white">
                {w.name} ({w.skills[0]}) - ⭐{w.rating}
              </option>
            ))}
          </select>

          {/* Quick Exit to Customer Mode Button */}
          <button
            onClick={() => setCurrentRole('customer')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#16202C] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'नागरिक मोड' : 'Customer View'}</span>
          </button>

        </div>

      </div>

      {/* Worker Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EBE5D8] pb-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'dashboard'
              ? 'bg-[#16202C] text-white shadow-sm'
              : 'bg-white border border-[#D5CEBF] text-[#16202C] hover:bg-[#EFEAE1]'
          }`}
        >
          <HardHat className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'ड्यूटी व गिग्स' : 'Partner HUD & Gigs'}</span>
        </button>

        <button
          onClick={() => setActiveTab('execution')}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'execution'
              ? 'bg-[#16202C] text-white shadow-sm'
              : 'bg-white border border-[#D5CEBF] text-[#16202C] hover:bg-[#EFEAE1]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'नेविगेशन व ओटीपी' : 'Turn-by-Turn GPS'}</span>
          {activeBooking && activeBooking.status !== 'COMPLETED' && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute top-1 right-1" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'wallet'
              ? 'bg-[#16202C] text-white shadow-sm'
              : 'bg-white border border-[#D5CEBF] text-[#16202C] hover:bg-[#EFEAE1]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'वॉलेट व लाभांश' : 'Wallet & Dividends'}</span>
        </button>
      </div>

      {/* Tab Render */}
      {activeTab === 'dashboard' && (
        <WorkerDashboard
          onOpenJobExecution={() => setActiveTab('execution')}
          onOpenWallet={() => setActiveTab('wallet')}
        />
      )}

      {activeTab === 'execution' && (
        <ActiveJobExecution
          onBackToDashboard={() => setActiveTab('dashboard')}
          onOpenWallet={() => setActiveTab('wallet')}
        />
      )}

      {activeTab === 'wallet' && (
        <CooperativeWallet onBackToDashboard={() => setActiveTab('dashboard')} />
      )}

    </div>
  );
}
