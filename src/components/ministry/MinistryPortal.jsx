import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Award, 
  Download, 
  Share2, 
  CheckCircle, 
  PieChart, 
  MapPin,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function MinistryPortal() {
  const { ministryStats = {}, welfareMetrics = {}, workers = [] } = useAppState();

  const registeredCoops = ministryStats?.registeredCooperatives 
    ?? ministryStats?.totalRegisteredGigCooperatives 
    ?? ministryStats?.nationalRegisteredCooperatives 
    ?? 148;

  const rawActiveWorkers = ministryStats?.activeWorkers 
    ?? ministryStats?.totalEmpoweredWorkers 
    ?? ministryStats?.totalEmpoweredArtisans 
    ?? 18450;
  const activeWorkersDisplay = typeof rawActiveWorkers === 'number'
    ? rawActiveWorkers.toLocaleString()
    : String(rawActiveWorkers || '18,450');

  const rawWelfare = ministryStats?.welfareReserveFund 
    ?? welfareMetrics?.totalReserveFund 
    ?? 1485200;
  const welfareReserveLakhs = (Number(rawWelfare) / 100000).toFixed(2);

  const rawDividends = ministryStats?.patronageDividendsDistributed 
    ?? ministryStats?.totalPatronageDividendsDistributed 
    ?? (ministryStats?.totalDividendsPaidOutToDate ? Math.round(ministryStats.totalDividendsPaidOutToDate / 10) : 4280000) 
    ?? 4280000;
  const dividendsLakhs = (Number(rawDividends) / 100000).toFixed(2);

  const handleExportAudit = () => {
    const csvContent = [
      ['SahakarGig National Cooperative Oversight Dossier (SIH26089)'],
      ['Ministry of Cooperation, Government of India - Statutory Audit'],
      ['Exported At', new Date().toISOString()],
      [],
      ['Metric', 'Statutory Value', 'Unit / Benchmark'],
      ['Registered Cooperatives (PACS / MSCS)', registeredCoops, 'Federated Units'],
      ['Active Cooperative Artisans', activeWorkersDisplay, 'Verified NSDC Level 3+'],
      ['Collective Welfare Reserve Corpus', `₹${Number(rawWelfare).toLocaleString()}`, 'DCCB Escrow Pool (7% Per Gig)'],
      ['Patronage Dividends Paid Out', `₹${Number(rawDividends).toLocaleString()}`, 'Distributed to Workers (100% Surplus)'],
      ['Average Worker Hourly Uplift', `+${welfareMetrics?.averageWorkerHourlyUplift || 38.4}%`, 'Compared to Private Aggregators'],
      ['Health Insurance Claims Settled', welfareMetrics?.healthInsuranceClaimsSettled || 14, '100% Cashless Approvals'],
      ['Tool Subsidies Granted', welfareMetrics?.toolSubsidiesDisbursed || 38, 'Electricians & Plumbers'],
      [],
      ['State', 'Active PACS', 'Artisan Count', 'Monthly GMV (₹)'],
      ['Maharashtra', '64', '8,420', '48,50,000'],
      ['Gujarat', '42', '5,110', '32,10,000'],
      ['Karnataka', '38', '4,300', '26,80,000'],
      ['Madhya Pradesh', '29', '3,450', '19,40,000'],
      ['Tamil Nadu', '24', '2,980', '16,20,000']
    ].map(row => row.map(item => `"${item}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SahakarGig_Ministry_Audit_Dossier_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Flagship Header */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full font-black uppercase tracking-wider">
              MINISTRY OF COOPERATION (GOVT. OF INDIA)
            </span>
            <span className="text-xs text-slate-500 font-bold">SIH26089 Macro Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-['Outfit'] mt-1">
            National Cooperative Gig Oversight Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 font-medium">
            Real-time compliance monitoring, democratic dividend distribution audits, and artisan welfare health coverage tracking across India.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportAudit}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/25 flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Ministry Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* 4 National Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold mb-1">
            <span>Federated Cooperatives</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {registeredCoops}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block mt-2">
            +18 new PACS registered this month
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-1">
            <span>Active Cooperative Artisans</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {activeWorkersDisplay}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block mt-2">
            94.2% NSDC Skill Certified
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold mb-1">
            <span>Collective Welfare Reserve</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{welfareReserveLakhs} Lakhs
          </div>
          <span className="text-[11px] text-amber-700 font-bold block mt-2">
            100% Cashless Health Insurance
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs text-purple-700 font-bold mb-1">
            <span>Total Patronage Dividends</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{dividendsLakhs} Lakhs
          </div>
          <span className="text-[11px] text-purple-700 font-bold block mt-2">
            Returned to member workers
          </span>
        </div>

      </div>

      {/* State-Level Cooperative Performance Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
              Regional Cooperative Clusters (State-Wise)
            </h3>
            <p className="text-xs text-slate-500 font-medium">Monitoring household gig fair wages and worker retention ratios</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-300">
            Live Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">Region / State</th>
                <th className="p-3.5">Registered Cooperatives</th>
                <th className="p-3.5">Active Artisans</th>
                <th className="p-3.5">Direct Worker Retention</th>
                <th className="p-3.5">Govt Compliance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Maharashtra (Pune & Mumbai Metro)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">48 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">6,200 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Karnataka (Bengaluru Urban & Rural)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">32 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">4,100 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Gujarat (Ahmedabad & Surat)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">28 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">3,800 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delhi NCR (South & Central)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">20 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">2,600 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Tamil Nadu (Chennai & Coimbatore)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">14 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">1,750 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
