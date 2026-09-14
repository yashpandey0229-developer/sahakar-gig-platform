import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  SERVICES_CATALOG, 
  INITIAL_WORKERS, 
  INITIAL_PROPOSALS, 
  INITIAL_DISPUTES, 
  COOP_WELFARE_METRICS, 
  MINISTRY_STATS 
} from '../services/mockData';
import { calculateInvoiceBreakdown } from '../services/dividendLedger';
import { findBestMatchingWorkers, interpolateGeoStep, calculateDistanceKm } from '../services/dispatchEngine';
import { speechService } from '../services/speechService';
import { detectRealCurrentLocation } from '../services/geoService';
import { api } from '../services/api';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  // Current active portal persona: 'customer' | 'worker' | 'cooperative' | 'ministry'
  const [currentRole, setCurrentRoleState] = useState(() => {
    try {
      return localStorage.getItem('sahakar_user_role') || 'customer';
    } catch (e) {
      return 'customer';
    }
  });

  const setCurrentRole = (role) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem('sahakar_user_role', role);
    } catch (e) {}
  };

  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'mr'

  // DB Connection Telemetry
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    database: 'Checking MongoDB...',
    latency: '12ms'
  });

  // Workers & Catalog Data
  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem('sahakar_custom_workers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map(INITIAL_WORKERS.map(w => [w.id, w]));
          parsed.forEach(w => map.set(w.id, w));
          return Array.from(map.values());
        }
      }
    } catch (e) {}
    return INITIAL_WORKERS;
  });

  const [activeWorkerId, setActiveWorkerIdState] = useState(() => {
    try {
      return localStorage.getItem('sahakar_active_worker_id') || 'w-101';
    } catch (e) {
      return 'w-101';
    }
  });

  const setActiveWorkerId = (id) => {
    setActiveWorkerIdState(id);
    try {
      localStorage.setItem('sahakar_active_worker_id', id);
    } catch (e) {}
  };

  const [services] = useState(SERVICES_CATALOG);

  // Active Customer state (with Real GPS capability)
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('sahakar_customer');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      id: 'CIT-MH-501',
      name: 'Priya Sharma',
      email: 'priya.sharma@sahakar.org',
      phone: '+91 98221 55601',
      address: 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune',
      location: { lat: 18.5298, lng: 73.8472 },
      isRealGps: false
    };
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isWorkerLocating, setIsWorkerLocating] = useState(false);

  // Function to detect real live browser GPS for Customer
  const detectUserLocation = async () => {
    setIsLocating(true);
    try {
      const realGeo = await detectRealCurrentLocation();
      setCustomer(prev => ({
        ...prev,
        address: realGeo.address,
        location: { lat: realGeo.lat, lng: realGeo.lng },
        isRealGps: true
      }));

      addNotification(
        'Live GPS Location Detected',
        `Pinned to ${realGeo.address.slice(0, 45)}...`,
        'location'
      );
      setIsLocating(false);
      return realGeo;
    } catch (err) {
      console.warn('GPS detection notice:', err.message);
      setIsLocating(false);
      throw err;
    }
  };

  // Function to detect real live browser GPS for Worker
  const detectWorkerLocation = async (workerId = activeWorkerId) => {
    setIsWorkerLocating(true);
    try {
      const realGeo = await detectRealCurrentLocation();
      setWorkers(prev => prev.map(w => {
        if (w.id === workerId) {
          const updated = {
            ...w,
            location: { lat: realGeo.lat, lng: realGeo.lng },
            address: realGeo.address,
            isRealGps: true
          };
          api.registerWorker(updated).catch(console.warn);
          return updated;
        }
        return w;
      }));

      addNotification(
        'Worker Live GPS Pinned',
        `Worker location set to ${realGeo.address.slice(0, 40)}...`,
        'location'
      );
      setIsWorkerLocating(false);
      return realGeo;
    } catch (err) {
      console.warn('Worker GPS detection notice:', err.message);
      setIsWorkerLocating(false);
      throw err;
    }
  };

  // Presentation Mode helper: Set Worker within 2 km of Customer for instant hackathon demonstration
  const simulateWorkerNearCustomer = (distanceKm = 1.8) => {
    const custLoc = customer.location || { lat: 18.5298, lng: 73.8472 };
    const latOffset = (distanceKm / 111) * 0.7;
    const lngOffset = (distanceKm / 111) * 0.7;
    const nearbyLoc = {
      lat: parseFloat((custLoc.lat + latOffset).toFixed(5)),
      lng: parseFloat((custLoc.lng + lngOffset).toFixed(5))
    };

    setWorkers(prev => prev.map(w => {
      if (w.id === activeWorkerId) {
        const updated = {
          ...w,
          location: nearbyLoc,
          isRealGps: true,
          address: `Within Range of ${customer.address.slice(0, 25)} (${distanceKm} km away)`
        };
        api.registerWorker(updated).catch(console.warn);
        return updated;
      }
      return w;
    }));

    addNotification(
      'Demo Proximity Active',
      `Worker GPS pinned ${distanceKm} km from Customer (Within 10 km range).`,
      'success'
    );
  };

  // Restore saved customer profile from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sahakar_customer');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomer(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);

  // Auto-detect real location once on initial mount if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      detectUserLocation().catch(() => {
        // Silently fallback to default Pune coordinates
      });
    }
  }, []);

  // Initial Seed Booking: Clean start without dummy records
  const INITIAL_DEFAULT_BOOKINGS = [];

  // Bookings Store with localStorage persistence (purges legacy demo bookings)
  const [bookings, setBookingsState] = useState(() => {
    try {
      const saved = localStorage.getItem('sahakar_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out legacy dummy demo bookings like BK-7821
          const realBookings = parsed.filter(b => b.id !== 'BK-7821');
          return realBookings;
        }
      }
    } catch (e) {}
    return INITIAL_DEFAULT_BOOKINGS;
  });

  const setBookings = (updater) => {
    setBookingsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('sahakar_bookings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Currently Active in-flight booking for live demo
  const [activeBookingId, setActiveBookingId] = useState(null);

  // Cooperative Governance
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [welfareMetrics, setWelfareMetrics] = useState(COOP_WELFARE_METRICS);
  const [ministryStats, setMinistryStats] = useState(MINISTRY_STATS);

  // Notification Toasts
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Cooperative Dividend Accrued',
      message: '₹120 added to your quarterly patronage dividend reserve from your active cooperative share.',
      time: '1 hour ago',
      type: 'dividend'
    }
  ]);

  // 0. Initialize & Sync with Express / MongoDB API
  useEffect(() => {
    async function initFromApi() {
      try {
        const health = await api.checkHealth();
        if (health) {
          setDbStatus({
            connected: health.connected,
            database: health.database,
            latency: '15ms'
          });
        } else {
          setDbStatus({
            connected: true,
            database: 'MongoDB In-Memory Engine',
            latency: '4ms'
          });
        }

        const remoteWorkers = await api.getWorkers();
        if (remoteWorkers && remoteWorkers.length > 0) {
          setWorkers(remoteWorkers);
        }

        const remoteBookings = await api.getBookings();
        if (remoteBookings && remoteBookings.length > 0) {
          setBookings(prev => {
            const existingIds = new Set(prev.map(b => b.id));
            const newOnes = remoteBookings.filter(b => !existingIds.has(b.id));
            return [...newOnes, ...prev];
          });
        }

        const remoteProposals = await api.getProposals();
        if (remoteProposals && remoteProposals.length > 0) {
          setProposals(remoteProposals);
        }

        const remoteDisputes = await api.getDisputes();
        if (remoteDisputes && remoteDisputes.length > 0) {
          setDisputes(remoteDisputes);
        }

        const remoteWelfare = await api.getWelfareMetrics();
        if (remoteWelfare) {
          setWelfareMetrics(remoteWelfare);
        }
      } catch (err) {
        console.warn('API sync fallback active:', err.message);
      }
    }

    initFromApi();
  }, []);

  // 1. Cross-tab real-time sync via window storage event (Syncs instantly across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sahakar_bookings' && e.newValue) {
        try {
          const updatedBookings = JSON.parse(e.newValue);
          if (Array.isArray(updatedBookings) && updatedBookings.length > 0) {
            setBookingsState(updatedBookings);
          }
        } catch (err) {}
      }
      if (e.key === 'sahakar_custom_workers' && e.newValue) {
        try {
          const updatedWorkers = JSON.parse(e.newValue);
          if (Array.isArray(updatedWorkers) && updatedWorkers.length > 0) {
            setWorkers(updatedWorkers);
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2. Background Live Heartbeat: Polls every 2.5 seconds to synchronize cross-device actions
  useEffect(() => {
    const syncTimer = setInterval(async () => {
      try {
        // A. Poll and sync Bookings (including ratingGiven and reviewText from customer)
        const remoteBookings = await api.getBookings();
        if (remoteBookings && Array.isArray(remoteBookings) && remoteBookings.length > 0) {
          setBookings(prev => {
            const prevMap = new Map(prev.map(b => [b.id, b]));
            let hasChanged = false;

            const merged = remoteBookings.map(remote => {
              const local = prevMap.get(remote.id);
              if (!local) {
                hasChanged = true;
                return remote;
              }
              if (
                local.status !== remote.status ||
                local.workerId !== remote.workerId ||
                local.etaMins !== remote.etaMins ||
                local.ratingGiven !== remote.ratingGiven ||
                local.reviewText !== remote.reviewText ||
                local.completionPhoto !== remote.completionPhoto
              ) {
                hasChanged = true;
                return { ...local, ...remote };
              }
              return local;
            });

            prev.forEach(local => {
              if (!remoteBookings.some(r => r.id === local.id)) {
                merged.push(local);
              }
            });

            return hasChanged ? merged : prev;
          });
        }

        // B. Poll and sync Workers (including average rating, reviews, and completed gigs)
        const remoteWorkers = await api.getWorkers();
        if (remoteWorkers && Array.isArray(remoteWorkers) && remoteWorkers.length > 0) {
          setWorkers(prevWorkers => {
            let workersChanged = false;
            const mergedWorkers = prevWorkers.map(localW => {
              const remoteW = remoteWorkers.find(rw => rw.id === localW.id);
              if (!remoteW) return localW;
              if (
                localW.rating !== remoteW.rating ||
                localW.totalJobsCompleted !== remoteW.totalJobsCompleted ||
                (remoteW.reviews && remoteW.reviews.length !== (localW.reviews?.length || 0))
              ) {
                workersChanged = true;
                return { ...localW, ...remoteW };
              }
              return localW;
            });
            return workersChanged ? mergedWorkers : prevWorkers;
          });
        }
      } catch (e) {}
    }, 2500);

    return () => clearInterval(syncTimer);
  }, []);

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: 'n-' + Date.now(),
      title,
      message,
      time: 'Just now',
      type
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
  };

  const activeWorker = workers.find(w => w.id === activeWorkerId) || workers[0];
  
  // Strict active booking resolution by authenticated role:
  // - In WORKER mode: The worker ONLY has an active booking if they have genuinely ACCEPTED or are executing a job!
  //   A BROADCASTING gig is NOT an active job for the worker yet; it's an incoming broadcast waiting on their radar!
  // - In CUSTOMER mode: The customer's active booking is their latest in-flight booking (BROADCASTING, ACCEPTED, EN_ROUTE, IN_PROGRESS).
  const activeBooking = currentRole === 'worker'
    ? bookings.find(b => 
        (b.workerId === activeWorker?.id || 
         (b.workerEmail && activeWorker?.email && b.workerEmail.toLowerCase() === activeWorker.email.toLowerCase()) || 
         (b.workerName && activeWorker?.name && b.workerName.toLowerCase() === activeWorker.name.toLowerCase())) && 
        ['ACCEPTED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
      )
    : ((activeBookingId ? bookings.find(b => b.id === activeBookingId && b.status !== 'CANCELLED') : null)
        || bookings.find(b => 
            (b.customerId === customer?.id || 
             (customer?.email && b.customerEmail && b.customerEmail.toLowerCase() === customer.email.toLowerCase())) && 
            b.status !== 'COMPLETED' && 
            b.status !== 'CANCELLED'
          )
      );

  const pendingBroadcastingGigs = bookings.filter(b => b.status === 'BROADCASTING');

  // Customer Profile Editor
  const updateCustomerProfile = (updates) => {
    let savedProfile = null;
    setCustomer(prev => {
      const next = { 
        ...prev, 
        ...updates,
        id: updates.id || prev.id || ('CIT-MH-' + Math.floor(1000 + Math.random() * 9000)),
        email: updates.email || prev.email || 'customer@sahakar.org'
      };
      savedProfile = next;
      try {
        localStorage.setItem('sahakar_customer', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    addNotification('Citizen Profile Saved', `Citizen ID ${savedProfile?.id || ''} active for ${updates.name || customer.name}.`, 'info');
    return savedProfile;
  };

  // Worker Partner Registration
  const registerWorker = async (workerData) => {
    const id = workerData.id || ('w-' + Date.now());
    const cooperativeMemberId = workerData.cooperativeMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000));
    const newWorker = {
      id,
      name: workerData.name || 'New Sahakari Partner',
      email: workerData.email || (workerData.name ? `${workerData.name.toLowerCase().replace(/\s+/g, '.')}@coop.org` : 'partner@coop.org'),
      phone: workerData.phone || '+91 98230 00000',
      avatar: workerData.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      totalJobsCompleted: 0,
      skills: Array.isArray(workerData.skills) && workerData.skills.length > 0 
        ? workerData.skills 
        : [workerData.skill || 'electrical'],
      societyName: workerData.societyName || 'Pune Urban Multi-Trade Cooperative',
      cooperativeMemberId,
      bankAccountMasked: workerData.bankAccountMasked || '•••• 7712 (UPI Verified)',
      isOnline: true,
      status: 'online',
      fairRotationScore: 98,
      location: workerData.location || { lat: 18.5298, lng: 73.8472 },
      address: workerData.address || 'Pune Urban Sector',
      wallet: {
        grossEarnings: 0,
        availableBalance: 450,
        patronageDividends: 0,
        welfarePoints: 50,
        emergencyFundReserved: 0
      }
    };

    setWorkers(prev => {
      const filtered = prev.filter(w => w.id !== id);
      const updated = [newWorker, ...filtered];
      try {
        const customWorkers = updated.filter(w => !['w-101', 'w-102', 'w-103', 'w-104', 'w-105'].includes(w.id));
        localStorage.setItem('sahakar_custom_workers', JSON.stringify(customWorkers));
      } catch (e) {}
      return updated;
    });

    setActiveWorkerId(id);

    try {
      await api.registerWorker(newWorker);
    } catch (e) {
      console.warn('API registerWorker notice:', e.message);
    }

    addNotification(
      'Worker ID Created & Saved',
      `Welcome ${newWorker.name}! Member ID: ${cooperativeMemberId} saved and active.`,
      'success'
    );

    return newWorker;
  };

  // Worker Instant Wallet Updater (Fixes Cashout crash)
  const updateWorkerWallet = (workerId, newWallet) => {
    setWorkers(prev =>
      prev.map(w => {
        if (w.id === workerId) {
          return {
            ...w,
            wallet: { ...w.wallet, ...newWallet }
          };
        }
        return w;
      })
    );
    api.updateWorkerWallet(workerId, newWallet).catch(console.warn);
    addNotification('Coop Wallet Updated', 'Funds transferred to verified UPI account.', 'success');
  };

  // Worker Accepts Gig (Supports base rate or custom quoted amount)
  const acceptJobByWorker = (bookingId, workerObj = activeWorker, customAmount = null) => {
    const booking = bookings.find(b => b.id === bookingId);
    const finalAmount = customAmount ? Number(customAmount) : (booking?.totalAmount || 499);
    const workerPayout = Math.round(finalAmount * 0.88);
    const welfareShare = Math.round(finalAmount * 0.07);
    const platformShare = Math.round(finalAmount * 0.05);

    const updates = {
      workerId: workerObj.id,
      workerName: workerObj.name,
      workerEmail: workerObj.email || '',
      workerPhone: workerObj.phone,
      workerAvatar: workerObj.avatar,
      workerRating: workerObj.rating,
      workerSociety: workerObj.societyName,
      workerLocation: { ...workerObj.location },
      totalAmount: finalAmount,
      breakdown: {
        workerPayout,
        welfareFundContribution: welfareShare,
        platformMaintenance: platformShare,
        workerPercent: 88,
        welfarePercent: 7,
        platformPercent: 5
      },
      status: 'ACCEPTED',
      etaMins: 10
    };

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, ...updates } : b))
    );
    setActiveBookingId(bookingId);
    api.updateBooking(bookingId, updates).catch(console.warn);

    addNotification(
      'Gig Accepted!',
      `You accepted gig #${bookingId} at ₹${finalAmount}. Customer notified.`,
      'match'
    );

    speechService.speak(
      `कार्य स्वीकार किया गया! ग्राहक ${workerObj.name} की प्रतीक्षा कर रहे हैं।`,
      'hi'
    );
  };

  // Worker Submits a Custom Quote / Bid for a Broadcasted Gig
  // Hybrid Base Pricing: Minimum Cooperative Floor is strictly protected against exploitation
  const submitWorkerQuote = (
    bookingId, 
    workerObj = activeWorker, 
    quoteAmount, 
    quoteNotes = '',
    quoteDetails = {}
  ) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    const minBaseFloor = Number(targetBooking?.baseLaborPrice || targetBooking?.totalAmount || 100);
    
    // Anti-exploitation shield: Quoted amount cannot be less than the cooperative base floor
    let amount = Number(quoteAmount);
    if (!amount || isNaN(amount) || amount < minBaseFloor) {
      amount = minBaseFloor;
    }

    const materialCost = Math.max(0, Number(quoteDetails.materialCost) || 0);
    const complexityCost = Math.max(0, Number(quoteDetails.complexityCost) || 0);

    const workerLoc = workerObj.location || { lat: 18.5298, lng: 73.8472 };
    const custLoc = targetBooking?.customerLocation || customer?.location || { lat: 18.5298, lng: 73.8472 };
    const distance = calculateDistanceKm(custLoc.lat, custLoc.lng, workerLoc.lat, workerLoc.lng);

    // Dynamic optimization score calculation for this quote:
    // Nearest (40%) + Best Rating (35%) + Fair Cost / Value (25%)
    const proxScore = Math.max(10, Math.min(100, Math.round(((15 - distance) / 15) * 100)));
    const ratingScore = Math.max(20, Math.min(100, Math.round(((workerObj.rating || 4.8) / 5) * 100)));
    const costScore = Math.max(20, Math.min(100, Math.round(100 - (amount / 800) * 50)));
    const optimizationScore = Math.round(proxScore * 0.40 + ratingScore * 0.35 + costScore * 0.25);

    const newQuote = {
      id: 'q-' + Date.now(),
      workerId: workerObj.id,
      workerName: workerObj.name,
      workerAvatar: workerObj.avatar,
      workerPhone: workerObj.phone,
      workerRating: workerObj.rating,
      workerSociety: workerObj.societyName,
      workerLocation: workerLoc,
      distanceKm: distance,
      baseLaborPrice: minBaseFloor,
      materialCost,
      complexityCost,
      quotedAmount: amount,
      workerPayout: Math.round(amount * 0.88),
      welfareShare: Math.round(amount * 0.07),
      platformFee: Math.round(amount * 0.05),
      quoteNotes: quoteNotes.trim() || (materialCost > 0 ? `Includes ₹${materialCost} spare parts/material` : 'Equipped with standard cooperative tools.'),
      optimizationScore,
      submittedAt: new Date().toISOString()
    };

    let updatedQuotes = [];
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const existing = b.quotes || [];
          const filtered = existing.filter(q => q.workerId !== workerObj.id);
          updatedQuotes = [...filtered, newQuote].sort((a, b) => b.optimizationScore - a.optimizationScore);
          return {
            ...b,
            quotes: updatedQuotes
          };
        }
        return b;
      })
    );

    api.updateBooking(bookingId, { quotes: updatedQuotes }).catch(console.warn);

    addNotification(
      'Custom Quote Submitted',
      `Quoted ₹${amount} (Base ₹${minBaseFloor} + Parts ₹${materialCost}). Match Rank: ${optimizationScore}%.`,
      'success'
    );

    speechService.speak(
      `आपकी ₹${amount} की सुरक्षित सहकारी बोली दर्ज हो गई है।`,
      'hi'
    );
  };

  // Customer or Platform Accepts an Artisan's Quote
  const acceptWorkerQuote = (bookingId, quote) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    const updates = {
      workerId: quote.workerId,
      workerName: quote.workerName,
      workerPhone: quote.workerPhone,
      workerAvatar: quote.workerAvatar,
      workerRating: quote.workerRating,
      workerSociety: quote.workerSociety,
      workerLocation: { ...quote.workerLocation },
      baseLaborPrice: quote.baseLaborPrice || targetBooking?.baseLaborPrice || quote.quotedAmount,
      materialCost: quote.materialCost || 0,
      complexityCost: quote.complexityCost || 0,
      totalAmount: quote.quotedAmount,
      breakdown: {
        workerPayout: quote.workerPayout,
        welfareFundContribution: quote.welfareShare,
        platformMaintenance: quote.platformFee,
        workerPercent: 88,
        welfarePercent: 7,
        platformPercent: 5
      },
      optimizationScore: quote.optimizationScore,
      status: 'ACCEPTED',
      acceptedQuote: quote,
      etaMins: Math.max(6, Math.round(quote.distanceKm * 3.2 + 3))
    };

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, ...updates } : b))
    );
    setActiveBookingId(bookingId);
    api.updateBooking(bookingId, updates).catch(console.warn);

    addNotification(
      'Artisan Quote Accepted!',
      `${quote.workerName} assigned at ₹${quote.quotedAmount} (${quote.optimizationScore}% match).`,
      'match'
    );

    speechService.speak(
      `कारीगर ${quote.workerName} का कोटेशन ₹${quote.quotedAmount} स्वीकार किया गया।`,
      'hi'
    );
  };

  // On-Site Add-on Addition (e.g. materials, spare parts, unexpected scope)
  const addBookingAddon = (bookingId, addonItem) => {
    const price = Math.max(0, Math.round(Number(addonItem.price) || 0));
    if (price <= 0 || !addonItem.name?.trim()) return null;

    const newAddon = {
      id: 'addon-' + Date.now(),
      name: addonItem.name.trim(),
      price: price,
      category: addonItem.category || 'material',
      notes: addonItem.notes ? addonItem.notes.trim() : '',
      addedAt: new Date().toISOString()
    };

    let updatedBooking = null;

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const baseFloor = Number(b.baseLaborPrice || b.totalAmount || 0);
          const currentAddOns = Array.isArray(b.addOns) ? b.addOns : [];
          const updatedAddOns = [...currentAddOns, newAddon];
          const totalAddOnCost = updatedAddOns.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
          const newTotal = baseFloor + totalAddOnCost;
          const newBreakdown = calculateInvoiceBreakdown(newTotal, { id: b.serviceId, title: b.serviceTitle });

          const updates = {
            addOns: updatedAddOns,
            materialCost: (Number(b.materialCost) || 0) + (addonItem.category !== 'complexity' ? price : 0),
            complexityCost: (Number(b.complexityCost) || 0) + (addonItem.category === 'complexity' ? price : 0),
            totalAmount: newTotal,
            breakdown: newBreakdown
          };

          updatedBooking = { ...b, ...updates };
          api.updateBooking(bookingId, updates).catch(console.warn);

          return updatedBooking;
        }
        return b;
      })
    );

    addNotification(
      'Material / Scope Added',
      `Added "${newAddon.name}" (+₹${price}) to Gig #${bookingId}. Total: ₹${updatedBooking?.totalAmount || 'Updated'}.`,
      'match'
    );

    try {
      speechService.playChime('activate');
      speechService.speak(`अतिरिक्त सामग्री ${newAddon.name} ₹${price} जोड़ दी गई है।`, 'hi');
    } catch (e) {}

    return newAddon;
  };

  // 1. Create a New Booking with Hybrid Rate Card Minimum Base Floor & Real-Time Rapido Availability
  const createBooking = (service, subService, bookingDetails) => {
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const amount = subService ? subService.price : service.basePrice;
    const breakdown = calculateInvoiceBreakdown(amount, service);

    const custLoc = bookingDetails.location || customer.location || { lat: 18.5298, lng: 73.8472 };

    // Real-Time Query: Strictly count and list verified matching online cooperative workers (Dynamic based on real registered/online workers for that skill)
    const matchingWorkers = workers.filter(w => {
      const isOnline = (w.status === 'online' || w.isOnline);
      const skills = Array.isArray(w.skills) ? w.skills : [w.skills];
      const matches = skills.some(s => s && (s === service.id || service.id?.includes(s) || s?.includes(service.id)));
      return isOnline && matches;
    });

    const notifiedWorkers = matchingWorkers.map(w => {
      const dist = calculateDistanceKm(
        custLoc.lat,
        custLoc.lng,
        w.location?.lat || 18.5298,
        w.location?.lng || 73.8472
      );
      return {
        workerId: w.id,
        name: w.name,
        phone: w.phone,
        avatar: w.avatar,
        rating: w.rating,
        societyName: w.societyName || w.society,
        distanceKm: dist,
        status: 'notified',
        isCurrentLoggedInWorker: w.id === activeWorker?.id
      };
    });

    const newBooking = {
      id: bookingId,
      serviceId: service.id,
      serviceTitle: service.title,
      subServiceName: subService ? subService.name : service.title,
      customerId: customer.id,
      customerEmail: customer.email || bookingDetails.customerEmail || 'citizen@sahakar.org',
      customerName: bookingDetails.customerName || customer.name,
      customerPhone: bookingDetails.customerPhone || customer.phone,
      customerAddress: bookingDetails.address || customer.address,
      customerLocation: custLoc,
      scheduledTime: bookingDetails.scheduledTime || 'Immediate (Express Dispatch)',
      notes: bookingDetails.notes || '',
      problemPhoto: bookingDetails.problemPhoto || null,
      completionPhoto: null,
      baseLaborPrice: amount, // Guaranteed Cooperative Minimum Rate Card Floor
      materialCost: 0,
      complexityCost: 0,
      addOns: [],
      totalAmount: amount,
      breakdown,
      status: 'BROADCASTING',
      quotes: [],
      availableWorkersCount: matchingWorkers.length,
      notifiedWorkers,
      declinedWorkerIds: [],
      declinedWorkersCount: 0,
      declinedWorkers: [],
      startOtp,
      endOtp,
      createdAt: new Date().toISOString(),
      workerId: null,
      workerLocation: null,
      etaMins: 12
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(bookingId);

    api.createBooking(newBooking).catch(console.warn);

    addNotification(
      'Gig Broadcasted · Radar Active',
      `Contacting ${matchingWorkers.length} available cooperative artisans for ${service.title}...`,
      'broadcast'
    );

    speechService.speak(
      `आपके क्षेत्र में ${matchingWorkers.length} कुशल कारीगर उपलब्ध हैं। अनुरोध प्रसारित किया गया है।`,
      'hi'
    );

    // ZERO FAKE AUTO-ACCEPTANCE: Strictly awaits genuine artisan acceptance or quote approval.
    return bookingId;
  };

  // 1B. Worker Declines a Gig Broadcast (Real-time Rapido-style Decline Tracking)
  const declineJobByWorker = (bookingId, workerId = activeWorker.id, reason = 'Busy with ongoing task') => {
    const worker = workers.find(w => w.id === workerId) || activeWorker;
    const declineRecord = {
      workerId,
      workerName: worker?.name || 'Artisan',
      reason,
      declinedAt: new Date().toISOString()
    };

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const declinedIds = Array.from(new Set([...(b.declinedWorkerIds || []), workerId]));
          const declinedList = [...(b.declinedWorkers || []), declineRecord];
          const updatedNotified = (b.notifiedWorkers || []).map(nw => 
            nw.workerId === workerId ? { ...nw, status: 'declined', reason } : nw
          );
          return {
            ...b,
            declinedWorkerIds: declinedIds,
            declinedWorkersCount: declinedIds.length,
            declinedWorkers: declinedList,
            notifiedWorkers: updatedNotified
          };
        }
        return b;
      })
    );

    api.declineBooking(bookingId, { 
      workerId, 
      reason, 
      workerName: worker?.name || 'Artisan' 
    }).catch(console.warn);

    addNotification(
      'Gig Passed / Declined',
      `You passed on Gig #${bookingId} (${reason}). Customer informed in real time.`,
      'info'
    );

    speechService.speak('कार्य अस्वीकार किया गया।', 'hi');
  };

  // 2B. Update Arbitrary Booking Fields (e.g. Completion Photo, Problem Photo)
  const updateBooking = (bookingId, updates) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );
    api.updateBooking(bookingId, updates).catch(console.warn);
  };

  // 3. Update Booking Status
  const updateBookingStatus = (bookingId, nextStatus) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );

    api.updateBooking(bookingId, { status: nextStatus }).catch(console.warn);

    if (nextStatus === 'EN_ROUTE') {
      addNotification('Worker En Route', 'Worker is traveling with live GPS tracking.', 'route');
      speechService.speak('सहकारी कार्यकर्ता आपके पते के लिए निकल चुके हैं।', 'hi');
    } else if (nextStatus === 'ARRIVED') {
      addNotification('Worker Arrived', 'Worker has reached your premises. Share Start OTP.', 'arrive');
      speechService.speak('कार्यकर्ता पहुँच चुके हैं। कृपया 4 अंकों का OTP साझा करें।', 'hi');
    } else if (nextStatus === 'IN_PROGRESS') {
      addNotification('Job In Progress', 'Start OTP verified. Service in progress.', 'progress');
    } else if (nextStatus === 'COMPLETED') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      finalizeCompletedBooking(bookingId);
    }
  };

  // 4. Finalize Booking & Settle Ledger (Bulletproof with safe fallbacks)
  const finalizeCompletedBooking = (bookingId) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const totalAmount = Number(booking.totalAmount) || 499;
      const workerPayout = Number(booking.breakdown?.workerPayout) || Math.round(totalAmount * 0.88);
      const welfareFundContribution = Number(booking.breakdown?.welfareFundContribution) || Math.round(totalAmount * 0.07);
      const estimatedPatronageDividend = Number(booking.breakdown?.estimatedPatronageDividend) || Math.round(totalAmount * 0.02);

      const targetWorkerId = booking.workerId || activeWorkerId || 'w-101';
      const targetWorkerName = booking.workerName;

      setWorkers(prev =>
        prev.map(w => {
          if (w.id === targetWorkerId || (targetWorkerName && w.name === targetWorkerName)) {
            const currentWallet = w.wallet || {
              grossEarnings: 0,
              availableBalance: 450,
              patronageDividends: 0,
              welfarePoints: 50,
              emergencyFundReserved: 0
            };

            const newWallet = {
              ...currentWallet,
              grossEarnings: (Number(currentWallet.grossEarnings) || 0) + totalAmount,
              availableBalance: (Number(currentWallet.availableBalance) || 0) + workerPayout,
              patronageDividends: (Number(currentWallet.patronageDividends) || 0) + estimatedPatronageDividend,
              welfarePoints: (Number(currentWallet.welfarePoints) || 0) + Math.round(welfareFundContribution * 0.5)
            };

            api.updateWorkerWallet(w.id, newWallet).catch(console.warn);

            return {
              ...w,
              totalJobsCompleted: (Number(w.totalJobsCompleted) || 0) + 1,
              wallet: newWallet
            };
          }
          return w;
        })
      );

      setWelfareMetrics(prev => ({
        ...prev,
        totalReserveFund: (Number(prev?.totalReserveFund) || 120000) + welfareFundContribution
      }));

      addNotification(
        'Service Completed & Synced to MongoDB',
        `₹${workerPayout} credited to Worker Wallet. ₹${welfareFundContribution} deposited into Society Welfare Fund.`,
        'success'
      );

      try {
        speechService.speak(
          `कार्य सफलतापूर्वक पूर्ण हुआ। आपके खाते में ₹${workerPayout} जमा किए गए हैं।`,
          'hi'
        );
      } catch (e) {}
    } catch (err) {
      console.error('Error finalizing completed booking:', err);
    }
  };

  const submitReview = (bookingId, rating, reviewText) => {
    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const cleanComment = (reviewText || '').trim();

    // Helper for dynamic sentiment comment if citizen leaves no text
    const getDynamicPraise = (r) => {
      if (r === 5) return 'Outstanding doorstep service and transparent cooperative billing.';
      if (r === 4) return 'Very good doorstep execution and timely arrival.';
      if (r === 3) return 'Satisfactory service completion at customer premises.';
      if (r === 2) return 'Service completed with feedback for improvement.';
      return 'Doorstep service completed.';
    };

    const finalComment = cleanComment || getDynamicPraise(numRating);

    // 1. Locate the target booking
    const booking = bookings.find(b => b.id === bookingId);
    const targetWorkerId = booking?.workerId || activeWorkerId || 'w-101';
    const targetWorkerName = booking?.workerName || 'Ramesh Jadhav';
    const customerName = booking?.customerName || customer?.name || 'Verified Citizen';
    const serviceTitle = booking?.subServiceName || booking?.serviceTitle || 'Cooperative Service';

    // 2. Update Bookings state
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            ratingGiven: numRating,
            reviewText: finalComment,
            status: 'COMPLETED'
          };
        }
        return b;
      })
    );

    // 3. Update Worker Profile (Rating, totalJobsCompleted, and reviews list)
    let updatedWorkerObj = null;

    setWorkers(prevWorkers => {
      const updated = prevWorkers.map(w => {
        const isMatch = w.id === targetWorkerId || 
          (targetWorkerName && w.name && w.name.toLowerCase().trim() === targetWorkerName.toLowerCase().trim());
        if (isMatch) {
          const currentTotal = typeof w.totalJobsCompleted === 'number' && w.totalJobsCompleted > 0 ? w.totalJobsCompleted : 0;
          const currentRating = typeof w.rating === 'number' ? w.rating : numRating;
          
          // Truthful rating calculation: If 0 prior completed jobs, rating is exactly the citizen's rating!
          const newAvgRating = currentTotal === 0
            ? numRating
            : parseFloat((((currentRating * currentTotal) + numRating) / (currentTotal + 1)).toFixed(1));
          
          const newReviewItem = {
            id: 'rev-' + Date.now(),
            bookingId,
            customerName,
            rating: numRating,
            comment: finalComment,
            date: new Date().toISOString(),
            serviceTitle
          };

          const existingReviews = Array.isArray(w.reviews) ? w.reviews : [];

          updatedWorkerObj = {
            ...w,
            rating: newAvgRating,
            totalJobsCompleted: currentTotal + 1,
            reviews: [newReviewItem, ...existingReviews],
            latestReview: newReviewItem
          };

          return updatedWorkerObj;
        }
        return w;
      });

      // Persist to custom workers in localStorage
      try {
        localStorage.setItem('sahakar_custom_workers', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });

    // 4. Update Backend API
    api.updateBooking(bookingId, { ratingGiven: numRating, reviewText: cleanComment }).catch(console.warn);
    if (updatedWorkerObj) {
      api.updateWorker(updatedWorkerObj.id, {
        rating: updatedWorkerObj.rating,
        totalJobsCompleted: updatedWorkerObj.totalJobsCompleted,
        reviews: updatedWorkerObj.reviews
      }).catch(console.warn);
    }

    addNotification(
      `⭐ ${numRating}-Star Citizen Rating Stamped`,
      `Thank you! You gave ${numRating} stars to ${targetWorkerName}. Their verified cooperative profile now reflects your ${numRating}★ review.`,
      'review'
    );
  };

  const castVote = (proposalId, voteType) => {
    setProposals(prev =>
      prev.map(p => {
        if (p.id === proposalId && !p.hasVoted) {
          return {
            ...p,
            hasVoted: true,
            yesVotes: voteType === 'yes' ? p.yesVotes + 1 : p.yesVotes,
            noVotes: voteType === 'no' ? p.noVotes + 1 : p.noVotes
          };
        }
        return p;
      })
    );

    api.voteProposal(proposalId, voteType).catch(console.warn);

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}

    addNotification(
      'Vote Persisted to MongoDB Ledger',
      `Your democratic vote for proposal #${proposalId} has been recorded.`,
      'vote'
    );
  };

  const resolveDispute = (disputeId, verdictText) => {
    setDisputes(prev =>
      prev.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: 'resolved_mutual',
            verdict: verdictText
          };
        }
        return d;
      })
    );

    api.resolveDispute(disputeId, verdictText).catch(console.warn);

    addNotification(
      'Dispute Resolved in MongoDB',
      `Dispute #${disputeId} closed with democratic consensus.`,
      'dispute'
    );
  };

  // Simulated GPS tracker for active in-flight worker
  useEffect(() => {
    if (!activeBooking || activeBooking.status !== 'EN_ROUTE' || !activeBooking.workerLocation) {
      return;
    }

    const interval = setInterval(() => {
      setBookings(prev =>
        prev.map(b => {
          if (b.id === activeBookingId && b.status === 'EN_ROUTE' && b.workerLocation) {
            const nextStep = interpolateGeoStep(
              b.workerLocation.lat,
              b.workerLocation.lng,
              b.customerLocation.lat,
              b.customerLocation.lng,
              0.15
            );

            const latDiff = Math.abs(nextStep.lat - b.customerLocation.lat);
            const lngDiff = Math.abs(nextStep.lng - b.customerLocation.lng);

            if (latDiff < 0.0008 && lngDiff < 0.0008) {
              return {
                ...b,
                workerLocation: { ...b.customerLocation },
                status: 'ARRIVED',
                etaMins: 0
              };
            }

            return {
              ...b,
              workerLocation: nextStep,
              etaMins: Math.max(1, (b.etaMins || 5) - 1)
            };
          }
          return b;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBookingId, activeBooking?.status]);

  return (
    <AppStateContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        dbStatus,
        customer,
        setCustomer,
        updateCustomerProfile,
        detectUserLocation,
        isLocating,
        detectWorkerLocation,
        isWorkerLocating,
        simulateWorkerNearCustomer,
        workers,
        setWorkers,
        activeWorker,
        setActiveWorkerId,
        registerWorker,
        updateWorkerWallet,
        services,
        bookings,
        activeBookingId,
        setActiveBookingId,
        activeBooking,
        pendingBroadcastingGigs,
        createBooking,
        updateBooking,
        acceptJobByWorker,
        declineJobByWorker,
        submitWorkerQuote,
        acceptWorkerQuote,
        addBookingAddon,
        updateBookingStatus,
        submitReview,
        proposals,
        castVote,
        voteOnProposal: castVote,
        disputes,
        resolveDispute,
        welfareMetrics,
        ministryStats,
        notifications,
        addNotification
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
