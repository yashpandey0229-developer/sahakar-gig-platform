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
  const { ministryStats, welfareMetrics, workers, proposals, disputes } = useAppState();

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
            onClick={() => alert('Exporting SIH Official Compliance Report as PDF...')}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/25 flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Ministry Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* 4 National Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between text-xs text-blue-700 font-bold mb-1">
            <span>Federated Cooperatives</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {ministryStats.registeredCooperatives}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block mt-2">
            +18 new PACS registered this month
          </span>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-1">
            <span>Active Cooperative Artisans</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {ministryStats.activeWorkers.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block mt-2">
            94.2% NSDC Skill Certified
          </span>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold mb-1">
            <span>Collective Welfare Reserve</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{(ministryStats.welfareReserveFund / 100000).toFixed(2)} Lakhs
          </div>
          <span className="text-[11px] text-amber-700 font-bold block mt-2">
            100% Cashless Health Insurance
          </span>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between text-xs text-purple-700 font-bold mb-1">
            <span>Total Patronage Dividends</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            ₹{(ministryStats.patronageDividendsDistributed / 100000).toFixed(2)} Lakhs
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
                <td className="p-3.5 text-slate-700 font-bold">42 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">4,820 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Karnataka (Bengaluru Urban & Rural)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">28 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">3,150 Artisans</td>
                <td className="p-3.5 text-emerald-700 font-black">88.0% Direct Pay</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">⭐⭐⭐⭐⭐ AAA (Optimal)</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Gujarat (Ahmedabad & Surat)
                </td>
                <td className="p-3.5 text-slate-700 font-bold">35 Societies</td>
                <td className="p-3.5 text-slate-900 font-black">2,900 Artisans</td>
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
