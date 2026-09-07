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
  const { 
    workers, 
    activeWorker, 
    setActiveWorkerId, 
    activeBooking, 
    setCurrentRole, 
    language, 
    registerWorker,
    detectWorkerLocation,
    isWorkerLocating 
  } = useAppState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '+91 98',
    skill: 'electrical',
    societyName: 'Pune Urban Electrical & Tech Cooperative',
    bankAccountMasked: '•••• ' + Math.floor(1000 + Math.random() * 9000) + ' (UPI Verified)',
    useCurrentGps: true
  });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name.trim()) return;

    let workerLoc = activeWorker?.location || { lat: 18.5298, lng: 73.8472 };
    let workerAddr = activeWorker?.address || 'Pune Urban Sector';

    if (regForm.useCurrentGps) {
      try {
        const geo = await detectWorkerLocation();
        if (geo) {
          workerLoc = { lat: geo.lat, lng: geo.lng };
          workerAddr = geo.address;
        }
      } catch (err) {}
    }

    await registerWorker({
      name: regForm.name.trim(),
      phone: regForm.phone,
      skills: [regForm.skill],
      societyName: regForm.societyName,
      bankAccountMasked: regForm.bankAccountMasked,
      location: workerLoc,
      address: workerAddr,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
    });

    setShowRegisterModal(false);
  };

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
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Register Custom Worker Button */}
          <button
            onClick={() => {
              setRegForm({
                name: activeWorker?.name || '',
                phone: activeWorker?.phone || '+91 98230 00000',
                skill: activeWorker?.skills?.[0] || 'electrical',
                societyName: activeWorker?.societyName || 'Pune Urban Multi-Trade Cooperative',
                bankAccountMasked: activeWorker?.bankAccountMasked || '•••• 7721 (UPI Verified)'
              });
              setShowRegisterModal(true);
            }}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
          >
            <span>+ {language === 'hi' ? 'साथी प्रोफाइल / नया पंजीकरण' : 'Register / Edit Profile'}</span>
          </button>

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

      {/* Register Partner Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
                  Cooperative Partner Registration
                </h3>
                <p className="text-xs text-slate-500">Enter your details to receive live radar gigs</p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name (आपका नाम)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Jadhav"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trade / Skill Category</label>
                <select
                  value={regForm.skill}
                  onChange={(e) => setRegForm({ ...regForm, skill: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold bg-white"
                >
                  <option value="electrical">⚡ Electrical & Power Systems</option>
                  <option value="plumbing">🚰 Plumbing & Water Systems</option>
                  <option value="ac-repair">❄️ AC & Climate Tech</option>
                  <option value="deep-cleaning">🧹 Deep House Cleaning</option>
                  <option value="carpentry">🪚 Woodwork & Carpentry</option>
                  <option value="painting">🎨 Painting & Water Proofing</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number (फोन नंबर)</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98230 00000"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cooperative Society</label>
                <input
                  type="text"
                  placeholder="Pune Urban Artisan Cooperative"
                  value={regForm.societyName}
                  onChange={(e) => setRegForm({ ...regForm, societyName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">UPI ID for 88% Direct Payout</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={regForm.bankAccountMasked}
                  onChange={(e) => setRegForm({ ...regForm, bankAccountMasked: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none font-bold font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <input
                  type="checkbox"
                  id="useGpsCheck"
                  checked={regForm.useCurrentGps}
                  onChange={(e) => setRegForm({ ...regForm, useCurrentGps: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="useGpsCheck" className="text-[11px] font-bold text-emerald-950 cursor-pointer">
                  📍 Pin my phone's live GPS coordinates to this worker profile
                </label>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md transition"
                >
                  Save & Join Dispatch Radar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
