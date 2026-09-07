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
  HeartHandshake
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { calculateInvoiceBreakdown } from '../../services/dividendLedger';
import { getTranslation } from '../../services/translations';

export function ServiceGrid({ onSelectService, onOpenPriceModal }) {
  const { services, language } = useAppState();
  const [selectedCategory, setSelectedCategory] = useState('All services');
  const [searchQuery, setSearchQuery] = useState('');
  const [sliderAmount, setSliderAmount] = useState(500);

  const t = getTranslation(language);

  const categories = language === 'hi' ? [
    'सभी सेवाएं', 
    'आवश्यक मरम्मत', 
    'उपकरण सेवा', 
    'गृह स्वच्छता', 
    'विशेष कारीगरी', 
    'देखभाल सेवाएं'
  ] : [
    'All services', 
    'Essential Maintenance', 
    'Appliance Care', 
    'Housekeeping', 
    'Specialized Trades', 
    'Care Services'
  ];

  // Exact 8 Services mapping with English & Hindi support
  const sampleServices = [
    {
      id: 'plumbing',
      title: language === 'hi' ? 'प्लंबिंग एवं जल प्रणाली' : 'Plumbing & Water Systems',
      description: language === 'hi' ? 'पाइप लीकेज, बाथरूम फिटिंग, नल बदलना, ड्रेनेज सफाई।' : 'Pipe leakage repair, bathroom fittings, tap replacement, drainage clearing.',
      basePrice: 349,
      popular: true,
      iconType: 'droplet',
      chips: language === 'hi' ? ['नल एवं पाइप रिपेयर', 'बाथरूम फिटिंग'] : ['Tap & Pipe Fix', 'Bathroom Fitting'],
      category: 'Essential Maintenance',
      categoryHi: 'आवश्यक मरम्मत'
    },
    {
      id: 'electrical',
      title: language === 'hi' ? 'इलेक्ट्रिकल एवं पावर सिस्टम्स' : 'Electrical & Power Systems',
      description: language === 'hi' ? 'शॉर्ट-सर्किट डायग्नोसिस, पंखा, गीजर और स्विचबोर्ड रिपेयर।' : 'Certified electricians for short-circuit diagnosis, fan and geyser repair.',
      basePrice: 399,
      popular: true,
      iconType: 'zap',
      chips: language === 'hi' ? ['शॉर्ट-सर्किट ठीक करें', 'पंखा / गीजर रिपेयर'] : ['Short-circuit Fix', 'Fan / Geyser Repair'],
      category: 'Essential Maintenance',
      categoryHi: 'आवश्यक मरम्मत'
    },
    {
      id: 'ac-repair',
      title: language === 'hi' ? 'एसी सर्विस एवं क्लाइमेट टेक' : 'AC Service & Climate Tech',
      description: language === 'hi' ? 'इको-फ्रेंडली फोम जेट क्लीनिंग, कॉइल जांच, गैस रीफिलिंग।' : 'Eco-friendly foam jet AC cleaning, cooling coil diagnosis, gas refilling.',
      basePrice: 599,
      popular: true,
      iconType: 'rotate',
      chips: language === 'hi' ? ['फोम जेट वॉश', 'गैस रीफिल'] : ['Foam Jet Service', 'Gas Refill'],
      category: 'Appliance Care',
      categoryHi: 'उपकरण सेवा'
    },
    {
      id: 'deep-cleaning',
      title: language === 'hi' ? 'संपूर्ण गृह स्वच्छता (डीप क्लीन)' : 'Deep House Sanitization',
      description: language === 'hi' ? 'रसोई और बाथरूम की मशीनीकृत डीप क्लीनिंग व सैनिटाइजेशन।' : 'Hospital-grade mechanized deep cleaning for kitchens and bathrooms.',
      basePrice: 499,
      popular: true,
      iconType: 'grid',
      chips: language === 'hi' ? ['किचन डीप क्लीन', 'बाथरूम डीप क्लीन'] : ['Kitchen Deep Clean', 'Bathroom Deep Clean'],
      category: 'Housekeeping',
      categoryHi: 'गृह स्वच्छता'
    },
    {
      id: 'carpentry',
      title: language === 'hi' ? 'बढ़ईगीरी एवं काष्ठशिल्प' : 'Carpentry & Woodcraft',
      description: language === 'hi' ? 'लॉक लगाना, दरवाजे का संरेखण, मॉड्यूलर फर्नीचर फिटिंग।' : 'Skilled woodworkers for lock installations, door alignments, modular fittings.',
      basePrice: 399,
      popular: false,
      iconType: 'pen',
      chips: language === 'hi' ? ['डोर लॉक / लैच', 'कैबिनेट कब्जा +1'] : ['Door Lock / Latch', 'Cabinet Hinge +1'],
      category: 'Specialized Trades',
      categoryHi: 'विशेष कारीगरी'
    },
    {
      id: 'appliances',
      title: language === 'hi' ? 'प्रमुख घरेलू उपकरण रिपेयर' : 'Major Home Appliances',
      description: language === 'hi' ? 'फ्रिज, वाशिंग मशीन, माइक्रोवेव ओवन की तेज मरम्मत।' : 'Fast diagnostics for refrigerators, washing machines, microwave ovens.',
      basePrice: 449,
      popular: false,
      iconType: 'tv',
      chips: language === 'hi' ? ['वाशिंग मशीन मरम्मत', 'फ्रिज कूलिंग +1'] : ['Washing Machine Fix', 'Fridge Cooling +1'],
      category: 'Appliance Care',
      categoryHi: 'उपकरण सेवा'
    },
    {
      id: 'painting',
      title: language === 'hi' ? 'पेंटिंग एवं डैम्प प्रूफिंग' : 'Painting & Damp Treatment',
      description: language === 'hi' ? 'दीवार टच-अप, टेक्सचर पेंटिंग, एंटी-फंगल वाटरप्रूफिंग।' : 'Wall touch-ups, accent texture painting, anti-fungal waterproofing.',
      basePrice: 799,
      popular: false,
      iconType: 'brush',
      chips: language === 'hi' ? ['एक्सेंट वॉल पेंट', 'डैम्प प्रूफिंग'] : ['Accent Wall Paint', 'Damp Proofing'],
      category: 'Specialized Trades',
      categoryHi: 'विशेष कारीगरी'
    },
    {
      id: 'care',
      title: language === 'hi' ? 'वरिष्ठ नागरिक देखभाल एवं गतिशीलता' : 'Elder & Mobility Support',
      description: language === 'hi' ? 'डॉक्टर विजिट और घरेलू कार्यों में प्रशिक्षित सहकारी सहायता।' : 'Trained cooperative caregivers for doctor visits and mobility assistance.',
      basePrice: 349,
      popular: false,
      iconType: 'heart',
      chips: language === 'hi' ? ['डॉक्टर विजिट एस्कॉर्ट', 'दैनिक कार्य सहायता'] : ['Doctor Visit Escort', 'Errand Support'],
      category: 'Care Services',
      categoryHi: 'देखभाल सेवाएं'
    }
  ];

  const isAllSelected = selectedCategory === 'All services' || selectedCategory === 'सभी सेवाएं';

  const filteredServices = sampleServices.filter(s => {
    const matchesCat = isAllSelected || s.category === selectedCategory || s.categoryHi === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const breakdown = calculateInvoiceBreakdown(sliderAmount, { workerSharePercent: 88, welfareSharePercent: 7, platformSharePercent: 5 });

  const renderIcon = (type) => {
    switch (type) {
      case 'droplet': return <Droplet className="w-5 h-5 stroke-[1.5]" />;
      case 'zap': return <Zap className="w-5 h-5 stroke-[1.5]" />;
      case 'rotate': return <RotateCw className="w-5 h-5 stroke-[1.5]" />;
      case 'grid': return <LayoutGrid className="w-5 h-5 stroke-[1.5]" />;
      case 'pen': return <PenTool className="w-5 h-5 stroke-[1.5]" />;
      case 'tv': return <Tv className="w-5 h-5 stroke-[1.5]" />;
      case 'brush': return <Paintbrush className="w-5 h-5 stroke-[1.5]" />;
      case 'heart': return <Heart className="w-5 h-5 stroke-[1.5]" />;
      default: return <Droplet className="w-5 h-5 stroke-[1.5]" />;
    }
  };

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Section with Full Bilingual Translation */}
      <section className="pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-block px-3.5 py-1 rounded-full border border-[#D5CEBF] text-[11px] font-mono tracking-widest text-[#16202C] uppercase">
              {t.districtTag}
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-[#16202C] font-editorial leading-[1.08]">
              {t.heroHeadline1} <br />
              {t.heroHeadline2} <br />
              <span className="italic text-[#1B4D3E]">{t.heroHeadlineItalic}</span>
            </h1>

            {/* Paragraph */}
            <p className="text-sm sm:text-base text-slate-700 max-w-xl leading-relaxed font-normal">
              {t.heroDescription}
            </p>

            {/* Search Bar Dock */}
            <div className="pt-2 max-w-lg">
              <div className="flex rounded-lg overflow-hidden border border-[#D5CEBF] shadow-sm bg-white">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 px-4 py-3.5 text-xs sm:text-sm text-[#16202C] placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('catalog-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#1B4D3E] hover:bg-[#153D31] text-white text-xs font-medium transition"
                >
                  {t.searchBtn}
                </button>
              </div>
            </div>

            {/* 3 Stat Counters Below Search */}
            <div className="pt-4 grid grid-cols-3 gap-6 max-w-lg border-t border-[#EBE5D8]">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#16202C]">{t.stat1Val}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{t.stat1Label}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#16202C]">{t.stat2Val}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{t.stat2Label}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#16202C]">{t.stat3Val}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{t.stat3Label}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Urban Company Style Consumer Trust & Top Services Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-6">
              
              {/* Trust & Rating Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-sm font-black text-slate-900">4.88</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  25,000+ Happy Homes Served
                </span>
              </div>

              {/* Instant Category Shortcuts */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Most Booked This Week in Your Area:
                </span>

                <div 
                  onClick={() => {
                    const serv = services.find(s => s.id === 'electrical') || services[0];
                    onSelectService(serv);
                  }}
                  className="cursor-pointer p-3 rounded-2xl bg-[#FAF7F0] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        Electrician Inspection & Repair
                      </h4>
                      <p className="text-[11px] text-slate-500">Short-circuit, switches, fans</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#1B4D3E]">₹399</span>
                    <span className="text-[10px] text-slate-400 block">Book &rarr;</span>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    const serv = services.find(s => s.id === 'plumbing') || services[0];
                    onSelectService(serv);
                  }}
                  className="cursor-pointer p-3 rounded-2xl bg-[#FAF7F0] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚰</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        Plumbing & Tap Leakage Fix
                      </h4>
                      <p className="text-[11px] text-slate-500">Taps, blockages, fittings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#1B4D3E]">₹349</span>
                    <span className="text-[10px] text-slate-400 block">Book &rarr;</span>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    const serv = services.find(s => s.id === 'ac-repair') || services[0];
                    onSelectService(serv);
                  }}
                  className="cursor-pointer p-3 rounded-2xl bg-[#FAF7F0] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">❄️</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                        AC Foam-Jet Deep Service
                      </h4>
                      <p className="text-[11px] text-slate-500">Power jet wash, cooling test</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#1B4D3E]">₹599</span>
                    <span className="text-[10px] text-slate-400 block">Book &rarr;</span>
                  </div>
                </div>
              </div>

              {/* Quality Guarantee Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  15-Min Doorstep Arrival
                </span>
                <span className="font-medium">30-Day Guarantee</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Interactive Passbook Section */}
      <section id="where-money-goes" className="pt-8 pb-4 space-y-6">
        
        {/* Section Header */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">
            {t.passbookTag}
          </div>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#16202C] font-editorial">
            {t.passbookTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
            {t.passbookSubtitle}
          </p>
        </div>

        {/* Passbook Card */}
        <div className="passbook-card rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-lg">
          
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
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#16202C]">
                  {t.whatBookingPays.replace('{amount}', sliderAmount)}
                </h3>
              </div>

              {/* Big Navy Price Badge */}
              <div className="px-6 py-2 rounded-xl bg-[#16202C] text-white font-editorial text-2xl sm:text-3xl font-bold shadow-sm">
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
                className="w-full h-1.5 bg-[#EBE5D8] rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
              />
            </div>

            {/* 3 Ledger Entries */}
            <div className="space-y-4 pt-2">
              
              {/* Row 1: Worker Direct Payout */}
              <div className="flex items-center justify-between py-3 border-b border-[#F0ECE1]">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#1B4D3E] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#16202C]">
                      {t.workerDirectTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {t.workerDirectDesc}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-8 text-right">
                  <span className="text-xs font-mono text-slate-400">88%</span>
                  <span className="text-xl sm:text-2xl font-bold font-editorial text-[#16202C] min-w-[70px]">
                    ₹{breakdown.workerPayout}
                  </span>
                </div>
              </div>

              {/* Row 2: Welfare & Health Pool */}
              <div className="flex items-center justify-between py-3 border-b border-[#F0ECE1]">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C05621] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#16202C]">
                      {t.welfarePoolTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {t.welfarePoolDesc}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-8 text-right">
                  <span className="text-xs font-mono text-slate-400">7%</span>
                  <span className="text-xl sm:text-2xl font-bold font-editorial text-[#16202C] min-w-[70px]">
                    ₹{breakdown.welfareFundContribution}
                  </span>
                </div>
              </div>

              {/* Row 3: Platform IT & Operations */}
              <div className="flex items-center justify-between py-3 border-b border-[#F0ECE1]">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#4A5568] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#16202C]">
                      {t.platformOpsTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {t.platformOpsDesc}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-8 text-right">
                  <span className="text-xs font-mono text-slate-400">5%</span>
                  <span className="text-xl sm:text-2xl font-bold font-editorial text-[#16202C] min-w-[70px]">
                    ₹{breakdown.platformMaintenance}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Audit Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1B4D3E] bg-[#FAF7F0] text-[11px] font-mono text-[#1B4D3E]">
                <span>{t.auditBadge}</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 3. Category Filter Tabs & 8 Service Cards Grid */}
      <section id="catalog-grid" className="pt-8 pb-12 space-y-8">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#16202C] text-white shadow-sm'
                  : 'bg-white border border-[#D5CEBF] text-[#16202C] hover:bg-[#EFEAE1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 8 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => {
            const rawServiceObj = services.find(s => s.id === service.id) || services[0];
            return (
              <div
                key={service.id}
                className="paper-card rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & POPULAR Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full border border-[#16202C] flex items-center justify-center text-[#16202C]">
                      {renderIcon(service.iconType)}
                    </div>
                    {service.popular && (
                      <span className="text-[9px] font-mono tracking-widest text-[#C05621] uppercase border border-[#F6AD55] px-2 py-0.5 rounded-full">
                        {t.popular}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold font-editorial text-[#16202C]">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Sub-Service Chips */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {service.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#FAF7F0] border border-[#EBE5D8] text-slate-700 px-2.5 py-1 rounded-md font-mono"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Starts from & Arrow Button */}
                <div className="mt-8 pt-4 border-t border-dashed border-[#EBE5D8] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                      {t.startsFrom}
                    </span>
                    <div className="text-xl font-bold font-editorial text-[#16202C]">
                      ₹{service.basePrice}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      {t.workerShareTag}
                    </span>
                  </div>

                  {/* Circular Navy Arrow Action Button */}
                  <button
                    onClick={() => onSelectService(rawServiceObj)}
                    className="w-10 h-10 rounded-full bg-[#16202C] hover:bg-[#1B4D3E] text-white flex items-center justify-center shadow-sm transition-colors"
                    title={`Book ${service.title}`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
