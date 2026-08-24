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

export function Navbar({ onOpenPitchGuide, onOpenArchitecture }) {
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
            onClick={() => setCurrentRole('customer')}
            className="cursor-pointer flex items-center gap-3"
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
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-[#16202C]">
            <button
              onClick={() => setCurrentRole('customer')}
              className={`hover:text-[#1B4D3E] transition ${currentRole === 'customer' ? 'font-bold text-[#1B4D3E]' : ''}`}
            >
              {t.navServices}
            </button>
            <button
              onClick={() => {
                setCurrentRole('customer');
                const el = document.getElementById('where-money-goes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#1B4D3E] transition"
            >
              {t.navWhereMoneyGoes}
            </button>
            <button
              onClick={() => setCurrentRole('worker')}
              className={`hover:text-[#1B4D3E] transition ${currentRole === 'worker' ? 'font-bold text-[#1B4D3E]' : ''}`}
            >
              {t.navForWorkers}
            </button>
            <button
              onClick={() => setCurrentRole('cooperative')}
              className={`hover:text-[#1B4D3E] transition ${currentRole === 'cooperative' ? 'font-bold text-[#1B4D3E]' : ''}`}
            >
              {t.navCoopBoard}
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Language Toggle Button (Reactive Hindi / EN) */}
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-1.5 rounded-lg border-2 border-[#16202C] bg-white text-xs font-mono font-bold text-[#16202C] hover:bg-[#16202C] hover:text-white transition shadow-sm"
              title="Toggle Hindi / English Language"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
            </button>

            {/* Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="px-4 py-2 rounded-lg border border-[#D5CEBF] text-xs font-medium text-[#16202C] hover:bg-[#EFEAE1] transition flex items-center gap-1.5"
              >
                <span>
                  {currentRole === 'customer' && (language === 'hi' ? 'नागरिक मोड' : 'Citizen Mode')}
                  {currentRole === 'worker' && `Worker: ${activeWorker.name.split(' ')[0]}`}
                  {currentRole === 'cooperative' && (language === 'hi' ? 'बोर्ड कक्ष' : 'Coop Board')}
                  {currentRole === 'ministry' && (language === 'hi' ? 'राष्ट्रीय निगरानी' : 'Oversight')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-[#EBE5D8] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
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
                </div>
              )}
            </div>

            {/* Book a Service Navy Button */}
            <button
              onClick={() => {
                setCurrentRole('customer');
                const el = document.getElementById('catalog-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-lg bg-[#16202C] hover:bg-[#223142] text-white text-xs font-medium shadow-sm transition"
            >
              {t.navBookAService}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
