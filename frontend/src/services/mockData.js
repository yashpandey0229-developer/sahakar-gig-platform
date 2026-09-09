// Mock Data and Domain Models for SahakarGig Platform (SIH26089)

export const SERVICES_CATALOG = [
  {
    id: 'plumbing',
    title: 'Plumbing & Water Systems',
    titleHi: 'प्लंबिंग एवं जल सेवाएं',
    icon: 'Wrench',
    category: 'Essential Maintenance',
    basePrice: 299,
    estimatedDuration: '45-60 mins',
    popular: true,
    description: 'Expert pipe leakage repair, bathroom fittings, tap replacement, drainage unclogging & motor servicing.',
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'p1', name: 'Tap & Shower Leakage Fix', price: 299, duration: '40m' },
      { id: 'p2', name: 'Bathroom Drain Jet Unclogging', price: 499, duration: '60m' },
      { id: 'p3', name: 'Water Tank & Pipe Installation', price: 899, duration: '120m' },
      { id: 'p4', name: 'Water Pump / Motor Repair', price: 549, duration: '75m' },
    ]
  },
  {
    id: 'electrical',
    title: 'Electrical & Power Systems',
    titleHi: 'इलेक्ट्रिकल एवं वायरिंग',
    icon: 'Zap',
    category: 'Essential Maintenance',
    basePrice: 349,
    estimatedDuration: '30-45 mins',
    popular: true,
    description: 'Certified electricians for short-circuit diagnosis, fan/geyser repair, switchboard installation, and safety earthing.',
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'e1', name: 'Switchboard & Socket Installation', price: 349, duration: '30m' },
      { id: 'e2', name: 'Ceiling Fan / Exhaust Fan Repair', price: 399, duration: '45m' },
      { id: 'e3', name: 'MCB / Short Circuit Troubleshooting', price: 499, duration: '60m' },
      { id: 'e4', name: 'Geyser / Water Heater Repair', price: 599, duration: '60m' },
    ]
  },
  {
    id: 'ac-repair',
    title: 'AC Service & Climate Tech',
    titleHi: 'एसी रिपेयर एवं सर्विसिंग',
    icon: 'Wind',
    category: 'Appliance Care',
    basePrice: 599,
    estimatedDuration: '60-90 mins',
    popular: true,
    description: 'Eco-friendly foam jet AC cleaning, cooling coil diagnosis, gas refilling, and anti-bacterial filter sanitation.',
    workerSharePercent: 87,
    welfareSharePercent: 8,
    platformSharePercent: 5,
    subServices: [
      { id: 'ac1', name: 'Deep Jet Power AC Servicing', price: 599, duration: '60m' },
      { id: 'ac2', name: 'Refrigerant Gas Leak Fix & Refill', price: 1899, duration: '90m' },
      { id: 'ac3', name: 'Split AC Uninstallation / Relocation', price: 899, duration: '90m' },
    ]
  },
  {
    id: 'deep-cleaning',
    title: 'Deep House Sanitization',
    titleHi: 'सम्पूर्ण गृह स्वच्छता सेवा',
    icon: 'Sparkles',
    category: 'Housekeeping',
    basePrice: 899,
    estimatedDuration: '2-3 hours',
    popular: false,
    description: 'Hospital-grade mechanized deep cleaning for kitchens, bathrooms, sofas, balconies, and full apartments.',
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'c1', name: 'Kitchen Chimney & Tile Degreasing', price: 899, duration: '90m' },
      { id: 'c2', name: 'Intense Bathroom Descaling (2 Bathrooms)', price: 799, duration: '80m' },
      { id: 'c3', name: 'Full 2BHK Deep Sanitization Package', price: 2499, duration: '180m' },
    ]
  },
  {
    id: 'carpentry',
    title: 'Carpentry & Woodcraft',
    titleHi: 'बढ़ईगीरी एवं फर्नीचर मरम्मत',
    icon: 'Hammer',
    category: 'Specialized Trades',
    basePrice: 399,
    estimatedDuration: '45-60 mins',
    popular: false,
    description: 'Skilled woodworkers for lock installations, door alignments, modular kitchen repairs, and custom shelves.',
    workerSharePercent: 88,
    welfareSharePercent: 7,
    platformSharePercent: 5,
    subServices: [
      { id: 'cp1', name: 'Door Lock / Latch Replacement', price: 399, duration: '40m' },
      { id: 'cp2', name: 'Modular Cabinet Hinge Repair', price: 449, duration: '45m' },
      { id: 'cp3', name: 'Custom Wall Shelf / TV Mount', price: 599, duration: '60m' },
    ]
  },
  {
    id: 'appliance-repair',
    title: 'Major Home Appliances',
    titleHi: 'घरेलू उपकरण मरम्मत',
    icon: 'Cpu',
    category: 'Appliance Care',
    basePrice: 449,
    estimatedDuration: '45-75 mins',
    popular: false,
    description: 'Fast diagnostics for refrigerators, washing machines, microwave ovens, and RO water purifiers with genuine parts.',
    workerSharePercent: 87,
    welfareSharePercent: 8,
    platformSharePercent: 5,
    subServices: [
      { id: 'ap1', name: 'Washing Machine Drum / Motor Fix', price: 649, duration: '60m' },
      { id: 'ap2', name: 'Refrigerator Cooling & Thermostat Fix', price: 599, duration: '60m' },
      { id: 'ap3', name: 'RO Water Purifier Filter Service', price: 449, duration: '45m' },
    ]
  },
  {
    id: 'painting',
    title: 'Painting & Damp Treatment',
    titleHi: 'पेंटिंग एवं वॉटरप्रूफिंग',
    icon: 'Paintbrush',
    category: 'Renovation',
    basePrice: 799,
    estimatedDuration: '1-2 days',
    popular: false,
    description: 'Wall touch-ups, accent texture painting, anti-fungal waterproofing, and exterior protective coating.',
    workerSharePercent: 89,
    welfareSharePercent: 6,
    platformSharePercent: 5,
    subServices: [
      { id: 'pt1', name: 'Single Room Accent Wall Painting', price: 1499, duration: '180m' },
      { id: 'pt2', name: 'Balcony / Wall Damp Proof Treatment', price: 999, duration: '120m' },
    ]
  },
  {
    id: 'elder-assistance',
    title: 'Elder & Mobility Support',
    titleHi: 'वरिष्ठ नागरिक सहायता',
    icon: 'HeartHandshake',
    category: 'Care Services',
    basePrice: 349,
    estimatedDuration: '60 mins',
    popular: false,
    description: 'Trained cooperative community caregivers for mobility assistance, medical appointments, and daily errand support.',
    workerSharePercent: 90,
    welfareSharePercent: 6,
    platformSharePercent: 4,
    subServices: [
      { id: 'ea1', name: 'Doctor Visit & Mobility Chaperone (2 hrs)', price: 499, duration: '120m' },
      { id: 'ea2', name: 'Grocery & Prescription Errand Support', price: 349, duration: '60m' },
    ]
  }
];

export const INITIAL_WORKERS = [
  {
    id: 'w-101',
    name: 'Ramesh Jadhav',
    nameHi: 'रमेश जाधव',
    email: 'ramesh.jadhav@coop.org',
    phone: '+91 98230 44819',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    skills: ['electrical', 'appliance-repair'],
    experienceYears: 7,
    rating: 4.9,
    hourlyRate: 249,
    visitingCharge: 149,
    totalJobsCompleted: 438,
    cooperativeMemberId: 'MH-PUN-ELEC-042',
    societyName: 'Pune Urban Electrical & Tech Cooperative Society',
    location: { lat: 18.5204, lng: 73.8567, address: 'Shivajinagar, Pune' },
    status: 'online', // 'online' | 'busy' | 'offline'
    fairRotationScore: 94, // Preserved for backwards-compatibility
    certification: 'NSDC Level 4 Certified Electrician',
    aadhaarVerified: true,
    skillIndiaBadge: true,
    languages: ['Hindi', 'Marathi', 'English'],
    wallet: {
      grossEarnings: 38450,
      availableBalance: 4620,
      patronageDividends: 3120, // Accrued cooperative profit share
      welfarePoints: 850,       // Usable for health insurance/loans
      emergencyFundReserved: 1400
    }
  },
  {
    id: 'w-102',
    name: 'Sunita Patil',
    nameHi: 'सुनीता पाटिल',
    email: 'sunita.patil@coop.org',
    phone: '+91 97654 11209',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['deep-cleaning', 'elder-assistance'],
    experienceYears: 5,
    rating: 4.95,
    hourlyRate: 199,
    visitingCharge: 99,
    totalJobsCompleted: 312,
    cooperativeMemberId: 'MH-PUN-CLEAN-019',
    societyName: 'Mahila Swavalamban Cooperative Society',
    location: { lat: 18.5314, lng: 73.8446, address: 'FC Road, Pune' },
    status: 'online',
    fairRotationScore: 98,
    certification: 'Govt. Certified Sanitization Specialist',
    aadhaarVerified: true,
    skillIndiaBadge: true,
    languages: ['Marathi', 'Hindi'],
    wallet: {
      grossEarnings: 29800,
      availableBalance: 3450,
      patronageDividends: 2450,
      welfarePoints: 920,
      emergencyFundReserved: 1100
    }
  },
  {
    id: 'w-103',
    name: 'Mohammad Tariq',
    nameHi: 'मोहम्मद तारिक',
    email: 'mohammad.tariq@coop.org',
    phone: '+91 99221 88340',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['plumbing', 'appliance-repair'],
    experienceYears: 9,
    rating: 4.85,
    hourlyRate: 219,
    visitingCharge: 129,
    totalJobsCompleted: 580,
    cooperativeMemberId: 'MH-PUN-PLUMB-007',
    societyName: 'Sahyadri Plumbing & Maintenance Workers Coop',
    location: { lat: 18.5089, lng: 73.8258, address: 'Kothrud, Pune' },
    status: 'online',
    fairRotationScore: 89,
    certification: 'Master Plumber Certification (ITI Pune)',
    aadhaarVerified: true,
    skillIndiaBadge: true,
    languages: ['Hindi', 'Urdu', 'Marathi'],
    wallet: {
      grossEarnings: 49200,
      availableBalance: 6100,
      patronageDividends: 4200,
      welfarePoints: 1100,
      emergencyFundReserved: 1800
    }
  },
  {
    id: 'w-104',
    name: 'Vikram Singh',
    nameHi: 'विक्रम सिंह',
    email: 'vikram.singh@coop.org',
    phone: '+91 98812 77019',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['ac-repair', 'electrical'],
    experienceYears: 6,
    rating: 4.88,
    hourlyRate: 299,
    visitingCharge: 179,
    totalJobsCompleted: 390,
    cooperativeMemberId: 'MH-PUN-HVAC-031',
    societyName: 'Maharashtra HVAC Technicians Cooperative',
    location: { lat: 18.5590, lng: 73.7868, address: 'Baner, Pune' },
    status: 'online',
    fairRotationScore: 91,
    certification: 'BEE Certified Energy Efficient AC Specialist',
    aadhaarVerified: true,
    skillIndiaBadge: true,
    languages: ['Hindi', 'English', 'Punjabi'],
    wallet: {
      grossEarnings: 42100,
      availableBalance: 5200,
      patronageDividends: 3600,
      welfarePoints: 790,
      emergencyFundReserved: 1550
    }
  },
  {
    id: 'w-105',
    name: 'Anand Shinde',
    nameHi: 'आनंद शिंदे',
    email: 'anand.shinde@coop.org',
    phone: '+91 98220 99411',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    skills: ['carpentry', 'painting'],
    experienceYears: 11,
    rating: 4.92,
    hourlyRate: 269,
    visitingCharge: 159,
    totalJobsCompleted: 640,
    cooperativeMemberId: 'MH-PUN-WOOD-012',
    societyName: 'Shree Ganesh Woodcraft Cooperative',
    location: { lat: 18.5074, lng: 73.8077, address: 'Karve Nagar, Pune' },
    status: 'online',
    fairRotationScore: 95,
    certification: 'NSDC Certified Master Carpenter',
    aadhaarVerified: true,
    skillIndiaBadge: true,
    languages: ['Marathi', 'Hindi'],
    wallet: {
      grossEarnings: 53800,
      availableBalance: 7300,
      patronageDividends: 4890,
      welfarePoints: 1250,
      emergencyFundReserved: 2100
    }
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-2026-01',
    title: 'Monsoon Safety Equipment & Tool Subsidy Grant',
    titleHi: 'मानसून सुरक्षा किट एवं उपकरण अनुदान',
    category: 'Welfare & Safety',
    proposedBy: 'Worker Advisory Council (Pune Central)',
    description: 'Allocate ₹1,85,000 from the Collective Welfare Reserve to distribute insulated boots, raincoat gear, and surge testers to 200 active electrical & plumbing workers.',
    status: 'active', // 'active' | 'passed' | 'rejected'
    yesVotes: 142,
    noVotes: 11,
    totalEligibleVoters: 180,
    deadline: '2026-09-15',
    fundImpact: '₹1,85,000 from Welfare Reserve',
    hasVoted: false
  },
  {
    id: 'prop-2026-02',
    title: 'Revision of Base Floor Wage for Emergency Night Dispatches (8 PM - 6 AM)',
    titleHi: 'रात्रिकालीन आपातकालीन सेवा न्यूनतम दर में वृद्धि',
    category: 'Pricing & Wages',
    proposedBy: 'HVAC & Electrical Guild',
    description: 'Mandate a minimum 25% hazard & overtime surge on all night calls, 100% of which directly flows to the on-duty worker.',
    status: 'active',
    yesVotes: 168,
    noVotes: 4,
    totalEligibleVoters: 180,
    deadline: '2026-09-01',
    fundImpact: '+25% direct worker payout increment',
    hasVoted: true
  },
  {
    id: 'prop-2026-03',
    title: 'Zero-Interest Micro-Credit Facility for Electric Bike Purchase',
    titleHi: 'ई-बाइक खरीद हेतु ब्याज मुक्त माइक्रो-लोन योजना',
    category: 'Green Mobility & Loans',
    proposedBy: 'Board of Directors',
    description: 'Partner with District Cooperative Bank to offer ₹40,000 zero-interest soft loans to high-performing gig workers for transitioning to EV two-wheelers.',
    status: 'passed',
    yesVotes: 174,
    noVotes: 6,
    totalEligibleVoters: 180,
    deadline: '2026-08-10',
    fundImpact: 'Cooperative Credit Guarantee backed by PACS',
    hasVoted: true
  }
];

export const INITIAL_DISPUTES = [
  {
    id: 'disp-801',
    bookingId: 'BK-9912',
    customerName: 'Dr. Alok Verma',
    workerName: 'Vikram Singh',
    service: 'AC Jet Servicing',
    amount: 599,
    date: '2026-08-21',
    issueCategory: 'Quality of Service',
    description: 'Customer claims water leakage occurred from indoor unit 2 hours after service.',
    workerStatement: 'Drain pipe was cleared and inspected with video proof. Leakage appears from internal wall condensation crack.',
    evidenceUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'],
    status: 'pending_jury',
    juryMembers: ['Sunita Patil (Peer)', 'Mohammad Tariq (Peer)', 'Coop Mediator'],
    verdict: null
  },
  {
    id: 'disp-802',
    bookingId: 'BK-9854',
    customerName: 'Meera Deshmukh',
    workerName: 'Anand Shinde',
    service: 'Door Lock Repair',
    amount: 399,
    date: '2026-08-18',
    issueCategory: 'Billing Transparency',
    description: 'Additional hardware charge of ₹120 charged on site.',
    workerStatement: 'Uploaded merchant invoice for brass cylinder lock replaced with customer oral consent.',
    status: 'resolved_mutual',
    verdict: 'Cooperative reimbursed ₹120 hardware cost from warranty pool. 5-star rating restored to worker.'
  }
];

export const COOP_WELFARE_METRICS = {
  totalReserveFund: 1485200, // ₹14.85 Lakhs
  healthInsuranceClaimsSettled: 42,
  toolSubsidiesDisbursed: 118,
  emergencyFamilyAssistanceDisbursed: 18,
  averageWorkerHourlyUplift: 38.4, // +38.4% compared to standard aggregators
  platformTakeRate: 5.2, // only 5.2%
  workerTakeRate: 87.8,
  welfareTakeRate: 7.0,
  activeCooperativesFederated: 24,
  pacsConnectedCount: 68
};

export const MINISTRY_STATS = {
  registeredCooperatives: 148,
  totalRegisteredGigCooperatives: 148,
  nationalRegisteredCooperatives: 148,
  activeWorkers: 18450,
  totalEmpoweredWorkers: 18450,
  totalEmpoweredArtisans: 18450,
  welfareReserveFund: 1485200,
  patronageDividendsDistributed: 4280000,
  totalPatronageDividendsDistributed: 4280000,
  totalDividendsPaidOutToDate: 42800000, // ₹4.28 Crores
  capitalReturnedToWorkersCr: 84.6,
  intermediaryCommissionSavedCr: 19.8,
  nationalAverageSatisfaction: 4.88,
  stateCoverage: [
    { state: 'Maharashtra', cooperatives: 48, workers: 6200, welfareFund: '₹1.8 Cr', compliance: '98%' },
    { state: 'Karnataka', cooperatives: 32, workers: 4100, welfareFund: '₹1.2 Cr', compliance: '96%' },
    { state: 'Gujarat', cooperatives: 28, workers: 3800, welfareFund: '₹95 Lakh', compliance: '99%' },
    { state: 'Delhi NCR', cooperatives: 20, workers: 2600, welfareFund: '₹75 Lakh', compliance: '94%' },
    { state: 'Tamil Nadu', cooperatives: 14, workers: 1750, welfareFund: '₹58 Lakh', compliance: '97%' }
  ],
  commercialVsCoopComparison: {
    aggregatorWorkerCut: '65-72%',
    coopWorkerCut: '88-92%',
    aggregatorHealthCover: 'Conditional / Zero',
    coopHealthCover: '100% Guaranteed Cooperative Health Pool',
    governanceModel: 'Algorithmic Bans vs Democratic Peer Jury'
  }
};
