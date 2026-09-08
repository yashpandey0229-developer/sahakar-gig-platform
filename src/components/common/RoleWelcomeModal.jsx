import React from 'react';
import { Users, HardHat, ShieldCheck, Star, Sparkles, ArrowRight, CheckCircle2, MapPin, Building } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function RoleWelcomeModal({ isOpen, onClose }) {
  const { currentRole, setCurrentRole, activeWorker, customer, language, detectUserLocation, isLocating } = useAppState();

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('sahakar_user_role', role);
    } catch (e) {}
    
    // Trigger real GPS acquisition automatically on role selection
    if (role === 'customer') {
      detectUserLocation().catch(() => {});
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#111C26] text-white p-6 sm:p-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME GPS DEMO · OLA / UBER ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight text-white">
            Welcome to Sahakar<span className="text-emerald-400 italic">Gig</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
            Please select how you are entering the platform today. Your screen will be customized strictly for your role.
          </p>
        </div>

        {/* 2 Big Persona Cards */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F0]">
          
          {/* Option 1: Customer / Citizen App */}
          <div 
            onClick={() => handleSelectRole('customer')}
            className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between hover:scale-[1.02] ${
              currentRole === 'customer'
                ? 'bg-white border-[#1B4D3E] shadow-xl ring-4 ring-emerald-500/10'
                : 'bg-white border-slate-200 hover:border-[#1B4D3E]/50 shadow-sm'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center text-3xl mb-4 shadow-sm">
                🏠
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  CITIZEN APP
                </span>
                {currentRole === 'customer' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
                I Need Home Services
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Book verified electricians, plumbers & AC techs near your GPS. 100% fair pricing, 0% platform commission markup.
              </p>
              
              <div className="mt-4 space-y-1.5 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real GPS geofenced dispatch (10 km)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure 4-digit start/finish OTPs</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition">
              <span>Enter Citizen Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option 2: Worker Partner App */}
          <div 
            onClick={() => handleSelectRole('worker')}
            className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between hover:scale-[1.02] ${
              currentRole === 'worker'
                ? 'bg-white border-amber-500 shadow-xl ring-4 ring-amber-500/10'
                : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mb-4 shadow-sm">
                🧰
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  PARTNER APP
                </span>
                {currentRole === 'worker' && (
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" /> Active
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
                I am a Worker Partner
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Receive live radar dispatches within 10 km of your real GPS. 88% direct payout, healthcare fund & cooperative ownership.
              </p>

              <div className="mt-4 space-y-1.5 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Real-time proximity matching (&lt; 10 km)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-600" />
                  <span>88% direct payout + quarterly dividend</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 transition">
              <span>Enter Worker Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Institutional Portals Quick Access */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <span className="font-bold text-slate-600">Institutional Governance & Oversight:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectRole('cooperative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                currentRole === 'cooperative'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white hover:bg-purple-50 text-purple-900 border-purple-200'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-purple-600" />
              <span>Cooperative Board</span>
            </button>
            <button
              onClick={() => handleSelectRole('ministry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                currentRole === 'ministry'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white hover:bg-blue-50 text-blue-900 border-blue-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>National Ministry Oversight</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>💡 You can switch roles anytime using the toggle button in the top navbar.</span>
          <button 
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:underline"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
