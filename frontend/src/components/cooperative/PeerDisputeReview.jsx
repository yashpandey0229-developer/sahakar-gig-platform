import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Eye,
  Check
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function PeerDisputeReview() {
  const { disputes, resolveDispute, addNotification } = useAppState();
  const [selectedDispute, setSelectedDispute] = useState(disputes[0]);
  const [verdictInput, setVerdictInput] = useState('');

  const handleResolve = (actionType) => {
    let finalVerdict = '';
    if (actionType === 'reimburse_warranty') {
      finalVerdict = 'Resolved by 3-Peer Consensus: Reimbursed ₹120 to customer from Warranty Reserve. Worker rating preserved at 5.0.';
    } else if (actionType === 'uphold_worker') {
      finalVerdict = 'Resolved by 3-Peer Consensus: Work validated against standard ITI checklist. Claim closed with zero penalty to worker.';
    } else {
      finalVerdict = verdictInput || 'Mutual agreement reached between customer and cooperative delegate.';
    }

    resolveDispute(selectedDispute.id, finalVerdict);
    setSelectedDispute(prev => ({
      ...prev,
      status: 'resolved_mutual',
      verdict: finalVerdict
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
            JUSTICE & ARBITRATION
          </span>
          <span className="text-xs text-slate-400">Democratized Peer Review</span>
        </div>
        <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
          Peer-Jury Grievance Redressal Chamber
        </h2>
        <p className="text-xs text-slate-400">
          Commercial platforms use cold algorithms to de-platform workers without trial. In SahakarGig, disputes are heard fairly by a jury of fellow certified cooperative artisans.
        </p>
      </div>

      {/* Main Dispute Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Disputes List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Active Disputes & Hearings
          </h3>
          {disputes.map((d) => {
            const isSelected = selectedDispute?.id === d.id;
            return (
              <div
                key={d.id}
                onClick={() => setSelectedDispute(d)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-slate-850 border-amber-500/60 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    #{d.id} ({d.bookingId})
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    d.status === 'pending_jury'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {d.status === 'pending_jury' ? 'PENDING JURY' : 'RESOLVED'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{d.service} — {d.issueCategory}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Customer: <strong className="text-slate-300">{d.customerName}</strong> vs Worker: <strong className="text-slate-300">{d.workerName}</strong>
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Case Hearing & Jury Actions */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDispute ? (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold">Case #{selectedDispute.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedDispute.issueCategory}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500">Service Fee</span>
                  <div className="text-base font-black text-white">₹{selectedDispute.amount}</div>
                </div>
              </div>

              {/* Customer Statement */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-rose-400 block mb-1">
                  Customer Grievance ({selectedDispute.customerName}):
                </span>
                <p className="text-xs text-slate-300">
                  "{selectedDispute.description}"
                </p>
              </div>

              {/* Worker Statement */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  Worker Rebuttal ({selectedDispute.workerName}):
                </span>
                <p className="text-xs text-slate-300">
                  "{selectedDispute.workerStatement}"
                </p>
              </div>

              {/* Jury Panel Members */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Appointed 3-Member Peer Jury:
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                    🧑‍🔧 Sunita Patil (Master Cleaner)
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                    👨‍🔧 Mohammad Tariq (Master Plumber)
                  </span>
                  <span className="bg-purple-950/60 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-lg">
                    ⚖️ Cooperative Ombudsman
                  </span>
                </div>
              </div>

              {/* Verdict Status or Actions */}
              {selectedDispute.status === 'resolved_mutual' ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Case Formally Resolved & Signed</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    {selectedDispute.verdict}
                  </p>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Jury Voting & Consensus Verdict:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleResolve('reimburse_warranty')}
                      className="p-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold text-left transition"
                    >
                      🛡️ Settle from Warranty Reserve
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        Compensate customer; no demerit to worker.
                      </p>
                    </button>

                    <button
                      onClick={() => handleResolve('uphold_worker')}
                      className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-left transition"
                    >
                      ✅ Uphold Worker Standards
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        Technical inspection proves work was standard.
                      </p>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
              <p className="text-xs text-slate-400">Select a dispute from the left to review the hearing.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
