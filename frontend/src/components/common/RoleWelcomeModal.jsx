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
  RefreshCw,
  Mail,
  KeyRound,
  Send,
  Lock,
  CheckCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { api } from '../../services/api';

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
    isWorkerLocating,
    addNotification
  } = useAppState();

  const [mode, setMode] = useState(initialMode || 'select'); // 'select' | 'customer' | 'worker'

  // Customer Form State
  const [custForm, setCustForm] = useState({
    name: customer?.name || '',
    email: customer?.email || 'priya.sharma@sahakar.org',
    phone: customer?.phone || '+91 98221 55601',
    address: customer?.address || 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune'
  });
  const [customCitizenId, setCustomCitizenId] = useState(
    customer?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000))
  );

  // Customer Email Authenticator States
  const [custStep, setCustStep] = useState('form'); // 'form' | 'otp'
  const [custEmailSending, setCustEmailSending] = useState(false);
  const [custGeneratedOtp, setCustGeneratedOtp] = useState('');
  const [custInputOtp, setCustInputOtp] = useState('');
  const [custEmailVerified, setCustEmailVerified] = useState(false);
  const [custRealEmailSent, setCustRealEmailSent] = useState(false);
  const [custTimer, setCustTimer] = useState(0);

  // Worker Form State
  const [workForm, setWorkForm] = useState({
    name: activeWorker?.name && activeWorker.name !== 'Ramesh Jadhav' ? activeWorker.name : '',
    email: activeWorker?.email || 'ramesh.jadhav@coop.org',
    phone: activeWorker?.phone || '+91 98230 44819',
    skill: activeWorker?.skills?.[0] || 'electrical',
    societyName: activeWorker?.societyName || 'Pune Urban Multi-Trade Cooperative',
    bankAccountMasked: activeWorker?.bankAccountMasked || '•••• 7712 (UPI Verified)',
    address: activeWorker?.address || 'Pune Urban Sector'
  });
  const [customWorkerMemberId, setCustomWorkerMemberId] = useState(
    activeWorker?.cooperativeMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000))
  );

  // Worker Email Authenticator States
  const [workStep, setWorkStep] = useState('form'); // 'form' | 'otp'
  const [workEmailSending, setWorkEmailSending] = useState(false);
  const [workGeneratedOtp, setWorkGeneratedOtp] = useState('');
  const [workInputOtp, setWorkInputOtp] = useState('');
  const [workEmailVerified, setWorkEmailVerified] = useState(false);
  const [workRealEmailSent, setWorkRealEmailSent] = useState(false);
  const [workTimer, setWorkTimer] = useState(0);

  // Password Login & Registration States
  const [custAuthTab, setCustAuthTab] = useState('login'); // 'login' | 'register'
  const [custLoginEmail, setCustLoginEmail] = useState(customer?.email || 'priya.sharma@sahakar.org');
  const [custLoginPassword, setCustLoginPassword] = useState('');
  const [custLoginError, setCustLoginError] = useState('');
  const [showCustLoginPassword, setShowCustLoginPassword] = useState(false);
  const [custRegPassword, setCustRegPassword] = useState('');
  const [showCustRegPassword, setShowCustRegPassword] = useState(false);

  const [workAuthTab, setWorkAuthTab] = useState('login'); // 'login' | 'register'
  const [workLoginEmail, setWorkLoginEmail] = useState(activeWorker?.email || 'ramesh.jadhav@coop.org');
  const [workLoginPassword, setWorkLoginPassword] = useState('');
  const [workLoginError, setWorkLoginError] = useState('');
  const [showWorkLoginPassword, setShowWorkLoginPassword] = useState(false);
  const [workRegPassword, setWorkRegPassword] = useState('');
  const [showWorkRegPassword, setShowWorkRegPassword] = useState(false);

  // Helper: Get Saved Registered Accounts from LocalStorage
  const getRegisteredAccounts = () => {
    try {
      const saved = localStorage.getItem('sahakar_registered_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        role: 'customer',
        email: 'priya.sharma@sahakar.org',
        password: 'sahakar123',
        name: 'Priya Sharma',
        phone: '+91 98221 55601',
        address: 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune',
        id: 'CIT-MH-501'
      },
      {
        role: 'worker',
        email: 'ramesh.jadhav@coop.org',
        password: 'sahakar123',
        name: 'Ramesh Jadhav',
        phone: '+91 98230 44819',
        skill: 'electrical',
        societyName: 'Pune Urban Multi-Trade Cooperative',
        cooperativeMemberId: 'COOP-MH-4819',
        address: 'Pune Urban Sector'
      }
    ];
  };

  const saveRegisteredAccount = (account) => {
    const list = getRegisteredAccounts();
    const existingIdx = list.findIndex(
      a => a.email.toLowerCase() === account.email.toLowerCase() && a.role === account.role
    );
    let updated;
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...account };
      updated = list;
    } else {
      updated = [account, ...list];
    }
    try {
      localStorage.setItem('sahakar_registered_accounts', JSON.stringify(updated));
    } catch (e) {}
    return updated;
  };

  // Instant Password Login Handler for Customer
  const handleCustPasswordLogin = (e) => {
    e.preventDefault();
    setCustLoginError('');
    const email = (custLoginEmail || '').trim().toLowerCase();
    const pass = (custLoginPassword || '').trim();

    if (!email || !pass) {
      setCustLoginError('Please enter both email and password.');
      return;
    }

    const accounts = getRegisteredAccounts();
    const match = accounts.find(a => a.role === 'customer' && a.email.toLowerCase() === email);

    if ((match && (match.password === pass || pass === 'sahakar123')) || (!match && pass === 'sahakar123')) {
      const resolvedName = match?.name || (email.split('@')[0].replace('.', ' ').toUpperCase());
      const resolvedId = match?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000));
      const resolvedPhone = match?.phone || '+91 98221 55601';
      const resolvedAddress = match?.address || 'Shivajinagar, Pune';

      updateCustomerProfile({
        id: resolvedId,
        name: resolvedName,
        email: email,
        phone: resolvedPhone,
        address: resolvedAddress
      });

      setCurrentRole('customer');
      try {
        localStorage.setItem('sahakar_user_role', 'customer');
        localStorage.setItem('sahakar_active_session', JSON.stringify({ email, role: 'customer', name: resolvedName }));
      } catch (err) {}

      addNotification('Instant Login Successful', `Welcome back, ${resolvedName}! Logged in via password.`, 'success');
      setMode('select');
      onClose();
    } else {
      setCustLoginError('Invalid password. Demo password is "sahakar123" or click "Register with Email OTP" to set your password.');
    }
  };

  // Instant Password Login Handler for Worker
  const handleWorkPasswordLogin = async (e) => {
    e.preventDefault();
    setWorkLoginError('');
    const email = (workLoginEmail || '').trim().toLowerCase();
    const pass = (workLoginPassword || '').trim();

    if (!email || !pass) {
      setWorkLoginError('Please enter both email and password.');
      return;
    }

    const accounts = getRegisteredAccounts();
    const match = accounts.find(a => a.role === 'worker' && a.email.toLowerCase() === email);

    if ((match && (match.password === pass || pass === 'sahakar123')) || (!match && pass === 'sahakar123')) {
      const resolvedName = match?.name || 'Ramesh Jadhav';
      const resolvedMemberId = match?.cooperativeMemberId || 'COOP-MH-4819';
      const resolvedPhone = match?.phone || '+91 98230 44819';

      const existingWorker = workers.find(w => w.email?.toLowerCase() === email);
      if (existingWorker) {
        setActiveWorkerId(existingWorker.id);
      } else {
        await registerWorker({
          name: resolvedName,
          email: email,
          phone: resolvedPhone,
          skills: [match?.skill || 'electrical'],
          societyName: match?.societyName || 'Pune Urban Multi-Trade Cooperative',
          cooperativeMemberId: resolvedMemberId,
          bankAccountMasked: '•••• 7712 (UPI Verified)',
          address: match?.address || 'Pune Urban Sector'
        });
      }

      setCurrentRole('worker');
      try {
        localStorage.setItem('sahakar_user_role', 'worker');
        localStorage.setItem('sahakar_active_session', JSON.stringify({ email, role: 'worker', name: resolvedName }));
      } catch (err) {}

      addNotification('Partner Login Successful', `Welcome back, ${resolvedName}! On duty with 10km radar.`, 'success');
      setMode('select');
      onClose();
    } else {
      setWorkLoginError('Invalid password. Demo password is "sahakar123" or click "Register with Email OTP" to set your password.');
    }
  };

  // Countdown Timers
  useEffect(() => {
    let interval = null;
    if (custTimer > 0) {
      interval = setInterval(() => setCustTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [custTimer]);

  useEffect(() => {
    let interval = null;
    if (workTimer > 0) {
      interval = setInterval(() => setWorkTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [workTimer]);

  // Sync state when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'select');
      setCustStep('form');
      setWorkStep('form');
      setCustLoginError('');
      setWorkLoginError('');

      setCustForm({
        name: customer?.name || '',
        email: customer?.email || 'priya.sharma@sahakar.org',
        phone: customer?.phone || '+91 98221 55601',
        address: customer?.address || 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune'
      });
      setCustLoginEmail(customer?.email || 'priya.sharma@sahakar.org');

      setCustomCitizenId(customer?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000)));

      setWorkForm({
        name: activeWorker?.name && activeWorker.name !== 'Ramesh Jadhav' ? activeWorker.name : '',
        email: activeWorker?.email || 'ramesh.jadhav@coop.org',
        phone: activeWorker?.phone || '+91 98230 44819',
        skill: activeWorker?.skills?.[0] || 'electrical',
        societyName: activeWorker?.societyName || 'Pune Urban Multi-Trade Cooperative',
        bankAccountMasked: activeWorker?.bankAccountMasked || '•••• 7712 (UPI Verified)',
        address: activeWorker?.address || 'Pune Urban Sector'
      });
      setWorkLoginEmail(activeWorker?.email || 'ramesh.jadhav@coop.org');

      setCustomWorkerMemberId(
        activeWorker?.cooperativeMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000))
      );
    }
  }, [isOpen, initialMode, customer, activeWorker]);

  if (!isOpen) return null;

  // Send Customer Email OTP
  const handleSendCustEmailOtp = async () => {
    if (!custForm.email || !custForm.email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setCustEmailSending(true);
    try {
      const res = await api.sendOtp({
        type: 'email',
        recipient: custForm.email,
        role: 'customer',
        name: custForm.name
      });
      const code = res?.otp || Math.floor(100000 + Math.random() * 900000).toString();
      setCustGeneratedOtp(code);
      setCustInputOtp('');
      setCustRealEmailSent(!!res?.realEmailSent);
      setCustStep('otp');
      setCustTimer(60);

      if (res?.realEmailSent) {
        addNotification(
          'Email Authenticator Code Sent',
          `An official 6-digit security code was dispatched to ${custForm.email}. Check your inbox!`,
          'success'
        );
      } else {
        addNotification(
          'Security Passcode Dispatched',
          `Verification passcode for ${custForm.email}: ${code}`,
          'info'
        );
      }
    } catch (e) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setCustGeneratedOtp(code);
      setCustInputOtp('');
      setCustStep('otp');
      setCustTimer(60);
      addNotification('Security Passcode Ready', `Passcode: ${code}`, 'info');
    } finally {
      setCustEmailSending(false);
    }
  };

  // Verify Customer Email OTP
  const handleVerifyCustOtp = async (codeToVerify) => {
    const code = (codeToVerify || custInputOtp).trim();
    if (!code || code.length < 6) {
      alert('Please enter the full 6-digit verification passcode received on your email.');
      return;
    }

    try {
      const res = await api.verifyOtp({ recipient: custForm.email, otp: code });
      if (res?.verified) {
        setCustEmailVerified(true);
        setCustStep('form');
        addNotification('Authentication Successful', `Citizen email verified for ${custForm.email}`, 'success');
        return;
      }
      if (res && res.verified === false) {
        alert(res.message || 'Incorrect passcode. Please check your email and try again.');
        return;
      }
    } catch (e) {}

    // Offline / direct match fallback
    if (code === custGeneratedOtp) {
      setCustEmailVerified(true);
      setCustStep('form');
      addNotification('Authentication Successful', `Citizen email verified for ${custForm.email}`, 'success');
    } else {
      alert('Incorrect passcode. Please check your email and try again.');
    }
  };

  // Send Worker Email OTP
  const handleSendWorkEmailOtp = async () => {
    if (!workForm.email || !workForm.email.includes('@')) {
      alert('Please enter a valid cooperative email.');
      return;
    }
    setWorkEmailSending(true);
    try {
      const res = await api.sendOtp({
        type: 'email',
        recipient: workForm.email,
        role: 'worker',
        name: workForm.name
      });
      const code = res?.otp || Math.floor(100000 + Math.random() * 900000).toString();
      setWorkGeneratedOtp(code);
      setWorkInputOtp('');
      setWorkRealEmailSent(!!res?.realEmailSent);
      setWorkStep('otp');
      setWorkTimer(60);

      if (res?.realEmailSent) {
        addNotification(
          'Partner Email Code Sent',
          `An official 6-digit security code was dispatched to ${workForm.email}. Check your inbox!`,
          'success'
        );
      } else {
        addNotification(
          'Partner Security Code Ready',
          `Verification passcode for ${workForm.email}: ${code}`,
          'info'
        );
      }
    } catch (e) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setWorkGeneratedOtp(code);
      setWorkInputOtp('');
      setWorkStep('otp');
      setWorkTimer(60);
      addNotification('Partner Passcode Ready', `Passcode: ${code}`, 'info');
    } finally {
      setWorkEmailSending(false);
    }
  };

  // Verify Worker Email OTP
  const handleVerifyWorkOtp = async (codeToVerify) => {
    const code = (codeToVerify || workInputOtp).trim();
    if (!code || code.length < 6) {
      alert('Please enter the full 6-digit verification passcode received on your email.');
      return;
    }

    try {
      const res = await api.verifyOtp({ recipient: workForm.email, otp: code });
      if (res?.verified) {
        setWorkEmailVerified(true);
        setWorkStep('form');
        addNotification('Partner Credentials Verified', `Cooperative email verified for ${workForm.email}`, 'success');
        return;
      }
      if (res && res.verified === false) {
        alert(res.message || 'Incorrect passcode. Please check your email and try again.');
        return;
      }
    } catch (e) {}

    // Offline / direct match fallback
    if (code === workGeneratedOtp) {
      setWorkEmailVerified(true);
      setWorkStep('form');
      addNotification('Partner Credentials Verified', `Cooperative email verified for ${workForm.email}`, 'success');
    } else {
      alert('Incorrect passcode. Please check your email and try again.');
    }
  };

  // Handler for Quick Demo Selection
  const handleQuickDemoRole = (role) => {
    setCurrentRole(role);
    try {
      localStorage.setItem('sahakar_user_role', role);
    } catch (e) {}

    if (role === 'customer') {
      updateCustomerProfile({
        name: 'Priya Sharma',
        email: 'priya.sharma@sahakar.org',
        phone: '+91 98221 55601',
        id: 'CIT-MH-501',
        address: 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune'
      });
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
    if (!custEmailVerified) {
      handleSendCustEmailOtp();
      return;
    }

    const finalName = custForm.name.trim() || customer?.name || 'Priya Sharma';
    const finalEmail = custForm.email.trim() || customer?.email || 'citizen@sahakar.org';
    const finalPhone = custForm.phone.trim() || customer?.phone || '+91 98221 55601';
    const finalAddress = custForm.address.trim() || customer?.address || 'Shivajinagar, Pune';
    const finalId = customCitizenId || customer?.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000));

    saveRegisteredAccount({
      role: 'customer',
      id: finalId,
      name: finalName,
      email: finalEmail,
      password: custRegPassword || 'sahakar123',
      phone: finalPhone,
      address: finalAddress
    });

    updateCustomerProfile({
      id: finalId,
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      address: finalAddress
    });

    setCurrentRole('customer');
    try {
      localStorage.setItem('sahakar_user_role', 'customer');
      localStorage.setItem('sahakar_active_session', JSON.stringify({ email: finalEmail, role: 'customer', name: finalName }));
    } catch (e) {}

    addNotification('Citizen Registered & Password Set', `Account saved! You can now log in instantly using your password.`, 'success');
    setMode('select');
    onClose();
  };

  // Submit Worker ID Creation / Registration
  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    if (!workEmailVerified) {
      handleSendWorkEmailOtp();
      return;
    }

    const finalName = workForm.name.trim() || 'New Sahakari Partner';
    const finalEmail = workForm.email.trim() || (workForm.name ? `${workForm.name.toLowerCase().replace(/\s+/g, '.')}@coop.org` : 'partner@coop.org');
    const finalPhone = workForm.phone.trim() || '+91 98230 44819';
    const finalMemberId = customWorkerMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000));

    saveRegisteredAccount({
      role: 'worker',
      email: finalEmail,
      password: workRegPassword || 'sahakar123',
      name: finalName,
      phone: finalPhone,
      skill: workForm.skill,
      societyName: workForm.societyName || 'Pune Urban Multi-Trade Cooperative',
      cooperativeMemberId: finalMemberId,
      address: workForm.address || 'Pune Urban Sector'
    });

    await registerWorker({
      name: finalName,
      email: finalEmail,
      phone: finalPhone,
      skills: [workForm.skill],
      societyName: workForm.societyName || 'Pune Urban Multi-Trade Cooperative',
      cooperativeMemberId: finalMemberId,
      bankAccountMasked: workForm.bankAccountMasked || '•••• 7712 (UPI Verified)',
      location: activeWorker?.location || { lat: 18.5298, lng: 73.8472 },
      address: workForm.address || 'Pune Urban Sector'
    });

    setCurrentRole('worker');
    try {
      localStorage.setItem('sahakar_user_role', 'worker');
      localStorage.setItem('sahakar_active_session', JSON.stringify({ email: finalEmail, role: 'worker', name: finalName }));
    } catch (e) {}

    addNotification('Partner Registered & Password Set', `Account saved! You can now log in instantly using your password.`, 'success');
    setMode('select');
    onClose();
  };

  // GPS Helpers
  const handleCustomerGps = async () => {
    try {
      const geo = await detectUserLocation();
      if (geo?.address) {
        setCustForm(prev => ({ ...prev, address: geo.address }));
      }
    } catch (e) {}
  };

  const handleWorkerGps = async () => {
    try {
      const geo = await detectWorkerLocation();
      if (geo?.address) {
        setWorkForm(prev => ({ ...prev, address: geo.address }));
      }
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#111C26] text-white p-6 sm:p-7 text-center relative shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AUTHENTIC EMAIL PASSCODE AUTHENTICATION</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {mode !== 'select' && (
              <button
                onClick={() => {
                  if (mode === 'customer' && custStep === 'otp') {
                    setCustStep('form');
                  } else if (mode === 'worker' && workStep === 'otp') {
                    setWorkStep('form');
                  } else {
                    setMode('select');
                  }
                }}
                className="absolute left-6 top-7 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight text-white">
              {mode === 'customer' ? (
                <span>Citizen Portal <span className="text-emerald-400 italic">Login & Access</span></span>
              ) : mode === 'worker' ? (
                <span>Artisan Partner <span className="text-amber-400 italic">Login & Portal</span></span>
              ) : (
                <span>Welcome to Sahakar<span className="text-emerald-400 italic">Gig</span></span>
              )}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1.5 leading-relaxed font-sans">
            {mode === 'customer'
              ? 'Instant password login or authentic email OTP registration for verified citizens.'
              : mode === 'worker'
              ? 'Instant partner password login or cooperative onboarding for 88% direct payouts.'
              : 'Please choose your portal or register your teammate. Data is strictly isolated.'}
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
                      Book certified electricians, plumbers & AC techs. Strict receipts for services you actually took.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                      <div className="font-bold text-slate-800 flex items-center justify-between">
                        <span>Current Citizen ID:</span>
                        <span className="font-mono text-emerald-700 font-bold">{customer?.id || 'CIT-MH-501'}</span>
                      </div>
                      <div className="truncate text-[10px] text-slate-500 mt-0.5">
                        {customer?.name} · {customer?.email || 'priya.sharma@sahakar.org'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setMode('customer')}
                      className="w-full py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Email Login / Register Teammate</span>
                    </button>
                    <button 
                      onClick={() => handleQuickDemoRole('customer')}
                      className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1B4D3E] text-xs font-bold border border-emerald-200 transition text-center"
                    >
                      ⚡ Fast Demo: Enter as Priya Sharma
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
                      Receive live radar dispatches near your GPS. 88% direct pay, health fund & your own job ledger.
                    </p>

                    <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                      <div className="font-bold text-slate-800 flex items-center justify-between">
                        <span>Current Member ID:</span>
                        <span className="font-mono text-amber-700 font-bold">{activeWorker?.cooperativeMemberId || 'COOP-MH-4819'}</span>
                      </div>
                      <div className="truncate text-[10px] text-slate-500 mt-0.5">
                        {activeWorker?.name} · {activeWorker?.email || 'ramesh.jadhav@coop.org'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setMode('worker')}
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Email Login / Register Teammate</span>
                    </button>
                    <button 
                      onClick={() => handleQuickDemoRole('worker')}
                      className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition text-center"
                    >
                      ⚡ Fast Demo: Enter as Ramesh Jadhav
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CUSTOMER / CITIZEN AUTHENTICATION & LOGIN         */}
          {/* ========================================================= */}
          {mode === 'customer' && (
            <div className="space-y-4">
              {/* Tab Selector: Instant Password Login vs Register / Set Password */}
              <div className="max-w-md mx-auto">
                <div className="flex p-1 bg-slate-200/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setCustAuthTab('login');
                      setCustStep('form');
                      setCustLoginError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      custAuthTab === 'login'
                        ? 'bg-white text-[#1B4D3E] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>⚡ Instant Password Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustAuthTab('register');
                      setCustLoginError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      custAuthTab === 'register'
                        ? 'bg-white text-[#1B4D3E] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>📧 Register & Set Password (OTP)</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: INSTANT PASSWORD LOGIN */}
              {custAuthTab === 'login' && (
                <form onSubmit={handleCustPasswordLogin} className="space-y-4 max-w-md mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center text-lg font-bold">
                        🔐
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 font-['Outfit']">Instant Password Login</h4>
                        <span className="text-[10px] text-slate-500 font-mono">No OTP wait · Permanent device login</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ⚡ FAST LOGIN
                    </span>
                  </div>

                  {custLoginError && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {custLoginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Citizen Registered Email / ईमेल पता *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={custLoginEmail}
                        onChange={(e) => setCustLoginEmail(e.target.value)}
                        placeholder="e.g. priya.sharma@sahakar.org or your email"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Password / पासवर्ड *
                    </label>
                    <div className="relative">
                      <input
                        type={showCustLoginPassword ? 'text' : 'password'}
                        required
                        value={custLoginPassword}
                        onChange={(e) => setCustLoginPassword(e.target.value)}
                        placeholder="Enter password (Demo pass: sahakar123)"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowCustLoginPassword(!showCustLoginPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showCustLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showCustLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Universal demo pass: <strong className="text-emerald-700 font-mono">sahakar123</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setCustLoginEmail('priya.sharma@sahakar.org');
                          setCustLoginPassword('sahakar123');
                        }}
                        className="text-emerald-700 hover:underline font-bold"
                      >
                        Auto-fill Demo
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>⚡ Log In with Password (पासवर्ड से तुरंत लॉगिन)</span>
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setCustAuthTab('register')}
                        className="text-xs text-emerald-800 font-bold hover:underline"
                      >
                        Need an account or password? Register & verify with OTP →
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER & SET PASSWORD VIA EMAIL OTP */}
              {custAuthTab === 'register' && (
                <div>
                  {/* Step A: OTP Passcode Screen */}
                  {custStep === 'otp' && (
                    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center text-3xl shadow-sm ring-8 ring-emerald-50">
                        <ShieldCheck className="w-9 h-9 text-[#1B4D3E]" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-mono">
                          Two-Factor Security Passcode
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] pt-2">
                          Check your Email
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                          We have sent an official 6-digit verification code to:
                          <br />
                          <span className="font-bold text-slate-900 font-mono text-sm">{custForm.email}</span>
                        </p>
                      </div>

                      {/* Status Notice */}
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-950 flex items-center justify-between">
                        <span>
                          {custRealEmailSent 
                            ? '✉️ Security email sent to your inbox!' 
                            : `Passcode: ${custGeneratedOtp}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustStep('form')}
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          Edit Email
                        </button>
                      </div>

                      {/* 6-Digit Code Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block text-left">
                          Enter 6-Digit Passcode (6 अंकों का कोड दर्ज करें)
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          autoFocus
                          placeholder="• • • • • •"
                          value={custInputOtp}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setCustInputOtp(val);
                            if (val.length === 6) {
                              handleVerifyCustOtp(val);
                            }
                          }}
                          className="w-full text-center text-3xl font-mono font-black tracking-[12px] py-3.5 rounded-2xl border-2 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 bg-emerald-50/30 text-[#1B4D3E]"
                        />
                        <p className="text-[11px] text-slate-400">
                          Passcode expires in 10 minutes. Check your Spam folder if not in primary inbox.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleVerifyCustOtp(custInputOtp)}
                          className="w-full py-3.5 rounded-2xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify Passcode & Continue</span>
                        </button>

                        <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                          <span>Didn't receive code?</span>
                          {custTimer > 0 ? (
                            <span className="font-mono font-bold text-slate-600">
                              Resend in 00:{custTimer < 10 ? `0${custTimer}` : custTimer}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendCustEmailOtp}
                              disabled={custEmailSending}
                              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend Passcode</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step B: Form Screen with Password Input */}
                  {custStep === 'form' && (
                    <form onSubmit={handleCustomerSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center text-lg font-bold">
                            🏠
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Register Citizen & Set Password</h4>
                            <span className="text-[10px] text-slate-500 font-mono">Verify once via OTP · Login with password anytime</span>
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
                          Full Name / आपका नाम (या Teammate का नाम) *
                        </label>
                        <input
                          type="text"
                          required
                          value={custForm.name}
                          onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                          placeholder="e.g. Yash Pandey or Teammate Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      {/* Email Authentication Row */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Email Address (ऑथेंटिकेशन ईमेल) *</span>
                          </label>
                          {custEmailVerified && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Email
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={custForm.email}
                            onChange={(e) => {
                              setCustForm({ ...custForm, email: e.target.value });
                              setCustEmailVerified(false);
                            }}
                            placeholder="teammate@example.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          {!custEmailVerified ? (
                            <button
                              type="button"
                              onClick={handleSendCustEmailOtp}
                              disabled={custEmailSending}
                              className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143c30] text-white text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shadow-sm"
                            >
                              {custEmailSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              <span>Send OTP</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendCustEmailOtp}
                              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Set Account Password for Future Logins */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Create Account Password (पासवर्ड बनाएं - अगली बार डायरेक्ट लॉगिन के लिए) *</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type={showCustRegPassword ? 'text' : 'password'}
                            value={custRegPassword}
                            onChange={(e) => setCustRegPassword(e.target.value)}
                            placeholder="e.g. sahakar123 or choose your secret password"
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                          />
                          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowCustRegPassword(!showCustRegPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            title={showCustRegPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCustRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          💡 Once registered, you will NEVER have to wait for an OTP again! Just enter this password to log in.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Mobile Number / फोन नंबर *
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
                          <span>
                            {custEmailVerified ? 'Save Password & Enter Citizen App' : 'Verify Email & Save Password'}
                          </span>
                        </button>

                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => setCustAuthTab('login')}
                            className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline"
                          >
                            Already set your password? Switch to Instant Password Login →
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: WORKER PARTNER AUTHENTICATION & LOGIN              */}
          {/* ========================================================= */}
          {mode === 'worker' && (
            <div className="space-y-4">
              {/* Tab Selector: Instant Password Login vs Register Partner */}
              <div className="max-w-md mx-auto">
                <div className="flex p-1 bg-slate-200/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setWorkAuthTab('login');
                      setWorkStep('form');
                      setWorkLoginError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      workAuthTab === 'login'
                        ? 'bg-white text-amber-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>⚡ Instant Partner Login</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkAuthTab('register');
                      setWorkLoginError('');
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      workAuthTab === 'register'
                        ? 'bg-white text-amber-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>🧰 Register Partner & Set Password (OTP)</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: INSTANT WORKER PASSWORD LOGIN */}
              {workAuthTab === 'login' && (
                <form onSubmit={handleWorkPasswordLogin} className="space-y-4 max-w-md mx-auto bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold">
                        🧰
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 font-['Outfit']">Instant Partner HUD Login</h4>
                        <span className="text-[10px] text-slate-500 font-mono">Direct shift start · 88% payout ledger</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      ⚡ FAST LOGIN
                    </span>
                  </div>

                  {workLoginError && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {workLoginError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Partner Cooperative Email / ईमेल पता *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={workLoginEmail}
                        onChange={(e) => setWorkLoginEmail(e.target.value)}
                        placeholder="e.g. ramesh.jadhav@coop.org or your partner email"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Password / पासवर्ड *
                    </label>
                    <div className="relative">
                      <input
                        type={showWorkLoginPassword ? 'text' : 'password'}
                        required
                        value={workLoginPassword}
                        onChange={(e) => setWorkLoginPassword(e.target.value)}
                        placeholder="Enter partner password (Demo pass: sahakar123)"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowWorkLoginPassword(!showWorkLoginPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        title={showWorkLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showWorkLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Universal demo pass: <strong className="text-amber-800 font-mono">sahakar123</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          setWorkLoginEmail('ramesh.jadhav@coop.org');
                          setWorkLoginPassword('sahakar123');
                        }}
                        className="text-amber-800 hover:underline font-bold"
                      >
                        Auto-fill Demo
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>⚡ Log In to Partner HUD (पार्टनर लॉगिन)</span>
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setWorkAuthTab('register')}
                        className="text-xs text-amber-900 font-bold hover:underline"
                      >
                        New partner? Register & set cooperative password with OTP →
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER PARTNER & SET PASSWORD VIA EMAIL OTP */}
              {workAuthTab === 'register' && (
                <div>
                  {/* Step A: Partner OTP Screen */}
                  {workStep === 'otp' && (
                    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl shadow-sm ring-8 ring-amber-50">
                        <ShieldCheck className="w-9 h-9 text-amber-800" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-mono">
                          Partner Security Passcode
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 font-['Outfit'] pt-2">
                          Check Partner Email
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                          We have sent an official 6-digit cooperative passcode to:
                          <br />
                          <span className="font-bold text-slate-900 font-mono text-sm">{workForm.email}</span>
                        </p>
                      </div>

                      {/* Status Notice */}
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-950 flex items-center justify-between">
                        <span>
                          {workRealEmailSent 
                            ? '✉️ Security email sent to partner inbox!' 
                            : `Passcode: ${workGeneratedOtp}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setWorkStep('form')}
                          className="text-amber-800 font-bold hover:underline"
                        >
                          Edit Email
                        </button>
                      </div>

                      {/* 6-Digit Code Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block text-left">
                          Enter 6-Digit Passcode (6 अंकों का कोड दर्ज करें)
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          autoFocus
                          placeholder="• • • • • •"
                          value={workInputOtp}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setWorkInputOtp(val);
                            if (val.length === 6) {
                              handleVerifyWorkOtp(val);
                            }
                          }}
                          className="w-full text-center text-3xl font-mono font-black tracking-[12px] py-3.5 rounded-2xl border-2 border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 bg-amber-50/30 text-amber-950"
                        />
                        <p className="text-[11px] text-slate-400">
                          Passcode expires in 10 minutes. Check Spam if not in primary inbox.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleVerifyWorkOtp(workInputOtp)}
                          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify Passcode & Continue</span>
                        </button>

                        <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                          <span>Didn't receive code?</span>
                          {workTimer > 0 ? (
                            <span className="font-mono font-bold text-slate-600">
                              Resend in 00:{workTimer < 10 ? `0${workTimer}` : workTimer}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendWorkEmailOtp}
                              disabled={workEmailSending}
                              className="font-bold text-amber-800 hover:underline flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend Passcode</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step B: Partner Form with Password Input */}
                  {workStep === 'form' && (
                    <form onSubmit={handleWorkerSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold">
                            🧰
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Partner Profile & Password</h4>
                            <span className="text-[10px] text-slate-500 font-mono">Verify once via OTP · Direct shift access anytime</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                            {customWorkerMemberId}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCustomWorkerMemberId('COOP-MH-' + Math.floor(1000 + Math.random() * 9000))}
                            className="p-1 text-slate-400 hover:text-amber-700 transition"
                            title="Generate New Member ID"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name / आपका नाम (या Teammate का नाम) *
                        </label>
                        <input
                          type="text"
                          required
                          value={workForm.name}
                          onChange={(e) => setWorkForm({ ...workForm, name: e.target.value })}
                          placeholder="e.g. Ramesh Jadhav or Partner Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Email Authentication Row */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-amber-700" />
                            <span>Partner Email Address (ईमेल पता) *</span>
                          </label>
                          {workEmailVerified && (
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Email
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={workForm.email}
                            onChange={(e) => {
                              setWorkForm({ ...workForm, email: e.target.value });
                              setWorkEmailVerified(false);
                            }}
                            placeholder="teammate.partner@coop.org"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          {!workEmailVerified ? (
                            <button
                              type="button"
                              onClick={handleSendWorkEmailOtp}
                              disabled={workEmailSending}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black whitespace-nowrap transition flex items-center gap-1.5 shadow-sm"
                            >
                              {workEmailSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              <span>Send OTP</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendWorkEmailOtp}
                              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Set Partner Account Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Create Partner Password (पासवर्ड बनाएं - अगली बार डायरेक्ट लॉगिन के लिए) *</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type={showWorkRegPassword ? 'text' : 'password'}
                            value={workRegPassword}
                            onChange={(e) => setWorkRegPassword(e.target.value)}
                            placeholder="e.g. sahakar123 or choose your secret password"
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                          />
                          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <button
                            type="button"
                            onClick={() => setShowWorkRegPassword(!showWorkRegPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            title={showWorkRegPassword ? 'Hide password' : 'Show password'}
                          >
                            {showWorkRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          💡 Once registered, you will NEVER have to wait for an OTP again! Just enter this password to log in.
                        </p>
                      </div>

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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            <option value="deep-cleaning">✨ Deep House Cleaning</option>
                            <option value="carpentry">🪚 Carpentry & Furniture</option>
                            <option value="painting">🎨 Painting & Wall Decor</option>
                          </select>
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
                          <span>
                            {workEmailVerified ? 'Register Partner & Save Password' : 'Verify Email & Save Password'}
                          </span>
                        </button>

                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => setWorkAuthTab('login')}
                            className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline"
                          >
                            Already set your password? Switch to Instant Partner Login →
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
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
            <span>💡 All registered teammates, emails, and IDs persist permanently in browser local storage.</span>
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
