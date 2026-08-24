// Self-Contained Backend Mock Data & Catalogs

export const SERVICES_CATALOG = [
  {
    id: 'plumbing',
    title: 'Plumbing & Water Systems',
    category: 'Essential Maintenance',
    basePrice: 349,
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'p-1', name: 'Tap & Pipe Fix', price: 349, duration: '45 mins' },
      { id: 'p-2', name: 'Bathroom Fitting', price: 549, duration: '60 mins' },
      { id: 'p-3', name: 'Water Tank & Motor Overhaul', price: 899, duration: '90 mins' }
    ]
  },
  {
    id: 'electrical',
    title: 'Electrical & Power Systems',
    category: 'Essential Maintenance',
    basePrice: 399,
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'e-1', name: 'Short-circuit Fix', price: 399, duration: '45 mins' },
      { id: 'e-2', name: 'Fan / Geyser Repair', price: 499, duration: '60 mins' },
      { id: 'e-3', name: 'Full Switchboard Wiring Setup', price: 899, duration: '90 mins' }
    ]
  },
  {
    id: 'ac-repair',
    title: 'AC Service & Climate Tech',
    category: 'Appliance Care',
    basePrice: 599,
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'ac-1', name: 'Foam Jet Service', price: 599, duration: '60 mins' },
      { id: 'ac-2', name: 'Gas Refill', price: 1499, duration: '75 mins' },
      { id: 'ac-3', name: 'Complete Installation', price: 1299, duration: '90 mins' }
    ]
  },
  {
    id: 'deep-cleaning',
    title: 'Deep House Sanitization',
    category: 'Housekeeping',
    basePrice: 499,
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'c-1', name: 'Kitchen Deep Clean', price: 499, duration: '60 mins' },
      { id: 'c-2', name: 'Bathroom Deep Clean', price: 599, duration: '60 mins' },
      { id: 'c-3', name: 'Full 2BHK Sanitization', price: 1799, duration: '180 mins' }
    ]
  }
];

export const INITIAL_WORKERS = [
  {
    id: 'w-101',
    name: 'Ramesh Jadhav',
    phone: '+91 98230 44819',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalJobsCompleted: 342,
    skills: ['electrical', 'appliances'],
    societyName: 'Pune Urban Electrical & Tech Cooperative',
    cooperativeMemberId: 'PN-ELEC-0442',
    bankAccountMasked: 'HDFC •••• 4901',
    isOnline: true,
    fairRotationScore: 98,
    location: { lat: 18.5204, lng: 73.8567 },
    wallet: {
      grossEarnings: 171000,
      availableBalance: 4850,
      patronageDividends: 8420,
      welfarePoints: 1250,
      emergencyFundReserved: 15000
    }
  },
  {
    id: 'w-102',
    name: 'Sunita Gaikwad',
    phone: '+91 97654 22019',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalJobsCompleted: 512,
    skills: ['deep-cleaning', 'care'],
    societyName: 'Mahila Swavalamban Cleaners Cooperative',
    cooperativeMemberId: 'PN-CLEN-0108',
    bankAccountMasked: 'SBI •••• 8823',
    isOnline: true,
    fairRotationScore: 94,
    location: { lat: 18.5314, lng: 73.8446 },
    wallet: {
      grossEarnings: 245000,
      availableBalance: 6120,
      patronageDividends: 11800,
      welfarePoints: 1980,
      emergencyFundReserved: 20000
    }
  },
  {
    id: 'w-103',
    name: 'Santosh Shinde',
    phone: '+91 98901 33412',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.85,
    totalJobsCompleted: 219,
    skills: ['plumbing'],
    societyName: 'Sahyadri Jal Sevak Cooperative',
    cooperativeMemberId: 'PN-PLUM-0319',
    bankAccountMasked: 'BOI •••• 1120',
    isOnline: true,
    fairRotationScore: 91,
    location: { lat: 18.5122, lng: 73.8690 },
    wallet: {
      grossEarnings: 98000,
      availableBalance: 3200,
      patronageDividends: 4900,
      welfarePoints: 780,
      emergencyFundReserved: 10000
    }
  },
  {
    id: 'w-104',
    name: 'Anil Kamble',
    phone: '+91 94220 88912',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalJobsCompleted: 405,
    skills: ['ac-repair', 'appliances'],
    societyName: 'Pune Climate Tech & HVAC Cooperative',
    cooperativeMemberId: 'PN-HVAC-0082',
    bankAccountMasked: 'ICICI •••• 6742',
    isOnline: true,
    fairRotationScore: 89,
    location: { lat: 18.5401, lng: 73.8320 },
    wallet: {
      grossEarnings: 210000,
      availableBalance: 5400,
      patronageDividends: 9800,
      welfarePoints: 1450,
      emergencyFundReserved: 18000
    }
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-101',
    title: 'Increase Summer AC Repair Baseline Payout by 6%',
    description: 'Adjust summer thermal peak pricing to ensure extra compensation for technicians working in high-heat conditions.',
    category: 'Fair Pricing & Wage Policy',
    yesVotes: 142,
    noVotes: 12,
    daysLeft: 3,
    hasVoted: false
  },
  {
    id: 'prop-102',
    title: 'Allocate ₹2,50,000 for Cooperative Child Education Grants',
    description: 'Disburse annual educational support bursaries to school-going children of registered members.',
    category: 'Welfare & Solidarity',
    yesVotes: 218,
    noVotes: 5,
    daysLeft: 5,
    hasVoted: false
  },
  {
    id: 'prop-103',
    title: 'Adopt Multi-Sensor Mechanized Tools Bulk Purchase',
    description: 'Leverage cooperative buying power to procure thermal imaging sensors at 40% discount for electrical artisans.',
    category: 'Tool & Equipment Subsidy',
    yesVotes: 189,
    noVotes: 24,
    daysLeft: 8,
    hasVoted: false
  }
];

export const INITIAL_DISPUTES = [
  {
    id: 'disp-301',
    bookingId: 'BK-7802',
    workerName: 'Santosh Shinde',
    customerName: 'Vivek Joshi',
    issue: 'Disputed extra parts charge for concealed pipe valve replacement.',
    workerNotes: 'Wall cutting revealed rust that required an unexpected copper flange valve replacement.',
    customerNotes: 'Was only quoted ₹349 on app, extra ₹400 for parts was unexpected.',
    stakeAmount: 400,
    status: 'open_jury_review',
    juryMembers: ['Ramesh Jadhav', 'Sunita Gaikwad', 'Anil Kamble']
  }
];

export const COOP_WELFARE_METRICS = {
  id: 'primary_metrics',
  totalReserveFund: 485000,
  activeClaimsProcessed: 34,
  quarterlyDividendsDistributed: 1240000,
  zeroInterestLoansDisbursed: 620000,
  avgWageMultiplierOverMarket: 1.38
};

export const MINISTRY_STATS = {
  nationalRegisteredCooperatives: 148,
  totalEmpoweredArtisans: 42800,
  capitalReturnedToWorkersCr: 84.6,
  intermediaryCommissionSavedCr: 19.8,
  modelAdoptionStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Kerala', 'Tamil Nadu', 'Madhya Pradesh']
};
