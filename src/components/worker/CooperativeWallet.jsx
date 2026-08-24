import React, { useState } from 'react';
import { 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  Clock, 
  CheckCircle2, 
  Building2, 
  DollarSign,
  ChevronLeft,
  Share2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function CooperativeWallet({ onBackToDashboard }) {
  const { activeWorker, updateWorkerWallet } = useAppState();
  const [cashoutAmount, setCashoutAmount] = useState('');
  const [cashoutSuccess, setCashoutSuccess] = useState(false);

  const handleCashout = (e) => {
    e.preventDefault();
    const amount = Number(cashoutAmount);
    if (!amount || amount <= 0 || amount > activeWorker.wallet.availableBalance) return;

    updateWorkerWallet(activeWorker.id, {
      ...activeWorker.wallet,
      availableBalance: activeWorker.wallet.availableBalance - amount
    });

    setCashoutSuccess(true);
    setCashoutAmount('');
    setTimeout(() => setCashoutSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs text-slate-500 hover:text-slate-900 mb-1 flex items-center gap-1 font-bold"
          >
            ← Back to Partner HUD
          </button>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
            Cooperative Wealth & Dividend Ledger
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            100% transparent cooperative earnings, quarterly patronage profit shares, and health reserves
          </p>
        </div>
      </div>

      {/* 3 Main Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Liquid Available Balance */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-6 border-2 border-emerald-300 shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-black">
            <span>Liquid Available Balance</span>
            <span className="bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Instant UPI
            </span>
          </div>

          <div>
            <div className="text-4xl font-black text-slate-900 font-['Outfit']">
              ₹{activeWorker.wallet.availableBalance.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              88% direct earnings from completed jobs. Zero lock-in period.
            </p>
          </div>

          <form onSubmit={handleCashout} className="pt-2 space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter ₹ amount"
                value={cashoutAmount}
                onChange={(e) => setCashoutAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-slate-900 font-bold focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition whitespace-nowrap"
              >
                Withdraw
              </button>
            </div>
            {cashoutSuccess && (
              <p className="text-[11px] text-emerald-700 font-bold bg-emerald-100 p-2 rounded-xl border border-emerald-300">
                ✓ ₹{cashoutAmount || 'Amount'} transferred to {activeWorker.bankAccountMasked} via NPCI UPI!
              </p>
            )}
          </form>
        </div>

        {/* 2. Patronage Dividends (Profit Share) */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs text-amber-800 font-black">
            <span>Accrued Patronage Dividends</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>

          <div>
            <div className="text-4xl font-black text-amber-700 font-['Outfit']">
              ₹{activeWorker.wallet.patronageDividends.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Quarterly profit share distributed back to member-workers based on job volume.
            </p>
          </div>

          {/* Visual Progress towards Quarter End */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] text-slate-500 font-bold">
              <span>Q3 Cooperative Surplus Pool</span>
              <span className="text-amber-800 font-black">82% Target Met</span>
            </div>
            <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-[82%]" />
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">Next cooperative dividend payout: Sept 30, 2026</span>
          </div>
        </div>

        {/* 3. Collective Welfare Emergency Health Shield */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-3xl p-6 border-2 border-blue-300 shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs text-blue-800 font-black">
            <span>Welfare & Health Shield</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div>
            <div className="text-4xl font-black text-blue-700 font-['Outfit']">
              {activeWorker.wallet.welfarePoints} pts
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Accrued through the 7% collective welfare pool on every completed service.
            </p>
          </div>

          <div className="p-3 bg-white border border-blue-200 rounded-2xl text-[11px] space-y-1 shadow-sm font-medium">
            <div className="flex justify-between text-slate-700">
              <span>Emergency Cashless Health Cover:</span>
              <strong className="text-blue-700 font-black">₹5,00,000</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Zero-Interest Tool Loan Eligibility:</span>
              <strong className="text-emerald-700 font-black">₹35,000</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Transparent Cooperative Ledger History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
            Recent Cooperative Credit Entries
          </h3>
          <span className="text-xs text-slate-500 font-bold">Audited by District Cooperative Registrar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">Gig / Event</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Gross Invoice</th>
                <th className="p-3.5">Worker Take-Home (88%)</th>
                <th className="p-3.5">Welfare Pool (7%)</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">#BK-9021 • Kitchen Plumbing Overhaul</td>
                <td className="p-3.5 text-slate-500">Service Execution</td>
                <td className="p-3.5 text-slate-900 font-black">₹650</td>
                <td className="p-3.5 text-emerald-700 font-black">+₹572</td>
                <td className="p-3.5 text-amber-700 font-bold">+₹45.5</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">SETTLED</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">#BK-8842 • AC Filter & Gas Recharge</td>
                <td className="p-3.5 text-slate-500">Service Execution</td>
                <td className="p-3.5 text-slate-900 font-black">₹1,200</td>
                <td className="p-3.5 text-emerald-700 font-black">+₹1,056</td>
                <td className="p-3.5 text-amber-700 font-bold">+₹84.0</td>
                <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">SETTLED</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900">Cooperative Q2 Surplus Patronage Dividend</td>
                <td className="p-3.5 text-amber-700 font-bold">Profit Sharing</td>
                <td className="p-3.5 text-slate-500">—</td>
                <td className="p-3.5 text-amber-700 font-black">+₹1,850</td>
                <td className="p-3.5 text-slate-500">—</td>
                <td className="p-3.5"><span className="bg-amber-100 text-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-black">DISTRIBUTED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
