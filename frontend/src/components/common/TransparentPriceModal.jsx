import React from 'react';
import { X, ShieldCheck, HeartHandshake, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { calculateInvoiceBreakdown, calculateAggregatorComparison } from '../../services/dividendLedger';

export function TransparentPriceModal({ service, amount = 500, isOpen, onClose }) {
  if (!isOpen) return null;

  const breakdown = calculateInvoiceBreakdown(amount, service);
  const comparison = calculateAggregatorComparison(amount);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-2xl shadow-sm">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                  Transparent Cooperative Pricing
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black">
                  Zero Hidden Fees
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Ministry of Cooperation "Sahakar Se Samriddhi" Fair Wage Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Price Card */}
        <div className="my-6 p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Service Fee for {service ? service.title : 'Standard Gig'}</span>
            <div className="text-4xl font-black text-slate-900 font-['Outfit']">₹{amount}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-800 font-black bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-sm">
              100% Cooperative Audited
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Every rupee accounted for</p>
          </div>
        </div>

        {/* 3-Way Fair Allocation Bar */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Where Every Rupee of Your ₹{amount} Goes:
          </h4>

          {/* Visual Progress Stack */}
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 shadow-inner">
            <div style={{ width: `${breakdown.workerPercent}%` }} className="bg-emerald-500 rounded-l-full" title="Worker Share (88%)" />
            <div style={{ width: `${breakdown.welfarePercent}%` }} className="bg-amber-500" title="Welfare Pool (7%)" />
            <div style={{ width: `${breakdown.platformPercent}%` }} className="bg-blue-500 rounded-r-full" title="Platform Ops (5%)" />
          </div>

          {/* Detailed Breakdown Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Worker Direct Payout */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-800 font-black mb-1">
                  <span>Worker Direct Payout</span>
                  <span>{breakdown.workerPercent}%</span>
                </div>
                <div className="text-3xl font-black text-emerald-700">
                  ₹{breakdown.workerPayout}
                </div>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium mt-2 leading-relaxed">
                Goes directly to the artisan's bank account instantly upon OTP completion.
              </p>
            </div>

            {/* 2. Collective Welfare Reserve */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-800 font-black mb-1">
                  <span>Welfare & Healthcare</span>
                  <span>{breakdown.welfarePercent}%</span>
                </div>
                <div className="text-3xl font-black text-amber-700">
                  ₹{breakdown.welfareFundContribution}
                </div>
              </div>
              <p className="text-[11px] text-amber-800 font-medium mt-2 leading-relaxed">
                Funds health insurance, tool subsidies, and retirement micro-savings for all workers.
              </p>
            </div>

            {/* 3. Platform IT & Server Ops */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between text-xs text-blue-800 font-black mb-1">
                  <span>Server & Ops</span>
                  <span>{breakdown.platformPercent}%</span>
                </div>
                <div className="text-3xl font-black text-blue-700">
                  ₹{breakdown.platformMaintenance}
                </div>
              </div>
              <p className="text-[11px] text-blue-800 font-medium mt-2 leading-relaxed">
                Non-profit operating budget. Any surplus returned as Patronage Dividends.
              </p>
            </div>
          </div>
        </div>

        {/* Cooperative vs Commercial Aggregator Comparison */}
        <div className="mt-6 p-5 rounded-3xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              SahakarGig vs Commercial Monopoly Platforms
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="font-black text-rose-800 mb-1.5">Commercial Apps (Urban Co / Uber)</div>
              <ul className="space-y-1 text-slate-600 text-[11px] font-medium">
                <li>❌ 25% – 35% Platform Cut taken</li>
                <li>❌ Worker retains only ~₹{comparison.traditionalAggregatorNet}</li>
                <li>❌ Zero equity or dividend share</li>
                <li>❌ Arbitrary algorithmic bans</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="font-black text-emerald-800 mb-1.5">SahakarGig Cooperative</div>
              <ul className="space-y-1 text-slate-700 text-[11px] font-medium">
                <li>✅ Only 5% capped ops overhead</li>
                <li>✅ Worker retains ₹{comparison.sahakarNet} (+{comparison.percentageGain}% more)</li>
                <li>✅ Quarterly patronage dividends</li>
                <li>✅ Democratic peer jury protection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition"
          >
            Got it, Continue
          </button>
        </div>

      </div>
    </div>
  );
}
