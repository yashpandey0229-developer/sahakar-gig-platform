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
  // 1. Ramesh Jadhav (Electrical & Appliances - Shivajinagar)
  {
    id: 'w-101',
    name: 'Ramesh Jadhav',
    phone: '+91 98230 44819',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalJobsCompleted: 438,
    skills: ['electrical', 'appliance-repair'],
    societyName: 'Pune Urban Electrical & Tech Cooperative',
    cooperativeMemberId: 'MH-PUN-ELEC-001',
    bankAccountMasked: 'HDFC •••• 4901',
    isOnline: true,
    hourlyRate: 249,
    visitingCharge: 149,
    fairRotationScore: 98,
    location: { lat: 18.5204, lng: 73.8567, address: 'Shivajinagar, Pune' },
    wallet: { grossEarnings: 171000, availableBalance: 4850, patronageDividends: 8420, welfarePoints: 1250, emergencyFundReserved: 15000 }
  },
  // 2. Sunita Patil (Deep Cleaning & Care - FC Road)
  {
    id: 'w-102',
    name: 'Sunita Patil',
    phone: '+91 97654 22019',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalJobsCompleted: 512,
    skills: ['deep-cleaning', 'care', 'elder-assistance'],
    societyName: 'Mahila Swavalamban Cleaners Cooperative',
    cooperativeMemberId: 'MH-PUN-CLEN-0108',
    bankAccountMasked: 'SBI •••• 8823',
    isOnline: true,
    hourlyRate: 199,
    visitingCharge: 99,
    fairRotationScore: 94,
    location: { lat: 18.5314, lng: 73.8446, address: 'FC Road, Pune' },
    wallet: { grossEarnings: 245000, availableBalance: 6120, patronageDividends: 11800, welfarePoints: 1980, emergencyFundReserved: 20000 }
  },
  // 3. Mohammad Tariq (Plumbing - Kothrud)
  {
    id: 'w-103',
    name: 'Mohammad Tariq',
    phone: '+91 98901 33412',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.85,
    totalJobsCompleted: 580,
    skills: ['plumbing', 'appliance-repair'],
    societyName: 'Sahyadri Jal Sevak Cooperative',
    cooperativeMemberId: 'MH-PUN-PLUM-0319',
    bankAccountMasked: 'BOI •••• 1120',
    isOnline: true,
    hourlyRate: 219,
    visitingCharge: 129,
    fairRotationScore: 91,
    location: { lat: 18.5089, lng: 73.8258, address: 'Kothrud, Pune' },
    wallet: { grossEarnings: 98000, availableBalance: 3200, patronageDividends: 4900, welfarePoints: 780, emergencyFundReserved: 10000 }
  },
  // 4. Vikram Singh (Electrical & AC - Baner)
  {
    id: 'w-104',
    name: 'Vikram Singh',
    phone: '+91 98812 77019',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalJobsCompleted: 405,
    skills: ['ac-repair', 'electrical', 'appliance-repair'],
    societyName: 'Pune Climate Tech & HVAC Cooperative',
    cooperativeMemberId: 'MH-PUN-ELEC-002',
    bankAccountMasked: 'ICICI •••• 6742',
    isOnline: true,
    hourlyRate: 299,
    visitingCharge: 179,
    fairRotationScore: 89,
    location: { lat: 18.5590, lng: 73.7868, address: 'Baner, Pune' },
    wallet: { grossEarnings: 210000, availableBalance: 5400, patronageDividends: 9800, welfarePoints: 1450, emergencyFundReserved: 18000 }
  },
  // 5. Anand Shinde (Carpentry & Painting - Karve Nagar)
  {
    id: 'w-105',
    name: 'Anand Shinde',
    phone: '+91 98220 99411',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    skills: ['carpentry', 'painting'],
    rating: 4.92,
    totalJobsCompleted: 640,
    cooperativeMemberId: 'MH-PUN-WOOD-012',
    societyName: 'Shree Ganesh Woodcraft Cooperative',
    bankAccountMasked: 'HDFC •••• 7712',
    isOnline: true,
    hourlyRate: 269,
    visitingCharge: 159,
    fairRotationScore: 95,
    location: { lat: 18.5074, lng: 73.8077, address: 'Karve Nagar, Pune' },
    wallet: { grossEarnings: 53800, availableBalance: 7300, patronageDividends: 4890, welfarePoints: 1250, emergencyFundReserved: 2100 }
  },
  // 6. Sachin Bhosale (Electrical - Kothrud)
  {
    id: 'w-106',
    name: 'Sachin Bhosale',
    phone: '+91 98221 64510',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical'],
    rating: 4.92,
    totalJobsCompleted: 382,
    cooperativeMemberId: 'MH-PUN-ELEC-003',
    societyName: 'Kothrud Artisan Guild & Electrical Coop',
    bankAccountMasked: 'SBI •••• 4410',
    isOnline: true,
    hourlyRate: 249,
    visitingCharge: 149,
    fairRotationScore: 96,
    location: { lat: 18.5020, lng: 73.8120, address: 'Kothrud Ward, Pune' },
    wallet: { grossEarnings: 36200, availableBalance: 4100, patronageDividends: 2800, welfarePoints: 720, emergencyFundReserved: 1200 }
  },
  // 7. Mahesh Shinde (Electrical - Deccan Gymkhana)
  {
    id: 'w-107',
    name: 'Mahesh Shinde',
    phone: '+91 98902 43190',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical'],
    rating: 4.85,
    totalJobsCompleted: 248,
    cooperativeMemberId: 'MH-PUN-ELEC-004',
    societyName: 'Deccan Wiremen & Maintenance Coop',
    bankAccountMasked: 'BOI •••• 3190',
    isOnline: true,
    hourlyRate: 239,
    visitingCharge: 139,
    fairRotationScore: 92,
    location: { lat: 18.5167, lng: 73.8415, address: 'Deccan Gymkhana, Pune' },
    wallet: { grossEarnings: 28400, availableBalance: 3200, patronageDividends: 2100, welfarePoints: 640, emergencyFundReserved: 900 }
  },
  // 8. Rajesh Kulkarni (Electrical & Appliances - Aundh)
  {
    id: 'w-108',
    name: 'Rajesh Kulkarni',
    phone: '+91 97651 88204',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical', 'appliance-repair'],
    rating: 4.90,
    totalJobsCompleted: 495,
    cooperativeMemberId: 'MH-PUN-ELEC-005',
    societyName: 'Aundh Smart Power & Wiring Society',
    bankAccountMasked: 'ICICI •••• 8204',
    isOnline: true,
    hourlyRate: 259,
    visitingCharge: 149,
    fairRotationScore: 97,
    location: { lat: 18.5580, lng: 73.8074, address: 'Aundh Gaon, Pune' },
    wallet: { grossEarnings: 44100, availableBalance: 5900, patronageDividends: 3900, welfarePoints: 980, emergencyFundReserved: 1600 }
  },
  // 9. Amit Deshmukh (Electrical - Viman Nagar)
  {
    id: 'w-109',
    name: 'Amit Deshmukh',
    phone: '+91 98234 19823',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical'],
    rating: 4.87,
    totalJobsCompleted: 215,
    cooperativeMemberId: 'MH-PUN-ELEC-006',
    societyName: 'Viman Nagar Power Tech Workers Coop',
    bankAccountMasked: 'HDFC •••• 9823',
    isOnline: true,
    hourlyRate: 249,
    visitingCharge: 149,
    fairRotationScore: 90,
    location: { lat: 18.5679, lng: 73.9143, address: 'Viman Nagar, Pune' },
    wallet: { grossEarnings: 24100, availableBalance: 2900, patronageDividends: 1800, welfarePoints: 580, emergencyFundReserved: 800 }
  },
  // 10. Ganesh More (Electrical - Hadapsar)
  {
    id: 'w-110',
    name: 'Ganesh More',
    phone: '+91 98603 55192',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical'],
    rating: 4.89,
    totalJobsCompleted: 520,
    cooperativeMemberId: 'MH-PUN-ELEC-007',
    societyName: 'Swargate & Hadapsar Electricians Guild',
    bankAccountMasked: 'SBI •••• 5192',
    isOnline: true,
    hourlyRate: 249,
    visitingCharge: 149,
    fairRotationScore: 93,
    location: { lat: 18.5089, lng: 73.9260, address: 'Hadapsar Magarpatta, Pune' },
    wallet: { grossEarnings: 47900, availableBalance: 6400, patronageDividends: 4100, welfarePoints: 1050, emergencyFundReserved: 1750 }
  },
  // 11. Nitin Pawar (Electrical & Appliances - Wakad)
  {
    id: 'w-111',
    name: 'Nitin Pawar',
    phone: '+91 98229 33718',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical', 'appliance-repair'],
    rating: 4.91,
    totalJobsCompleted: 360,
    cooperativeMemberId: 'MH-PUN-ELEC-008',
    societyName: 'PCMC & Wakad Electrical Artisans Coop',
    bankAccountMasked: 'HDFC •••• 3718',
    isOnline: true,
    hourlyRate: 259,
    visitingCharge: 149,
    fairRotationScore: 95,
    location: { lat: 18.5987, lng: 73.7684, address: 'Wakad Bridge, Pune' },
    wallet: { grossEarnings: 39500, availableBalance: 4800, patronageDividends: 3200, welfarePoints: 890, emergencyFundReserved: 1450 }
  },
  // 12. Pradeep Salunkhe (Electrical - Pune Camp)
  {
    id: 'w-112',
    name: 'Pradeep Salunkhe',
    phone: '+91 97640 12895',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical'],
    rating: 4.86,
    totalJobsCompleted: 410,
    cooperativeMemberId: 'MH-PUN-ELEC-009',
    societyName: 'Camp & Pune Station Guild of Technicians',
    bankAccountMasked: 'BOI •••• 2895',
    isOnline: true,
    hourlyRate: 249,
    visitingCharge: 139,
    fairRotationScore: 92,
    location: { lat: 18.5135, lng: 73.8784, address: 'MG Road, Pune Camp' },
    wallet: { grossEarnings: 37800, availableBalance: 4400, patronageDividends: 2950, welfarePoints: 830, emergencyFundReserved: 1300 }
  },
  // 13. Deepak Gaikwad (Electrical - Sinhagad Road)
  {
    id: 'w-113',
    name: 'Deepak Gaikwad',
    phone: '+91 98501 77340',
    avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical'],
    rating: 4.93,
    totalJobsCompleted: 345,
    cooperativeMemberId: 'MH-PUN-ELEC-010',
    societyName: 'Sinhagad Road Powerline Technicians Coop',
    bankAccountMasked: 'SBI •••• 7340',
    isOnline: true,
    hourlyRate: 249,
    visitingCharge: 149,
    fairRotationScore: 96,
    location: { lat: 18.4789, lng: 73.8245, address: 'Sinhagad Road, Pune' },
    wallet: { grossEarnings: 33900, availableBalance: 3950, patronageDividends: 2700, welfarePoints: 770, emergencyFundReserved: 1250 }
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
  registeredCooperatives: 148,
  nationalRegisteredCooperatives: 148,
  activeWorkers: 18450,
  totalEmpoweredArtisans: 42800,
  welfareReserveFund: 1485200,
  patronageDividendsDistributed: 4280000,
  capitalReturnedToWorkersCr: 84.6,
  intermediaryCommissionSavedCr: 19.8,
  modelAdoptionStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Kerala', 'Tamil Nadu', 'Madhya Pradesh']
};
