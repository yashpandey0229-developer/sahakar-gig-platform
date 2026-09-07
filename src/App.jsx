import React, { useState } from 'react';
import { useAppState } from './context/AppStateContext';
import { Navbar } from './components/common/Navbar';
import { VoiceAssistant } from './components/common/VoiceAssistant';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { WorkerPortal } from './components/worker/WorkerPortal';
import { CooperativePortal } from './components/cooperative/CooperativePortal';
import { MinistryPortal } from './components/ministry/MinistryPortal';
import { PresentationGuideModal as PitchGuideModal } from './components/docs/PresentationGuideModal';
import { ArchitectureDiagramModal as ArchitectureModal } from './components/docs/ArchitectureDiagramModal';
import { RoleWelcomeModal } from './components/common/RoleWelcomeModal';
import { Star, ShieldCheck, Heart } from 'lucide-react';
import { getTranslation } from './services/translations';

export function App() {
  const { currentRole, setCurrentRole, language } = useAppState();
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('sahakar_user_role');
    } catch (e) {
      return false;
    }
  });

  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#16202C] flex flex-col font-sans selection:bg-[#1B4D3E] selection:text-white">
      
      {/* Global Navbar */}
      <Navbar
        onOpenPitchGuide={() => setIsPitchGuideOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      {/* Role Selection & Onboarding Modal */}
      <RoleWelcomeModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        {currentRole === 'customer' && <CustomerPortal />}
        {currentRole === 'worker' && <WorkerPortal />}
        {currentRole === 'cooperative' && <CooperativePortal />}
        {currentRole === 'ministry' && <MinistryPortal />}
      </main>

      {/* Floating Gemini AI Voice Assistant */}
      <VoiceAssistant />

      {/* Deep Navy Footer */}
      <footer className="mt-20 bg-[#111C26] text-[#E2E8F0] pt-16 pb-12 border-t border-[#1E2D3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#233345]">
            
            {/* Brand Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-slate-500 flex items-center justify-center text-white">
                  <Star className="w-4 h-4 fill-transparent stroke-[1.5]" />
                </div>
                <span className="text-2xl font-bold font-editorial text-white tracking-tight">
                  {t.brandTitle.includes('सहकार') ? (
                    <span>सहकार<span className="text-emerald-400 italic">गिग</span></span>
                  ) : (
                    <span>Sahakar<span className="text-emerald-400 italic">Gig</span></span>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {t.footerDesc}
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                {t.footerRegd}
              </div>
            </div>

            {/* Column 1: CITIZENS */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {t.footerCitizens}
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentRole('customer')} className="hover:text-white transition">
                    {language === 'hi' ? 'इलेक्ट्रीशियन बुक करें' : 'Book an Electrician'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('customer')} className="hover:text-white transition">
                    {language === 'hi' ? 'प्लंबिंग एवं जल प्रणाली' : 'Plumbing & Water Systems'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('customer')} className="hover:text-white transition">
                    {language === 'hi' ? 'एसी सर्विस एवं रिपेयर' : 'AC Service & Climate Tech'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('customer')} className="hover:text-white transition">
                    {language === 'hi' ? 'गृह स्वच्छता एवं सैनिटाइजेशन' : 'Deep House Sanitization'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: WORKER-MEMBERS */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {t.footerWorkers}
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentRole('worker')} className="hover:text-white transition">
                    {language === 'hi' ? 'कारीगर साथी कंपेनियन' : 'Worker Companion PWA'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('worker')} className="hover:text-white transition">
                    {language === 'hi' ? 'लाभांश एवं लेजर पासबुक' : 'Patronage Dividend Ledger'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('worker')} className="hover:text-white transition">
                    {language === 'hi' ? 'कैशलेस स्वास्थ्य सुरक्षा' : 'Cashless Health Shield'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('worker')} className="hover:text-white transition">
                    {language === 'hi' ? 'उपकरण सब्सिडी व ऋण' : 'Tool Subsidy & Loans'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: GOVERNANCE */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                {t.footerGovernance}
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentRole('cooperative')} className="hover:text-white transition">
                    {language === 'hi' ? '1-कामगार-1-वोट मतदान' : '1-Worker-1-Vote Proposals'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('cooperative')} className="hover:text-white transition">
                    {language === 'hi' ? 'साथी जूरी विवाद कक्ष' : 'Peer Jury Conflict Chamber'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentRole('ministry')} className="hover:text-white transition">
                    {language === 'hi' ? 'राष्ट्रीय मंत्रालय रजिस्ट्री' : 'National Ministry Registry'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsArchitectureOpen(true)} className="hover:text-white transition">
                    {language === 'hi' ? 'सिस्टम आर्किटेक्चर' : 'System Architecture'}
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
            <div>
              {t.copyright}
            </div>
            <div className="flex gap-4">
              <span>{t.bylaws}</span>
              <span>•</span>
              <span>{t.charter}</span>
              <span>•</span>
              <span>{t.audited}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* System Pitch Guide Modal */}
      <PitchGuideModal
        isOpen={isPitchGuideOpen}
        onClose={() => setIsPitchGuideOpen(false)}
      />

      {/* System Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

    </div>
  );
}

export default App;
