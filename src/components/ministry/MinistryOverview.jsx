import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  MapPin,
  FileSpreadsheet,
  Globe2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function MinistryOverview() {
  const { ministryStats, welfareMetrics } = useAppState();

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                MINISTRY OF COOPERATION • GOVT. OF INDIA
              </span>
              <span className="text-xs text-slate-300 font-medium">SIH26089 Smart Automation Oversight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-1">
              "Sahakar Se Samriddhi" National Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Macro-level real-time oversight of federated gig service cooperatives, PACS integration, worker income retention, and collective social security reserves.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-right">
            <span className="text-[10px] text-slate-400 block font-medium">National Dividend Distributed</span>
            <div className="text-2xl font-black text-amber-400">
              ₹{(ministryStats.totalDividendsPaidOutToDate / 10000000).toFixed(2)} Cr
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Audited on Public Ledger</span>
          </div>
        </div>
      </div>

      {/* 4 Macro Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
            <span>Federated Cooperatives</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {ministryStats.totalRegisteredGigCooperatives}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Registered under Multi-State Cooperative Societies Act
          </p>
        </div>

        <div className="glass-panel border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
            <span>Empowered Workers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-300">
            {ministryStats.totalEmpoweredWorkers.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Certified blue-collar artisans & technicians
          </p>
        </div>

        <div className="glass-panel border-blue-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1">
            <span>PACS Digital Hubs</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-300">
            68 PACS
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Village & town societies federated into platform
          </p>
        </div>

        <div className="glass-panel border-purple-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold mb-1">
            <span>Citizen Satisfaction</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-300">
            {ministryStats.nationalAverageSatisfaction} / 5.0
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Across 94,000+ completed household gigs
          </p>
        </div>

      </div>

      {/* State-Wise Cooperative Rollout Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-400" />
            State & District Cooperative Penetration Matrix
          </h3>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800">
            National Rollout Phase 2
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">State / Region</th>
                <th className="p-3">Active Cooperatives</th>
                <th className="p-3">Registered Artisans</th>
                <th className="p-3">Cumulative Welfare Corpus</th>
                <th className="p-3 rounded-r-xl">Coop Act Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ministryStats.stateCoverage.map((st) => (
                <tr key={st.state} className="hover:bg-slate-850/50 transition">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {st.state}
                  </td>
                  <td className="p-3 text-slate-300 font-semibold">{st.cooperatives} Societies</td>
                  <td className="p-3 text-emerald-400 font-semibold">{st.workers.toLocaleString()}</td>
                  <td className="p-3 text-amber-300 font-mono font-bold">{st.welfareFund}</td>
                  <td className="p-3 text-emerald-400 font-bold">{st.compliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structural Policy Flex: Cooperative Model vs Private Monopoly */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Socio-Economic Impact: Cooperative vs Extractive Monopoly Platform
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 block uppercase">
              1. Platform Take-Rate & Wages
            </span>
            <div className="space-y-1">
              <div className="text-rose-400 font-medium">Commercial Aggregators: 25% - 32% Cut</div>
              <div className="text-emerald-400 font-bold text-sm">SahakarGig: Capped 5% Ops Overhead</div>
              <p className="text-[11px] text-slate-400 pt-1">
                Workers retain ₹1,200 to ₹1,800 more per week, boosting household disposable income.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-blue-400 block uppercase">
              2. Social Security & Health
            </span>
            <div className="space-y-1">
              <div className="text-rose-400 font-medium">Commercial Aggregators: 0% Direct Welfare</div>
              <div className="text-blue-400 font-bold text-sm">SahakarGig: 7% Statutory Health Pool</div>
              <p className="text-[11px] text-slate-400 pt-1">
                Creates automatic cashless hospitalization and zero-interest soft loans for every worker.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-purple-400 block uppercase">
              3. Governance & Worker Rights
            </span>
            <div className="space-y-1">
              <div className="text-rose-400 font-medium">Commercial Aggregators: Algorithmic Bans</div>
              <div className="text-purple-400 font-bold text-sm">SahakarGig: Democratic Peer Jury & Votes</div>
              <p className="text-[11px] text-slate-400 pt-1">
                Decisions and tariff floors are voted on by workers, ensuring dignity of labor.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
