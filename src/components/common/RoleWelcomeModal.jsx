import React, { useState, useEffect } from 'react';
import { 
  Users, 
  HardHat, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  MapPin, 
  Building,
  UserPlus,
  LogIn,
  Wrench,
  Zap,
  Check,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function RoleWelcomeModal({ isOpen, onClose, initialMode = 'select' }) {
  const { 
    currentRole, 
    setCurrentRole, 
    activeWorker, 
    setActiveWorkerId,
    workers,
    registerWorker,
    customer, 
    updateCustomerProfile,
    language, 
    detectUserLocation, 
    isLocating,
    detectWorkerLocation,
    isWorkerLocating
  } = useAppState();

  const [mode, setMode] = useState(initialMode || 'select'); // 'select' | 'customer' | 'worker'

  // Customer Form State
  const [custForm, setCustForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '+91 98221 55601',
    address: customer?.address || 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune'
  });
  const [customCitizenId, setCustomCitizenId] = useState(
    customer?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000))
  );

  // Worker Form State
  const [workForm, setWorkForm] = useState({
    name: activeWorker?.name && activeWorker.name !== 'Ramesh Jadhav' ? activeWorker.name : '',
    phone: activeWorker?.phone || '+91 98230 44819',
    skill: activeWorker?.skills?.[0] || 'electrical',
    societyName: activeWorker?.societyName || 'Pune Urban Multi-Trade Cooperative',
    bankAccountMasked: activeWorker?.bankAccountMasked || '•••• 7712 (UPI Verified)',
    address: activeWorker?.address || 'Pune Urban Sector'
  });
  const [customWorkerMemberId, setCustomWorkerMemberId] = useState(
    activeWorker?.cooperativeMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000))
  );

  // Sync state when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'select');
      setCustForm({
        name: customer?.name || '',
        phone: customer?.phone || '+91 98221 55601',
        address: customer?.address || 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune'
      });
      setCustomCitizenId(customer?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000)));

      setWorkForm({
        name: activeWorker?.name && activeWorker.name !== 'Ramesh Jadhav' ? activeWorker.name : '',
        phone: activeWorker?.phone || '+91 98230 44819',
        skill: activeWorker?.skills?.[0] || 'electrical',
        societyName: activeWorker?.societyName || 'Pune Urban Multi-Trade Cooperative',
        bankAccountMasked: activeWorker?.bankAccountMasked || '•••• 7712 (UPI Verified)',
        address: activeWorker?.address || 'Pune Urban Sector'
      });
      setCustomWorkerMemberId(
        activeWorker?.cooperativeMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000))
      );
    }
  }, [isOpen, initialMode, customer, activeWorker]);

  if (!isOpen) return null;

  // Handler for Quick Demo Selection
  const handleQuickDemoRole = (role) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('sahakar_user_role', role);
    } catch (e) {}

    if (role === 'customer') {
      detectUserLocation().catch(() => {});
    } else if (role === 'worker') {
      setActiveWorkerId('w-101'); // Ramesh Jadhav
    }

    setMode('select');
    onClose();
  };

  // Submit Customer ID Creation / Login
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    const finalName = custForm.name.trim() || customer?.name || 'Priya Sharma';
    const finalPhone = custForm.phone.trim() || customer?.phone || '+91 98221 55601';
    const finalAddress = custForm.address.trim() || customer?.address || 'Shivajinagar, Pune';
    const finalId = customCitizenId || customer?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000));

    updateCustomerProfile({
      id: finalId,
      name: finalName,
      phone: finalPhone,
      address: finalAddress
    });

    setCurrentRole('customer');
    try {
      localStorage.setItem('sahakar_user_role', 'customer');
    } catch (e) {}

    setMode('select');
    onClose();
  };

  // Submit Worker ID Creation / Registration
  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    const finalName = workForm.name.trim() || 'New Sahakari Partner';
    const finalPhone = workForm.phone.trim() || '+91 98230 44819';
    const finalMemberId = customWorkerMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000));

    await registerWorker({
      name: finalName,
      phone: finalPhone,
      skills: [workForm.skill],
      societyName: workForm.societyName,
      cooperativeMemberId: finalMemberId,
      bankAccountMasked: workForm.bankAccountMasked,
      address: workForm.address || 'Pune Urban Sector'
    });

    setCurrentRole('worker');
    try {
      localStorage.setItem('sahakar_user_role', 'worker');
    } catch (e) {}

    setMode('select');
    onClose();
  };

  // GPS for Customer
  const handleCustomerGps = async () => {
    try {
      const geo = await detectUserLocation();
      if (geo) {
        setCustForm(prev => ({ ...prev, address: geo.address }));
      }
    } catch (e) {}
  };

  // GPS for Worker
  const handleWorkerGps = async () => {
    try {
      const geo = await detectWorkerLocation();
      if (geo) {
        setWorkForm(prev => ({ ...prev, address: geo.address }));
      }
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#111C26] text-white p-6 sm:p-7 text-center relative shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AUTHENTICATION & IDENTITY PERSISTENCE · OLA/UBER STACK</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {mode !== 'select' && (
              <button
                onClick={() => setMode('select')}
                className="absolute left-6 top-7 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1"
                title="Back to role selection"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight text-white">
              {mode === 'customer' ? (
                <span>Citizen Login & <span className="text-emerald-400 italic">ID Creation</span></span>
              ) : mode === 'worker' ? (
                <span>Artisan Partner <span className="text-amber-400 italic">ID Registration</span></span>
              ) : (
                <span>Welcome to Sahakar<span className="text-emerald-400 italic">Gig</span></span>
              )}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1.5 leading-relaxed font-sans">
            {mode === 'customer'
              ? 'Enter your name and address to create/save your Citizen ID, or continue with demo.'
              : mode === 'worker'
              ? 'Register your official cooperative member ID, set your skill, and enter the partner radar.'
              : 'Please select your entry mode or create your custom ID. Data will be saved permanently.'}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 bg-[#FAF7F0] flex-1">
          
          {/* VIEW 1: ROLE SELECTION */}
          {mode === 'select' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Option 1: Customer / Citizen App */}
                <div 
                  onClick={() => setMode('customer')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-xl ${
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
                      <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                        CITIZEN APP
                      </span>
                      {currentRole === 'customer' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
                      I Need Home Services
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Book verified electricians, plumbers & AC techs. 100% fair pricing, 88% direct payout.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>Current Saved ID:</span>
                        <span className="font-mono text-emerald-700 font-bold">{customer?.id || 'CIT-MH-501'}</span>
                      </div>
                      <div className="truncate text-[10px] text-slate-500">{customer?.name} · {customer?.address?.slice(0, 28)}...</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setMode('customer')}
                      className="w-full py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create / Login My Citizen ID</span>
                    </button>
                    <button 
                      onClick={() => handleQuickDemoRole('customer')}
                      className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1B4D3E] text-xs font-bold border border-emerald-200 transition text-center"
                    >
                      ⚡ Quick Demo: Enter as Priya Sharma
                    </button>
                  </div>
                </div>

                {/* Option 2: Worker Partner App */}
                <div 
                  onClick={() => setMode('worker')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all duration-200 flex flex-col justify-between hover:shadow-xl ${
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
                      <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-mono">
                        PARTNER APP
                      </span>
                      {currentRole === 'worker' && (
                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
                      I am a Worker Partner
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      Receive live radar dispatches near your GPS. 88% direct pay, health fund & patronage dividends.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>Current Saved ID:</span>
                        <span className="font-mono text-amber-700 font-bold">{activeWorker?.cooperativeMemberId || 'COOP-MH-4819'}</span>
                      </div>
                      <div className="truncate text-[10px] text-slate-500">{activeWorker?.name} · {activeWorker?.societyName?.slice(0, 28)}...</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setMode('worker')}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create / Register Worker ID</span>
                    </button>
                    <button 
                      onClick={() => handleQuickDemoRole('worker')}
                      className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition text-center"
                    >
                      ⚡ Quick Demo: Enter as Ramesh Jadhav
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 2: CUSTOMER LOGIN / REGISTRATION FORM */}
          {mode === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center text-lg font-bold">
                    🏠
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Citizen Identity & Location</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Will be saved to local storage</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    {customCitizenId}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomCitizenId('CIT-MH-' + Math.floor(1000 + Math.random() * 9000))}
                    className="p-1 text-slate-400 hover:text-emerald-700 transition"
                    title="Generate New Random ID"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / आपका नाम *
                </label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                  placeholder="e.g. Priya Sharma or Yash Pandey"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For Dual-OTP SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={custForm.phone}
                  onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                  placeholder="+91 98221 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Service Address / Street *
                  </label>
                  <button
                    type="button"
                    onClick={handleCustomerGps}
                    disabled={isLocating}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                    <span>{isLocating ? 'Detecting...' : 'Detect Real GPS'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  value={custForm.address}
                  onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                  placeholder="Flat No, Building Name, Street, Area, Pune"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Citizen ID & Enter Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoRole('customer')}
                  className="w-full py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold border border-slate-200 hover:bg-slate-50 transition"
                >
                  ⚡ Fast Demo: Use Priya Sharma
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: WORKER REGISTRATION / LOGIN FORM */}
          {mode === 'worker' && (
            <form onSubmit={handleWorkerSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg font-bold">
                    🧰
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Artisan Registration & ID</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Issued under Ministry of Cooperation</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    {customWorkerMemberId}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomWorkerMemberId('COOP-MH-' + Math.floor(1000 + Math.random() * 9000))}
                    className="p-1 text-slate-400 hover:text-amber-800 transition"
                    title="Generate New Member ID"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Artisan Name / कारीगर साथी का नाम *
                </label>
                <input
                  type="text"
                  required
                  value={workForm.name}
                  onChange={(e) => setWorkForm({ ...workForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Jadhav or Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    value={workForm.phone}
                    onChange={(e) => setWorkForm({ ...workForm, phone: e.target.value })}
                    placeholder="+91 98230 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Trade / व्यवसाय *
                  </label>
                  <select
                    value={workForm.skill}
                    onChange={(e) => setWorkForm({ ...workForm, skill: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="electrical">⚡ Electrical & Power Systems</option>
                    <option value="plumbing">🔧 Plumbing & Water Systems</option>
                    <option value="ac-repair">❄️ AC Service & Climate Tech</option>
                    <option value="cleaning">✨ Deep House Cleaning</option>
                    <option value="carpentry">🪚 Carpentry & Furniture</option>
                    <option value="painting">🎨 Painting & Wall Decor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Affiliated Cooperative Society / सोसायटी
                </label>
                <input
                  type="text"
                  value={workForm.societyName}
                  onChange={(e) => setWorkForm({ ...workForm, societyName: e.target.value })}
                  placeholder="Pune Urban Multi-Trade Cooperative"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bank / UPI Direct Payout Account
                  </label>
                  <input
                    type="text"
                    value={workForm.bankAccountMasked}
                    onChange={(e) => setWorkForm({ ...workForm, bankAccountMasked: e.target.value })}
                    placeholder="•••• 7712 (UPI Verified)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Live Radar Location
                  </label>
                  <button
                    type="button"
                    onClick={handleWorkerGps}
                    disabled={isWorkerLocating}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1 transition"
                  >
                    {isWorkerLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5 text-amber-700" />}
                    <span>{isWorkerLocating ? 'Pinning GPS...' : 'Pin Live GPS Radar'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Official Member ID & Enter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoRole('worker')}
                  className="w-full py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold border border-slate-200 hover:bg-slate-50 transition"
                >
                  ⚡ Fast Demo: Use Ramesh Jadhav (Electrician)
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer Bar */}
        <div className="shrink-0">
          {/* Institutional Portals Quick Access */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <span className="font-bold text-slate-600">Institutional Governance & Oversight:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuickDemoRole('cooperative')}
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
                onClick={() => handleQuickDemoRole('ministry')}
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

          {/* Dismiss note */}
          <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>💡 All created IDs and profiles persist across browser reloads.</span>
            <button 
              onClick={onClose}
              className="text-xs font-bold text-slate-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
