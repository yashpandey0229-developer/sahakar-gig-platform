import React, { useState } from 'react';
import { 
  Droplet, 
  Zap, 
  RotateCw, 
  LayoutGrid, 
  PenTool, 
  Tv, 
  Paintbrush, 
  Heart,
  ArrowRight,
  ShieldCheck,
  Star,
  Play,
  PhoneCall,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Award,
  Wrench,
  Search,
  ThumbsUp,
  Percent,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { calculateInvoiceBreakdown } from '../../services/dividendLedger';
import { getTranslation } from '../../services/translations';

export function ServiceGrid({ onSelectService, onOpenPriceModal }) {
  const { services, language } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sliderAmount, setSliderAmount] = useState(500);
  const [aboutTab, setAboutTab] = useState('approach'); // 'approach' | 'why' | 'mission'

  const t = getTranslation(language);

  // Modern Category Tabs matching the reference design
  const categoryFilters = [
    { id: 'All', labelEn: 'All Services', labelHi: 'सभी सेवाएं' },
    { id: 'Residential', labelEn: 'Residential', labelHi: 'घरेलू सेवाएं' },
    { id: 'Commercial', labelEn: 'Commercial & Societies', labelHi: 'व्यावसायिक व सोसायटी' },
    { id: 'Emergency', labelEn: 'Emergency 24/7', labelHi: 'आपातकालीन सेवाएं' }
  ];

  // 8 Core Services with Realistic Indian Worker Photography
  const sampleServices = [
    {
      id: 'electrical',
      title: language === 'hi' ? 'इलेक्ट्रिकल एवं पावर सिस्टम्स' : 'Electrical & Power Systems',
      description: language === 'hi' ? 'शॉर्ट-सर्किट डायग्नोसिस, पंखा, गीजर और स्विचबोर्ड रिपेयर।' : 'Certified electricians for short-circuit diagnosis, fan, geyser, and switchboard repair.',
      basePrice: 399,
      popular: true,
      iconType: 'zap',
      category: 'Residential',
      image: '/images/electrician.jpg',
      workerTitle: 'Ramesh Jadhav (12 yrs exp)',
      bullets: language === 'hi' 
        ? ['शॉर्ट-सर्किट ठीक करें', 'पंखा / गीजर रिपेयर', 'एमसीबी व वायरिंग टेस्ट']
        : ['Short-circuit & MCB Fix', 'Fan & Geyser Repair', 'Wiring & Safety Diagnosis']
    },
    {
      id: 'plumbing',
      title: language === 'hi' ? 'प्लंबिंग एवं जल प्रणाली' : 'Plumbing & Water Systems',
      description: language === 'hi' ? 'पाइप लीकेज, बाथरूम फिटिंग, नल बदलना, ड्रेनेज सफाई।' : 'Pipe leakage repair, bathroom fittings, tap replacement, drainage clearing.',
      basePrice: 349,
      popular: true,
      iconType: 'droplet',
      category: 'Residential',
      image: '/images/plumber.jpg',
      workerTitle: 'Santosh Shinde (9 yrs exp)',
      bullets: language === 'hi' 
        ? ['नल एवं पाइप रिपेयर', 'बाथरूम फिटिंग', 'ड्रेनेज चोक सफाई']
        : ['Tap & Pipe Fix', 'Bathroom Fittings', 'Drainage Unclogging']
    },
    {
      id: 'ac-repair',
      title: language === 'hi' ? 'एसी सर्विस एवं क्लाइमेट टेक' : 'AC Service & Climate Tech',
      description: language === 'hi' ? 'इको-फ्रेंडली फोम जेट क्लीनिंग, कॉइल जांच, गैस रीफिलिंग।' : 'Eco-friendly foam jet AC cleaning, cooling coil diagnosis, gas refilling.',
      basePrice: 599,
      popular: true,
      iconType: 'rotate',
      category: 'Residential',
      image: '/images/ac_service.jpg',
      workerTitle: 'Vikas Gaikwad (7 yrs exp)',
      bullets: language === 'hi' 
        ? ['फोम जेट पावर वॉश', 'गैस रीफिल व लीकेज', 'कूलिंग कॉइल सर्विस']
        : ['Foam Jet Power Wash', 'Gas Refill & Leak Check', 'Cooling Coil Servicing']
    },
    {
      id: 'deep-cleaning',
      title: language === 'hi' ? 'संपूर्ण गृह स्वच्छता (डीप क्लीन)' : 'Deep House Sanitization',
      description: language === 'hi' ? 'रसोई और बाथरूम की मशीनीकृत डीप क्लीनिंग व सैनिटाइजेशन।' : 'Hospital-grade mechanized deep cleaning for kitchens, bathrooms, and floors.',
      basePrice: 499,
      popular: true,
      iconType: 'grid',
      category: 'Residential',
      image: '/images/cleaning.jpg',
      workerTitle: 'Sunita Mane & Team',
      bullets: language === 'hi' 
        ? ['मशीनीकृत फ्लोर पॉलिश', 'किचन व बाथरूम डीप क्लीन', 'सैनिटाइजेशन ट्रीटमेंट']
        : ['Mechanized Floor Polish', 'Kitchen & Bath Deep Clean', 'Full Sanitization']
    },
    {
      id: 'carpentry',
      title: language === 'hi' ? 'बढ़ईगीरी एवं काष्ठशिल्प' : 'Carpentry & Woodcraft',
      description: language === 'hi' ? 'लॉक लगाना, दरवाजे का संरेखण, मॉड्यूलर फर्नीचर फिटिंग।' : 'Skilled woodworkers for lock installations, door alignments, modular fittings.',
      basePrice: 399,
      popular: false,
      iconType: 'pen',
      category: 'Residential',
      image: '/images/carpenter.jpg',
      workerTitle: 'Dinesh Sutar (14 yrs exp)',
      bullets: language === 'hi' 
        ? ['डोर लॉक व लैच फिटिंग', 'कैबिनेट व कब्ज़ा रिपेयर', 'मॉड्यूलर फर्नीचर असेंबली']
        : ['Door Lock & Latch Fitting', 'Cabinet & Hinge Fix', 'Modular Furniture Assembly']
    },
    {
      id: 'appliances',
      title: language === 'hi' ? 'प्रमुख घरेलू उपकरण रिपेयर' : 'Major Home Appliances',
      description: language === 'hi' ? 'फ्रिज, वाशिंग मशीन, माइक्रोवेव ओवन की तेज मरम्मत।' : 'Fast diagnostics for refrigerators, washing machines, microwave ovens.',
      basePrice: 449,
      popular: false,
      iconType: 'tv',
      category: 'Commercial',
      image: '/images/appliance.jpg',
      workerTitle: 'Pramod Kulkarni (11 yrs exp)',
      bullets: language === 'hi' 
        ? ['वाशिंग मशीन ड्रम/मोटर', 'फ्रिज कूलिंग डायग्नोसिस', 'माइक्रोवेव व ओवन रिपेयर']
        : ['Washing Machine Motor', 'Fridge Cooling Diagnosis', 'Microwave & Oven Fix']
    },
    {
      id: 'painting',
      title: language === 'hi' ? 'पेंटिंग एवं डैम्प प्रूफिंग' : 'Painting & Damp Treatment',
      description: language === 'hi' ? 'दीवार टच-अप, टेक्सचर पेंटिंग, एंटी-फंगल वाटरप्रूफिंग।' : 'Wall touch-ups, accent texture painting, anti-fungal waterproofing.',
      basePrice: 799,
      popular: false,
      iconType: 'brush',
      category: 'Commercial',
      image: '/images/carpenter.jpg',
      workerTitle: 'Mahesh Chavan & Team',
      bullets: language === 'hi' 
        ? ['एक्सेंट वॉल पेंटिंग', 'डैम्प व सीलन प्रूफिंग', 'एंटी-फंगल प्राइमर ट्रीटमेंट']
        : ['Accent Wall Painting', 'Damp & Seepage Treatment', 'Anti-Fungal Primer Coating']
    },
    {
      id: 'care',
      title: language === 'hi' ? 'आपातकालीन सहायता एवं 24/7 SOS' : 'Emergency 24/7 Doorstep SOS',
      description: language === 'hi' ? 'शॉर्ट-सर्किट, पाइप फटना व लॉक ब्रेकडाउन पर 15-मिनट आपातकालीन सेवा।' : 'Urgent 15-min doorstep dispatch for pipe bursts, power blackout, and lockout.',
      basePrice: 499,
      popular: true,
      iconType: 'heart',
      category: 'Emergency',
      image: '/images/worker_about.jpg',
      workerTitle: 'Cooperative Rapid Response',
      bullets: language === 'hi' 
        ? ['15-मिनट रैपिड डिस्पैच', 'रात में 24/7 इमरजेंसी सपोर्ट', '112 व कोऑपरेटिव हेल्पलाइन']
        : ['15-Min Rapid Dispatch', '24/7 Nighttime Support', '112 Emergency Integration']
    }
  ];

  const SERVICE_KEYWORDS = {
    electrical: [
      'electrician', 'electricna', 'electrcian', 'electrition', 'electrical', 'electric', 'elect',
      'bijli', 'wire', 'wiring', 'switch', 'socket', 'plug', 'mcb', 'fuse', 'light', 'bulb', 'tube',
      'fan', 'ceiling fan', 'geyser', 'water heater', 'inverter', 'short circuit', 'current', 'shock',
      'इलेक्ट्रिशियन', 'इलेक्ट्रिकल', 'बिजली', 'वायरिंग', 'पंखा', 'गीजर', 'स्विच', 'शॉर्ट सर्किट'
    ],
    plumbing: [
      'plumber', 'plumbing', 'plamber', 'pipe', 'leak', 'leakage', 'tap', 'nal', 'pani', 'water',
      'drain', 'drainage', 'choke', 'toilet', 'flush', 'sink', 'basin', 'bathroom', 'shower', 'jet spray',
      'motor', 'pump', 'water tank', 'tank', 'प्लंबर', 'प्लंबिंग', 'नल', 'पाइप', 'लीकेज', 'पानी', 'ड्रेनेज'
    ],
    'ac-repair': [
      'ac', 'ac service', 'ac repair', 'air conditioner', 'cooling', 'cool', 'gas', 'gas refill',
      'compressor', 'cooling coil', 'foam jet', 'filter', 'hawa', 'split ac', 'window ac',
      'एसी', 'एयर कंडीशनर', 'कूलिंग', 'गैस', 'सर्विसिंग'
    ],
    'deep-cleaning': [
      'clean', 'cleaning', 'safai', 'deep clean', 'sanitization', 'sanitize', 'house cleaning',
      'home cleaning', 'kitchen cleaning', 'bathroom cleaning', 'floor', 'polish', 'sofa', 'carpet',
      'pest', 'सफाई', 'क्लीनिंग', 'डीप क्लीन', 'स्वच्छता'
    ],
    carpentry: [
      'carpenter', 'carpentry', 'wood', 'wooden', 'woodcraft', 'furniture', 'door', 'darwaja',
      'lock', 'latch', 'hinge', 'kabbja', 'cabinet', 'modular', 'bed', 'sofa repair', 'table', 'chair',
      'badhai', 'lakdi', 'बढ़ई', 'फर्नीचर', 'दरवाजा', 'लकड़ी', 'काष्ठशिल्प'
    ],
    appliances: [
      'appliance', 'appliances', 'fridge', 'refrigerator', 'washing machine', 'machine', 'microwave',
      'oven', 'cooler', 'tv', 'television', 'repairs', 'उपकरण', 'फ्रिज', 'वाशिंग मशीन'
    ],
    painting: [
      'paint', 'painting', 'painter', 'color', 'colour', 'wall', 'primer', 'waterproofing', 'waterproof',
      'damp', 'seepage', 'texture', 'distemper', 'putty', 'whitewash', 'पेंटिंग', 'रंग', 'पुट्टी', 'सीलन'
    ],
    care: [
      'emergency', 'sos', 'urgent', 'help', 'rapid', 'blackout', 'burst', 'safety', 'night', '24/7',
      'आपातकालीन', 'इमरजेंसी', 'मदद', 'सहायता'
    ]
  };

  const isServiceMatchingQuery = (service, queryStr) => {
    if (!queryStr) return true;
    const q = queryStr.trim().toLowerCase();
    if (!q) return true;
    
    if (service.title.toLowerCase().includes(q)) return true;
    if (service.description.toLowerCase().includes(q)) return true;
    if (service.id.toLowerCase().includes(q)) return true;
    if (service.category.toLowerCase().includes(q)) return true;
    if (service.workerTitle && service.workerTitle.toLowerCase().includes(q)) return true;
    if (service.bullets && service.bullets.some(b => b.toLowerCase().includes(q))) return true;

    const keywords = SERVICE_KEYWORDS[service.id] || [];
    return keywords.some(k => k.includes(q) || q.includes(k));
  };

  const filteredServices = sampleServices.filter(s => {
    const matchesSearch = isServiceMatchingQuery(s, searchQuery);
    const matchesCat = searchQuery.trim() ? true : (selectedCategory === 'All' || s.category === selectedCategory);
    return matchesCat && matchesSearch;
  });

  const breakdown = calculateInvoiceBreakdown(sliderAmount, { workerSharePercent: 88, welfareSharePercent: 7, platformSharePercent: 5 });

  const renderIcon = (type) => {
    switch (type) {
      case 'droplet': return <Droplet className="w-5 h-5 stroke-[2]" />;
      case 'zap': return <Zap className="w-5 h-5 stroke-[2]" />;
      case 'rotate': return <RotateCw className="w-5 h-5 stroke-[2]" />;
      case 'grid': return <LayoutGrid className="w-5 h-5 stroke-[2]" />;
      case 'pen': return <PenTool className="w-5 h-5 stroke-[2]" />;
      case 'tv': return <Tv className="w-5 h-5 stroke-[2]" />;
      case 'brush': return <Paintbrush className="w-5 h-5 stroke-[2]" />;
      case 'heart': return <Heart className="w-5 h-5 stroke-[2]" />;
      default: return <Droplet className="w-5 h-5 stroke-[2]" />;
    }
  };

  return (
    <div className="space-y-16">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Hendy Style with Indian Artisan Cutout) */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#111C26] text-white p-6 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        
        {/* Background Decorative Blobs & Shapes */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-blue-600/20 via-emerald-600/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Typography, Badge & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Cooperative Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>GOVERNMENT REGISTERED COOPERATIVE NETWORK</span>
            </div>

            {/* Main Catchy Headline (Hendy Style) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-['Outfit'] text-white tracking-tight leading-[1.05]">
              Need Help? <br />
              Book <span className="text-amber-400 italic">Sahakar.</span>
            </h1>

            {/* Sub-Card with Thumbs-up Icon */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
                👍
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Book A Certified Sahakari Artisan.</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Get your "Do It Later" home repair list done now with 100% verified local professionals.
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Book A Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const serv = services[0];
                  onOpenPriceModal(serv, 500);
                }}
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition flex items-center gap-2"
              >
                <Percent className="w-4 h-4 text-emerald-400" />
                <span>See 88% Direct Split</span>
              </button>
            </div>

            {/* Search Dock with Instant Quick-Book Dropdown & Chips */}
            <div className="pt-2 max-w-xl relative">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center rounded-2xl bg-slate-900/90 border border-slate-700/80 p-1.5 shadow-inner focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition"
              >
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'hi' ? "इलेक्ट्रीशियन, प्लंबर, एसी सर्विस, बढ़ई खोजें..." : "Search electrician, plumber, AC service, carpenter..."}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-white mr-1"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition shadow-sm flex items-center gap-1"
                >
                  <span>Search</span>
                </button>
              </form>

              {/* Instant Quick-Search Booking Dropdown Popup */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl p-3 shadow-2xl border-2 border-emerald-500/30 text-slate-900 z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Matching Services ({filteredServices.length} found)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[11px] text-slate-400 hover:text-slate-700 font-bold"
                    >
                      Close ✕
                    </button>
                  </div>

                  {filteredServices.length > 0 ? (
                    <div className="divide-y divide-slate-100 py-1">
                      {filteredServices.map((service) => {
                        const rawServiceObj = services.find(s => s.id === service.id) || services[0];
                        return (
                          <div 
                            key={service.id} 
                            className="p-3 hover:bg-slate-50 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                                {renderIcon(service.iconType)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                  {service.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                  <span className="font-bold text-emerald-700 font-mono">₹{service.basePrice} starting</span>
                                  <span>•</span>
                                  <span className="text-slate-600 font-medium">{service.workerTitle}</span>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-bold">88% to artisan</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectService(rawServiceObj);
                                  setSearchQuery('');
                                }}
                                className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143a2f] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition"
                              >
                                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>Book Service</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <p className="text-xs text-slate-500">
                        No direct match found for "<span className="font-bold text-slate-800">{searchQuery}</span>".
                      </p>
                      <div className="text-[11px] font-bold text-slate-600">Quick Book Popular Services:</div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const elect = services.find(s => s.id === 'electrical') || services[0];
                            onSelectService(elect);
                            setSearchQuery('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>⚡ Book Electrician</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const plumb = services.find(s => s.id === 'plumbing') || services[0];
                            onSelectService(plumb);
                            setSearchQuery('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>💧 Book Plumber</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Search Chips below Search Dock */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mr-1">
                  Popular:
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('electrician')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <span>⚡ Electrician</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('plumber')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <span>💧 Plumber</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('ac')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <span>❄️ AC Repair</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('cleaning')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <span>🧹 Cleaning</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('carpenter')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-[11px] font-bold transition flex items-center gap-1"
                >
                  <span>🪚 Carpenter</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Giant Circular Cutout with Realistic Indian Artisan Photo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            
            {/* Background circular glow ring */}
            <div className="relative">
              
              {/* Giant Circular Frame */}
              <div className="w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] rounded-full overflow-hidden border-8 border-white/20 shadow-2xl relative bg-slate-800">
                <img 
                  src="/images/hero_artisan.jpg" 
                  alt="Verified Indian Handyman Artisan"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
                />
              </div>

              {/* Floating Dark Blue Badge (Hendy Style: "Start $199 /mon") */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-8 bg-blue-600 border-4 border-white text-white p-4 rounded-3xl shadow-2xl text-center animate-in zoom-in-95">
                <span className="text-[10px] font-mono tracking-widest uppercase block text-blue-200">
                  STARTING AT
                </span>
                <span className="text-2xl font-black font-['Outfit'] block text-white">
                  ₹199
                </span>
                <span className="text-[10px] text-blue-100 font-bold block">
                  0% Commission
                </span>
              </div>

              {/* Floating Gold Speed Pill */}
              <div className="absolute top-6 -right-4 sm:-right-6 bg-amber-400 border-4 border-slate-900 text-slate-950 px-4 py-2 rounded-2xl shadow-xl font-black text-xs flex items-center gap-1.5 animate-bounce">
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>10-Min Radar Arrival</span>
              </div>

              {/* Scroll Down Indicator */}
              <button
                onClick={() => {
                  const el = document.getElementById('catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden sm:flex absolute -bottom-6 right-8 w-12 h-12 rounded-full bg-amber-400 text-slate-950 items-center justify-center font-bold text-sm shadow-xl hover:bg-amber-300 transition"
                title="Scroll Down to Services"
              >
                ↓
              </button>

            </div>

          </div>

        </div>

        {/* Bottom Hero Sub-Navigation Strip (Matching Hendy Reference) */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          
          <button 
            onClick={() => {
              const serv = services[0];
              onOpenPriceModal(serv, 500);
            }}
            className="flex items-center gap-2 text-white font-bold hover:text-amber-400 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
            <span>How Cooperative Works (88% Model)</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">★★★★★</span>
              <span className="font-bold text-white">4.92 / 5</span>
              <span className="text-slate-400">(25,000+ Pune Citizens)</span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pune • Mumbai • Pimpri-Chinchwad Coops</span>
            </div>
          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* 2. SERVICES SHOWCASE (Hendy Style with Indian Workers Photos) */}
      {/* ========================================================= */}
      <section id="catalog-grid" className="pt-4 space-y-8">
        
        {/* Section Header with Category Tabs & 25% Off Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          
          <div className="space-y-2">
            <span className="text-xs font-mono font-black tracking-widest text-[#1B4D3E] uppercase bg-emerald-100 px-3 py-1 rounded-full">
              SERVICES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              Professional Sahakar Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Verified local technicians certified by cooperative federations. 100% background checked, doorstep safe, and zero corporate middleman markup.
            </p>
          </div>

          {/* Right Side Promotion Badges (Matching Hendy Reference) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('where-money-goes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs transition shadow-sm"
            >
              Pricing List (88% Split)
            </button>

            <div className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-center shadow-md">
              <span className="text-xs font-black block">25% Cheaper</span>
              <span className="text-[10px] text-blue-100 font-medium block">0% Aggregator Cut</span>
            </div>
          </div>

        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#111C26] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {language === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Active Search Filter Banner */}
        {searchQuery.trim() && (
          <div className="p-3.5 px-5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between text-xs animate-in fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">🔎</span>
              <span className="font-bold text-slate-900">
                Found <span className="text-amber-800 font-mono font-black">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search / Show All</span>
            </button>
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-black text-slate-900">
              No services found for "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find an exact match. You can clear your search or book one of our most requested cooperative services below:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition"
              >
                Show All Services
              </button>
              <button
                onClick={() => {
                  const elect = services.find(s => s.id === 'electrical') || services[0];
                  onSelectService(elect);
                }}
                className="px-5 py-2.5 rounded-2xl bg-amber-400 text-slate-950 text-xs font-black hover:bg-amber-300 transition"
              >
                ⚡ Book Electrician
              </button>
              <button
                onClick={() => {
                  const plumb = services.find(s => s.id === 'plumbing') || services[0];
                  onSelectService(plumb);
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#1B4D3E] text-white text-xs font-black hover:bg-[#143a2f] transition"
              >
                💧 Book Plumber
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => {
              const rawServiceObj = services.find(s => s.id === service.id) || services[0];
              return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#1B4D3E] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Real Indian Worker Photo Container */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-white/90 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Artisan</span>
                      </span>

                      {service.popular && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full shadow-sm">
                          POPULAR
                        </span>
                      )}
                    </div>

                    {/* Bottom Info on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{service.workerTitle}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-black text-slate-900 font-['Outfit'] group-hover:text-[#1B4D3E] transition-colors leading-tight">
                      {service.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Bullets List (Matching Hendy Reference) */}
                    <div className="space-y-1 pt-1">
                      {service.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Book Button */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Starting at
                    </span>
                    <div className="text-xl font-black text-slate-900 font-['Outfit']">
                      ₹{service.basePrice}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      88% to artisan
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectService(rawServiceObj)}
                    className="px-4 py-2.5 rounded-2xl bg-[#111C26] group-hover:bg-[#1B4D3E] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                    title={`Book ${service.title}`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      </section>


      {/* ========================================================= */}
      {/* 3. ABOUT US & TRUST SECTION (Matching Hendy Reference)     */}
      {/* ========================================================= */}
      <section className="rounded-[2.5rem] bg-[#111C26] text-white p-6 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait Card of Indian Technician (thumbs up) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border-4 border-white/15 shadow-2xl bg-slate-800">
              <img 
                src="/images/worker_about.jpg" 
                alt="Verified Sahakar Worker"
                className="w-full h-[440px] sm:h-[480px] object-cover object-top"
              />

              {/* Floating Yellow Metric Badge (Hendy Style: 300+ Projects Done) */}
              <div className="absolute bottom-6 left-6 right-6 bg-amber-400 text-slate-950 p-4 rounded-2xl shadow-xl font-['Outfit']">
                <span className="text-3xl font-black block">
                  300+ Artisans
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-slate-900 block mt-0.5">
                  25,000+ PROJECTS DONE IN PUNE
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Tabbed Content & Feature Blocks */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                ABOUT US
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mt-1">
                Professional Cooperative Services
              </h2>
            </div>

            {/* Interactive Tab Switcher (Matching Hendy Reference) */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded-2xl max-w-md border border-slate-700">
              <button
                onClick={() => setAboutTab('approach')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  aboutTab === 'approach'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Our Approach
              </button>
              <button
                onClick={() => setAboutTab('why')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  aboutTab === 'why'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Why Choose Us?
              </button>
              <button
                onClick={() => setAboutTab('mission')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  aboutTab === 'mission'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mission & Vision
              </button>
            </div>

            {/* Tab Text */}
            <div className="text-sm text-slate-300 leading-relaxed min-h-[70px]">
              {aboutTab === 'approach' && (
                <p>
                  Unlike private aggregators who take 30% to 40% corporate commissions, Sahakar is owned by the workers themselves. 88% goes directly to the technician's family, 7% provides cashless medical and accident cover, and 5% runs the public IT infrastructure.
                </p>
              )}
              {aboutTab === 'why' && (
                <p>
                  Every artisan is police-verified and Aadhaar-authenticated. We offer a 30-day rework warranty, transparent fixed pricing without surge rates, and 24/7 emergency 112 SOS integration directly at your doorstep.
                </p>
              )}
              {aboutTab === 'mission' && (
                <p>
                  Empowering 10 million Indian tradespeople with digital dignity, health security, and cooperative ownership, while providing Indian families with reliable, honest, and prompt home services.
                </p>
              )}
            </div>

            {/* Dual Trust Feature Blocks (Matching Hendy Reference) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">High Quality Work</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Certified technicians with standardized tools and 30-day warranty.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Qualified Local Team</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Police verified and registered with local cooperative societies.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* 4. TRANSPARENT PASSBOOK SECTION (Interactive 88% Slider)   */}
      {/* ========================================================= */}
      <section id="where-money-goes" className="pt-4 pb-4 space-y-6">
        
        {/* Section Header */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">
            {t.passbookTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#16202C] font-['Outfit'] tracking-tight">
            {t.passbookTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
            {t.passbookSubtitle}
          </p>
        </div>

        {/* Passbook Card */}
        <div className="passbook-card rounded-3xl overflow-hidden flex flex-col sm:flex-row shadow-xl border-2 border-slate-900">
          
          {/* Left Navy Ring-Binder Spine */}
          <div className="passbook-spine sm:w-14 w-full h-8 sm:h-auto shrink-0 border-r border-[#16202C]" />

          {/* Passbook White Body */}
          <div className="flex-1 p-6 sm:p-10 space-y-8 bg-white">
            
            {/* Top Gig Value Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block mb-1">
                  {t.sampleEntry}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#16202C]">
                  {t.whatBookingPays.replace('{amount}', sliderAmount)}
                </h3>
              </div>

              {/* Big Navy Price Badge */}
              <div className="px-6 py-2 rounded-2xl bg-[#16202C] text-white font-['Outfit'] text-2xl sm:text-3xl font-black shadow-md">
                ₹{sliderAmount}
              </div>
            </div>

            {/* Interactive Slider with Ticks */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{t.smallRepair}</span>
                <span>{t.deepClean}</span>
                <span>{t.majorRenovation}</span>
              </div>
              <input
                type="range"
                min="299"
                max="3000"
                step="25"
                value={sliderAmount}
                onChange={(e) => setSliderAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
              />
            </div>

            {/* 3 Ledger Entries */}
            <div className="space-y-4 pt-2">
              
              {/* Row 1: Worker Direct Payout */}
              <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-black text-[#16202C]">
                      {t.workerDirectTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {t.workerDirectDesc}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-8 text-right">
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">88%</span>
                  <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-emerald-800 min-w-[70px]">
                    ₹{breakdown.workerPayout}
                  </span>
                </div>
              </div>

              {/* Row 2: Welfare & Health Pool */}
              <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-black text-[#16202C]">
                      {t.welfarePoolTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {t.welfarePoolDesc}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-8 text-right">
                  <span className="text-xs font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">7%</span>
                  <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-amber-800 min-w-[70px]">
                    ₹{breakdown.welfareFundContribution}
                  </span>
                </div>
              </div>

              {/* Row 3: Platform IT & Operations */}
              <div className="flex items-center justify-between py-3.5 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-black text-[#16202C]">
                      {t.platformOpsTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {t.platformOpsDesc}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-8 text-right">
                  <span className="text-xs font-mono font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">5%</span>
                  <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-800 min-w-[70px]">
                    ₹{breakdown.platformMaintenance}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Audit Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-600 bg-emerald-50 text-[11px] font-mono text-emerald-800 font-bold">
                <span>{t.auditBadge}</span>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
