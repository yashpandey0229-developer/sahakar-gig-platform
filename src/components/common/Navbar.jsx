import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Globe, 
  Layers, 
  Database, 
  Bell, 
  ChevronDown,
  Loader2,
  HardHat,
  Users,
  Building2,
  ShieldCheck,
  ArrowRightLeft
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { getTranslation } from '../../services/translations';

export function Navbar({ onOpenArchitecture, onOpenRoleModal }) {
  const { 
    currentRole, 
    setCurrentRole, 
    language, 
    setLanguage, 
    dbStatus, 
    customer, 
    detectUserLocation, 
    isLocating, 
    activeWorker,
    activeBooking
  } = useAppState();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const t = getTranslation(language);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0] border-b border-[#EBE5D8]">
      
      {/* Top Heritage Navy Bar */}
      <div className="bg-[#111C26] text-[#E2E8F0] text-[11px] px-4 sm:px-8 py-1.5 flex items-center justify-between font-mono tracking-tight">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span>{t.topBarLeft}</span>
          <span className="text-slate-400 hidden sm:inline">{t.topBarRegd}</span>
        </div>
        <div className="italic text-slate-300 font-serif text-[12px] hidden md:block">
          {t.topBarMotto}
        </div>
      </div>

      {/* Main Cream Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onOpenRoleModal ? onOpenRoleModal() : setCurrentRole('customer')}
            className="cursor-pointer flex items-center gap-3"
            title="Click to Switch Persona / Role"
          >
            <div className="w-10 h-10 rounded-full border border-[#16202C] flex items-center justify-center text-[#16202C]">
              <Star className="w-5 h-5 fill-transparent stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-[#16202C] font-editorial">
                  {t.brandTitle.includes('सहकार') ? (
                    <span>सहकार<span className="text-[#1B4D3E] italic">गिग</span></span>
                  ) : (
                    <span>Sahakar<span className="text-[#1B4D3E] italic">Gig</span></span>
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono tracking-tight">
                {currentRole === 'customer' 
                  ? 'Citizen App · Verified Cooperative Artisans' 
                  : currentRole === 'worker' 
                    ? 'Partner App · 88% Direct Payout & 10km Radar' 
                    : t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Strict Role-Specific Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#16202C]">
            {currentRole === 'customer' ? (
              <>
                <button
                  onClick={() => {
                    const el = document.getElementById('catalog-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1B4D3E] font-bold text-[#1B4D3E] transition flex items-center gap-1.5"
                >
                  <span>🏠 {t.navServices}</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('where-money-goes');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#1B4D3E] transition"
                >
                  {t.navWhereMoneyGoes}
                </button>
                <button
                  onClick={detectUserLocation}
                  disabled={isLocating}
                  className="hover:text-[#1B4D3E] text-xs font-mono bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5"
                  title="Your Real GPS Location for 10 km Geofence"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[170px]">
                    {isLocating ? 'Detecting GPS...' : customer.address.split(',')[0]}
                  </span>
                </button>
              </>
            ) : currentRole === 'worker' ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🟢 ON DUTY · RADAR ACTIVE</span>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  ⚡ 10 km Proximity Geofencing Enabled
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Society: {activeWorker?.societyName}
                </span>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentRole('cooperative')}
                  className={`hover:text-[#1B4D3E] transition ${currentRole === 'cooperative' ? 'font-bold text-[#1B4D3E]' : ''}`}
                >
                  {t.navCoopBoard}
                </button>
                <button
                  onClick={() => setCurrentRole('ministry')}
                  className={`hover:text-[#1B4D3E] transition ${currentRole === 'ministry' ? 'font-bold text-[#1B4D3E]' : ''}`}
                >
                  National Oversight
                </button>
              </>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dedicated Role Badge */}
            <div className="hidden sm:flex items-center">
              {currentRole === 'customer' ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold font-mono">
                  <span>🏠 Citizen</span>
                  <span className="text-emerald-700 font-sans">({customer.name.split(' ')[0]})</span>
                </div>
              ) : currentRole === 'worker' ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold font-mono">
                  <span>🧰 Partner</span>
                  <span className="text-amber-700 font-sans">({activeWorker.name.split(' ')[0]})</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                  {currentRole.toUpperCase()}
                </div>
              )}
            </div>

            {/* Quick Role Switcher Button */}
            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-[#16202C] text-xs font-bold transition shadow-sm"
              title="Switch between Citizen App and Worker Partner App"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Switch Role</span>
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-[#16202C] bg-white text-xs font-mono font-bold text-[#16202C] hover:bg-[#16202C] hover:text-white transition shadow-sm"
              title="Toggle Hindi / English Language"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
            </button>

            {/* Portal Switcher Dropdown (for accessing board / ministry if needed) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="px-3 py-2 rounded-lg border border-[#D5CEBF] text-xs font-medium text-[#16202C] hover:bg-[#EFEAE1] transition flex items-center gap-1"
                title="All Portals Menu"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#EBE5D8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                  <div className="text-[10px] font-mono text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                    {t.switchPortal}
                  </div>
                  
                  <button
                    onClick={() => { setCurrentRole('customer'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      currentRole === 'customer' ? 'bg-[#FAF7F0] font-bold text-[#1B4D3E]' : 'hover:bg-[#FAF7F0] text-[#16202C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#1B4D3E]" />
                      <span>{t.citizenCustomer}</span>
                    </div>
                    {currentRole === 'customer' && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    onClick={() => { setCurrentRole('worker'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      currentRole === 'worker' ? 'bg-[#FAF7F0] font-bold text-amber-700' : 'hover:bg-[#FAF7F0] text-[#16202C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-amber-600" />
                      <span>{t.workerPartner}</span>
                    </div>
                    {currentRole === 'worker' && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    onClick={() => { setCurrentRole('cooperative'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      currentRole === 'cooperative' ? 'bg-[#FAF7F0] font-bold text-purple-700' : 'hover:bg-[#FAF7F0] text-[#16202C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-600" />
                      <span>{t.coopBoardGovernance}</span>
                    </div>
                    {currentRole === 'cooperative' && <span className="text-xs">✓</span>}
                  </button>

                  <button
                    onClick={() => { setCurrentRole('ministry'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      currentRole === 'ministry' ? 'bg-[#FAF7F0] font-bold text-blue-700' : 'hover:bg-[#FAF7F0] text-[#16202C]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>{t.nationalOversight}</span>
                    </div>
                    {currentRole === 'ministry' && <span className="text-xs">✓</span>}
                  </button>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex flex-col gap-1">
                    <button
                      onClick={() => { onOpenArchitecture(); setShowRoleDropdown(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <span>📐 System Architecture</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button based on Role */}
            {currentRole === 'customer' ? (
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-lg bg-[#16202C] hover:bg-[#223142] text-white text-xs font-medium shadow-sm transition"
              >
                {t.navBookAService}
              </button>
            ) : (
              <button
                onClick={() => {
                  const el = document.getElementById('worker-hud');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-sm transition"
              >
                🧰 Partner HUD
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
