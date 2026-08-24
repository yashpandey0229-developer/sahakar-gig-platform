import React, { useState } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function GovernanceVoting() {
  const { proposals, castVote, addNotification } = useAppState();
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Welfare & Safety');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateProposal = (e) => {
    e.preventDefault();
    addNotification(
      'New Cooperative Proposal Submitted',
      `Proposal "${newTitle}" registered on voting ledger for member ballot.`,
      'vote'
    );
    setShowNewProposalModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-bold">
              DEMOCRATIC GOVERNANCE
            </span>
            <span className="text-xs text-slate-400">1 Worker = 1 Vote Principle</span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit'] mt-1">
            Active Cooperative Policy Voting
          </h2>
          <p className="text-xs text-slate-400">
            Unlike corporate gig platforms, all wage floors, welfare rules, and platform upgrades are decided by worker consensus.
          </p>
        </div>

        <button
          onClick={() => setShowNewProposalModal(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </button>
      </div>

      {/* Proposals List */}
      <div className="grid grid-cols-1 gap-6">
        {proposals.map((prop) => {
          const totalVotes = prop.yesVotes + prop.noVotes;
          const yesPercent = totalVotes > 0 ? Math.round((prop.yesVotes / totalVotes) * 100) : 0;
          const noPercent = totalVotes > 0 ? Math.round((prop.noVotes / totalVotes) * 100) : 0;

          return (
            <div
              key={prop.id}
              className="glass-panel border border-slate-800 hover:border-purple-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition-all"
            >
              {/* Proposal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-400">
                      #{prop.id}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-semibold">
                      {prop.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prop.status === 'passed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {prop.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{prop.title}</h3>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-400">
                  <span>Voting Deadline:</span>
                  <div className="text-slate-200 font-semibold flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {prop.deadline}
                  </div>
                </div>
              </div>

              {/* Description & Impact */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {prop.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-slate-400">
                  Proposed by: <strong className="text-slate-200">{prop.proposedBy}</strong>
                </span>
                <span className="text-purple-400 font-semibold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                  Fiscal Impact: {prop.fundImpact}
                </span>
              </div>

              {/* Voting Bar & Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    YES: {prop.yesVotes} votes ({yesPercent}%)
                  </span>
                  <span className="text-rose-400 flex items-center gap-1">
                    NO: {prop.noVotes} votes ({noPercent}%)
                    <XCircle className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                  <div style={{ width: `${yesPercent}%` }} className="bg-emerald-500 transition-all duration-500" />
                  <div style={{ width: `${noPercent}%` }} className="bg-rose-500 transition-all duration-500" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Turnout: {totalVotes} / {prop.totalEligibleVoters} members ({Math.round((totalVotes / prop.totalEligibleVoters) * 100)}%)</span>
                  <span>Quorum: 50% Required</span>
                </div>
              </div>

              {/* Voting Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                {prop.hasVoted ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4" />
                    Your Vote Recorded in Cooperative Ledger
                  </span>
                ) : (
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => castVote(prop.id, 'yes')}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Vote YES</span>
                    </button>
                    <button
                      onClick={() => castVote(prop.id, 'no')}
                      className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Vote NO</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* New Proposal Modal */}
      {showNewProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Submit Cooperative Policy Proposal
            </h3>
            <p className="text-xs text-slate-400">
              Any certified cooperative member or council representative can propose policy or tariff adjustments.
            </p>

            <form onSubmit={handleCreateProposal} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Festival Equipment Allowance 2026"
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white focus:outline-none bg-slate-900"
                >
                  <option value="Welfare & Safety">Welfare & Safety</option>
                  <option value="Pricing & Wages">Pricing & Base Wages</option>
                  <option value="Green Mobility & Loans">Green Mobility & Loans</option>
                  <option value="Platform IT & Tech">Platform Features & Tech</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Detailed Description & Costing</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain why this proposal benefits the cooperative community and the estimated fund allocation required..."
                  className="w-full p-2.5 rounded-xl glass-input text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProposalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg"
                >
                  Publish for Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
