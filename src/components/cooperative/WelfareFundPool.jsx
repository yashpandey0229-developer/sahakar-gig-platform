import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HeartHandshake, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Activity, 
  Users, 
  FileText,
  Building,
  Plus
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function WelfareFundPool() {
  const { welfareMetrics, addNotification } = useAppState();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimBeneficiary, setClaimBeneficiary] = useState('Sunita Patil');
  const [claimType, setClaimType] = useState('Medical Reimbursement');
  const [claimAmount, setClaimAmount] = useState(15000);

  const handleDisburseClaim = (e) => {
    e.preventDefault();
    addNotification(
      'Welfare Claim Approved & Disbursed',
      `₹${claimAmount} for ${claimType} disbursed to ${claimBeneficiary} from Cooperative Emergency Reserve.`,
      'success'
    );
    setShowClaimModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              SOCIAL SAFETY NET
            </span>
            <span className="text-xs text-slate-400 font-medium">Auto-funded via 7% per gig</span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
            Cooperative Collective Welfare & Health Pool
          </h2>
          <p className="text-xs text-slate-400">
            Unlike commercial platforms with zero worker insurance, every gig completed legally strengthens our community safety corpus.
          </p>
        </div>

        <button
          onClick={() => setShowClaimModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Disburse Welfare Claim</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel border-emerald-500/30 rounded-2xl p-5">
          <span className="text-xs text-emerald-400 font-bold block mb-1">Total Welfare Corpus</span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{(welfareMetrics.totalReserveFund).toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Held in District Central Cooperative Bank
          </p>
        </div>

        <div className="glass-panel border-blue-500/30 rounded-2xl p-5">
          <span className="text-xs text-blue-400 font-bold block mb-1">Health Claims Settled</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-300">
            {welfareMetrics.healthInsuranceClaimsSettled} Claims
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            100% cashless hospitalizations approved
          </p>
        </div>

        <div className="glass-panel border-amber-500/30 rounded-2xl p-5">
          <span className="text-xs text-amber-400 font-bold block mb-1">Tool Subsidies Granted</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300">
            {welfareMetrics.toolSubsidiesDisbursed} Artisans
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Subsidized drills, multimeters & kits
          </p>
        </div>

        <div className="glass-panel border-purple-500/30 rounded-2xl p-5">
          <span className="text-xs text-purple-400 font-bold block mb-1">Worker Income Uplift</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-300">
            +{welfareMetrics.averageWorkerHourlyUplift}%
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Net hourly gain vs corporate aggregators
          </p>
        </div>

      </div>

      {/* Welfare Settlement History */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Recent Welfare Claims & Disbursals
          </h3>
          <span className="text-xs text-emerald-400 font-medium">Audited & Transparent</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                🏥
              </div>
              <div>
                <div className="font-bold text-white">Hospital Emergency Cover: Sunita Patil</div>
                <div className="text-[10px] text-slate-400">Claim #HC-409 | Sahyadri Hospital Pune | Surgery Support</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-400 text-sm">₹28,500</span>
              <span className="text-[10px] text-slate-500 block">Settled within 4 hrs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                🧰
              </div>
              <div>
                <div className="font-bold text-white">Insulated Heavy Tool Grant: Ramesh Jadhav</div>
                <div className="text-[10px] text-slate-400">Claim #TG-112 | 1000V Certified Testing Multimeter & Safety Gloves</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-amber-400 text-sm">₹4,200</span>
              <span className="text-[10px] text-slate-500 block">Cooperative Subsidy</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                🎓
              </div>
              <div>
                <div className="font-bold text-white">Children Education Scholarship Grant: Mohammad Tariq</div>
                <div className="text-[10px] text-slate-400">Claim #ED-089 | Polytechnic Diploma Tuition Support</div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-400 text-sm">₹12,000</span>
              <span className="text-[10px] text-slate-500 block">Approved by Board</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disburse Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Disburse Welfare Reserve Claim
            </h3>

            <form onSubmit={handleDisburseClaim} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Beneficiary Member</label>
                <input
                  type="text"
                  value={claimBeneficiary}
                  onChange={(e) => setClaimBeneficiary(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Claim Type</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white focus:outline-none bg-slate-900"
                >
                  <option value="Medical Reimbursement">Medical & Hospitalization Support</option>
                  <option value="Tool & Safety Subsidy">Tool & Safety Equipment Subsidy</option>
                  <option value="Emergency Family Loan">Zero-Interest Emergency Soft Loan</option>
                  <option value="Education Grant">Education & Skill Scholarship</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                >
                  Authorize Disbursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
