import React, { useState } from 'react';
import { 
  Building2, 
  Vote, 
  Scale, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  Plus, 
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function CooperativePortal() {
  const { proposals, voteOnProposal, disputes, resolveDispute, activeWorker } = useAppState();
  const [activeTab, setActiveTab] = useState('proposals');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [verdictText, setVerdictText] = useState('');

  const handleResolve = (e) => {
    e.preventDefault();
    if (!selectedDispute) return;
    resolveDispute(selectedDispute.id, verdictText || 'Resolved amicably by peer worker jury chamber with 50-50 goodwill settlement.');
    setSelectedDispute(null);
    setVerdictText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1 rounded-full font-black uppercase tracking-wider">
              DEMOCRATIC GOVERNANCE CHAMBER
            </span>
            <span className="text-xs text-slate-500 font-bold">1-Worker, 1-Vote Rule</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
            Pune Cooperative Board & Peer Jury
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('proposals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'proposals'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Policy Proposals ({proposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'disputes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Peer Jury Disputes ({disputes.filter(d => d.status === 'open_for_jury').length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-white border border-purple-200 rounded-3xl flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']">Democratic Policy Voting Chamber</h3>
              <p className="text-xs text-slate-600 font-medium">
                Every registered artisan has an equal democratic vote on pricing tiers, welfare allocations, and equipment grants.
              </p>
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 font-black px-4 py-2 rounded-2xl border border-purple-300">
              Active Voting Cycle: Q3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proposals.map((prop) => {
              const totalVotes = prop.yesVotes + prop.noVotes;
              const yesPercent = totalVotes > 0 ? Math.round((prop.yesVotes / totalVotes) * 100) : 0;
              return (
                <div key={prop.id} className="glass-card rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-300">
                        {prop.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {prop.daysLeft}d left
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 font-['Outfit'] mt-1">{prop.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {prop.description}
                    </p>

                    {/* Voting Progress */}
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-700 font-black">Yes: {prop.yesVotes} ({yesPercent}%)</span>
                        <span className="text-rose-700 font-black">No: {prop.noVotes} ({100 - yesPercent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        <div style={{ width: `${yesPercent}%` }} className="bg-emerald-500 rounded-l-full" />
                        <div style={{ width: `${100 - yesPercent}%` }} className="bg-rose-500 rounded-r-full" />
                      </div>
                      <div className="text-[10px] text-slate-400 text-right">Total votes cast: {totalVotes}</div>
                    </div>
                  </div>

                  {/* Vote Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                    {prop.hasVoted ? (
                      <div className="w-full py-2.5 bg-purple-50 text-purple-800 text-center text-xs font-black rounded-xl border border-purple-200">
                        ✓ Vote Recorded
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => voteOnProposal(prop.id, 'yes')}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition"
                        >
                          Vote YES
                        </button>
                        <button
                          onClick={() => voteOnProposal(prop.id, 'no')}
                          className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md transition"
                        >
                          Vote NO
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Disputes */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-white border border-amber-200 rounded-3xl flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-['Outfit']">Peer Jury Conflict Resolution</h3>
              <p className="text-xs text-slate-600 font-medium">
                No automated account deactivations. Disputed gigs are reviewed democratically by a jury of fellow senior artisans.
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-black px-4 py-2 rounded-2xl border border-amber-300">
              Cooperative Justice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disputes.map((d) => (
              <div key={d.id} className="glass-card rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black text-amber-800">
                      Case #{d.id}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      d.status === 'open_for_jury'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {d.status === 'open_for_jury' ? 'Jury Review Active' : 'Resolved'}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 font-['Outfit'] mt-1">{d.title}</h4>
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer Claim:</span>
                      <strong className="text-slate-800">{d.customerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Artisan Defendant:</span>
                      <strong className="text-emerald-700">{d.workerName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Disputed Amount:</span>
                      <strong className="text-slate-900">₹{d.amount}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 font-medium leading-relaxed">
                    "{d.description}"
                  </p>

                  {d.verdict && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold">
                      Jury Verdict: {d.verdict}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  {d.status === 'open_for_jury' ? (
                    <button
                      onClick={() => setSelectedDispute(d)}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition"
                    >
                      Issue Jury Verdict
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">Closed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jury Verdict Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
              Issue Peer Jury Verdict: Case #{selectedDispute.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Review evidence fairly without corporate bias.
            </p>

            <form onSubmit={handleResolve} className="mt-6 space-y-4">
              <textarea
                value={verdictText}
                onChange={(e) => setVerdictText(e.target.value)}
                placeholder="Enter jury decision (e.g., 'Free 30-min touchup granted from welfare contingency pool, worker rating protected')..."
                rows={4}
                className="w-full p-4 rounded-2xl glass-input text-xs text-slate-900 focus:outline-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDispute(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition"
                >
                  Confirm & Seal Verdict
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
