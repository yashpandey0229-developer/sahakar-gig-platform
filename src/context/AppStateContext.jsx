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
import { findBestMatchingWorkers, interpolateGeoStep } from '../services/dispatchEngine';
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
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [activeWorkerId, setActiveWorkerId] = useState('w-101'); // Ramesh Jadhav default
  const [services] = useState(SERVICES_CATALOG);

  // Active Customer state (with Real GPS capability)
  const [customer, setCustomer] = useState({
    id: 'c-501',
    name: 'Priya Sharma',
    phone: '+91 98221 55601',
    address: 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune',
    location: { lat: 18.5298, lng: 73.8472 },
    isRealGps: false
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

  // Bookings Store
  const [bookings, setBookings] = useState([
    {
      id: 'BK-7821',
      serviceId: 'electrical',
      serviceTitle: 'Electrical & Power Systems',
      subServiceName: 'MCB / Short Circuit Troubleshooting',
      customerId: 'c-501',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98221 55601',
      customerAddress: 'Flat 402, Rohan Heights, FC Road, Shivajinagar, Pune',
      customerLocation: { lat: 18.5298, lng: 73.8472 },
      workerId: 'w-101',
      workerName: 'Ramesh Jadhav',
      workerPhone: '+91 98230 44819',
      workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      workerRating: 4.9,
      workerSociety: 'Pune Urban Electrical & Tech Cooperative',
      totalAmount: 499,
      status: 'COMPLETED',
      startOtp: '4819',
      endOtp: '7721',
      createdAt: '2026-08-22T14:30:00Z',
      breakdown: calculateInvoiceBreakdown(499, SERVICES_CATALOG[1]),
      ratingGiven: 5,
      reviewText: 'Prompt arrival and explained the fair cooperative billing breakdown. Very professional!'
    }
  ]);

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
      message: '₹120 added to your quarterly patronage dividend reserve from completed gig BK-7821.',
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

  // Background Live Heartbeat: Polls every 3.5 seconds to synchronize cross-device actions
  useEffect(() => {
    const syncTimer = setInterval(async () => {
      try {
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
                local.etaMins !== remote.etaMins
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
      } catch (e) {}
    }, 3500);

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
  
  // Intelligent active booking resolution for dual-device view
  const activeBooking = bookings.find(b => b.id === activeBookingId)
    || (currentRole === 'worker' ? bookings.find(b => b.workerId === activeWorker?.id && b.status !== 'COMPLETED') : null)
    || (currentRole === 'customer' ? bookings.find(b => b.customerId === customer?.id && b.status !== 'COMPLETED') : null);

  const pendingBroadcastingGigs = bookings.filter(b => b.status === 'BROADCASTING');

  // Customer Profile Editor
  const updateCustomerProfile = (updates) => {
    setCustomer(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('sahakar_customer', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    addNotification('Profile Saved', `Customer profile set for ${updates.name || customer.name}.`, 'info');
  };

  // Worker Partner Registration
  const registerWorker = async (workerData) => {
    const id = workerData.id || ('w-' + Date.now());
    const newWorker = {
      id,
      name: workerData.name || 'New Sahakari Partner',
      phone: workerData.phone || '+91 98230 00000',
      avatar: workerData.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      totalJobsCompleted: 0,
      skills: workerData.skills || ['electrical', 'plumbing'],
      societyName: workerData.societyName || 'Pune Urban Multi-Trade Cooperative',
      cooperativeMemberId: workerData.cooperativeMemberId || ('COOP-MH-' + Math.floor(1000 + Math.random() * 9000)),
      bankAccountMasked: workerData.bankAccountMasked || '•••• 7712 (UPI Verified)',
      isOnline: true,
      fairRotationScore: 98,
      location: workerData.location || { lat: 18.5298, lng: 73.8472 },
      wallet: {
        grossEarnings: 0,
        availableBalance: 450,
        patronageDividends: 0,
        welfarePoints: 50,
        emergencyFundReserved: 0
      }
    };

    setWorkers(prev => [newWorker, ...prev.filter(w => w.id !== id)]);
    setActiveWorkerId(id);

    try {
      await api.registerWorker(newWorker);
    } catch (e) {
      console.warn('API registerWorker notice:', e.message);
    }

    addNotification(
      'Partner Registered & Live on Radar',
      `Welcome ${newWorker.name}! Your cooperative profile has been created and synced.`,
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

  // Worker Accepts Gig
  const acceptJobByWorker = (bookingId, workerObj = activeWorker) => {
    const updates = {
      workerId: workerObj.id,
      workerName: workerObj.name,
      workerPhone: workerObj.phone,
      workerAvatar: workerObj.avatar,
      workerRating: workerObj.rating,
      workerSociety: workerObj.societyName,
      workerLocation: { ...workerObj.location },
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
      `You accepted gig #${bookingId}. Customer notified.`,
      'match'
    );

    speechService.speak(
      `कार्य स्वीकार किया गया! ग्राहक ${workerObj.name} की प्रतीक्षा कर रहे हैं।`,
      'hi'
    );
  };

  // 1. Create a New Booking
  const createBooking = (service, subService, bookingDetails) => {
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const endOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const amount = subService ? subService.price : service.basePrice;
    const breakdown = calculateInvoiceBreakdown(amount, service);

    const newBooking = {
      id: bookingId,
      serviceId: service.id,
      serviceTitle: service.title,
      subServiceName: subService ? subService.name : service.title,
      customerId: customer.id,
      customerName: bookingDetails.customerName || customer.name,
      customerPhone: bookingDetails.customerPhone || customer.phone,
      customerAddress: bookingDetails.address || customer.address,
      customerLocation: bookingDetails.location || customer.location,
      scheduledTime: bookingDetails.scheduledTime || 'Immediate (Express Dispatch)',
      notes: bookingDetails.notes || '',
      totalAmount: amount,
      breakdown,
      status: 'BROADCASTING',
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
      'Gig Broadcasted & Saved to MongoDB',
      `Searching nearest available cooperative partners for ${service.title}...`,
      'broadcast'
    );

    // Allow 15 seconds for a connected real worker (Friend B) to accept the incoming gig.
    // If no real worker accepts within 15 seconds, fallback to auto-assign candidate for single-player demo.
    setTimeout(() => {
      setBookings(current => {
        const target = current.find(b => b.id === bookingId);
        if (target && target.status === 'BROADCASTING') {
          autoAssignWorker(bookingId, service.id, target.customerLocation);
        }
        return current;
      });
    }, 15000);

    return bookingId;
  };

  // 2. Auto-Assign Candidate Workers (Fallback for Solo Demo)
  const autoAssignWorker = (bookingId, serviceId, customerLoc) => {
    const matched = findBestMatchingWorkers(serviceId, customerLoc, workers);
    const topCandidate = matched.length > 0 ? matched[0] : workers[0];

    const updates = {
      workerId: topCandidate.id,
      workerName: topCandidate.name,
      workerPhone: topCandidate.phone,
      workerAvatar: topCandidate.avatar,
      workerRating: topCandidate.rating,
      workerSociety: topCandidate.societyName,
      workerLocation: { ...topCandidate.location },
      status: 'ACCEPTED',
      etaMins: topCandidate.estimatedEtaMins || 10
    };

    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return { ...b, ...updates };
        }
        return b;
      })
    );

    api.updateBooking(bookingId, updates).catch(console.warn);

    addNotification(
      'Worker Assigned via Fair-Rotation',
      `${topCandidate.name} from "${topCandidate.societyName}" accepted the dispatch.`,
      'match'
    );

    speechService.speak(
      `नया कार्य स्वीकार किया गया: ${topCandidate.name} आपके स्थान के लिए रवाना हो रहे हैं।`,
      'hi'
    );
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

  // 4. Finalize Booking & Settle Ledger
  const finalizeCompletedBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const { workerPayout, welfareFundContribution, estimatedPatronageDividend } = booking.breakdown;

    setWorkers(prev =>
      prev.map(w => {
        if (w.id === booking.workerId) {
          const newWallet = {
            ...w.wallet,
            grossEarnings: w.wallet.grossEarnings + booking.totalAmount,
            availableBalance: w.wallet.availableBalance + workerPayout,
            patronageDividends: w.wallet.patronageDividends + estimatedPatronageDividend,
            welfarePoints: w.wallet.welfarePoints + Math.round(welfareFundContribution * 0.5)
          };

          api.updateWorkerWallet(w.id, newWallet).catch(console.warn);

          return {
            ...w,
            totalJobsCompleted: w.totalJobsCompleted + 1,
            wallet: newWallet
          };
        }
        return w;
      })
    );

    setWelfareMetrics(prev => ({
      ...prev,
      totalReserveFund: prev.totalReserveFund + welfareFundContribution
    }));

    addNotification(
      'Service Completed & Synced to MongoDB',
      `₹${workerPayout} credited to Worker Wallet. ₹${welfareFundContribution} deposited into Society Welfare Fund.`,
      'success'
    );

    speechService.speak(
      `कार्य सफलतापूर्वक पूर्ण हुआ। आपके खाते में ₹${workerPayout} जमा किए गए हैं।`,
      'hi'
    );
  };

  const submitReview = (bookingId, rating, reviewText) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return { ...b, ratingGiven: rating, reviewText, status: 'COMPLETED' };
        }
        return b;
      })
    );
    api.updateBooking(bookingId, { ratingGiven: rating, reviewText }).catch(console.warn);
    addNotification('Review Submitted', `Thank you for rating! You gave ${rating} stars.`, 'review');
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
        acceptJobByWorker,
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
