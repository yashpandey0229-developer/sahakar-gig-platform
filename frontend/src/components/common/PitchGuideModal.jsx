import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Award, Zap, HelpCircle, ChevronDown, ChevronRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export function PitchGuideModal({ isOpen, onClose }) {
  const [openFaq, setOpenFaq] = useState(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: "How does SahakarGig solve the SIH26089 problem statement?",
      a: "Commercial gig giants (Urban Company, Uber, TaskRabbit) extract 25-35% commission and subject gig workers to arbitrary account deactivations. SahakarGig introduces a worker-owned cooperative model under the Ministry of Cooperation, capping platform maintenance to 5%, allocating 88% direct payouts to workers, and 7% into a collective healthcare welfare reserve."
    },
    {
      q: "What makes the Fair-Rotation Dispatch Algorithm innovative?",
      a: "Instead of private platforms prioritizing high-commission surge algorithms, SahakarGig balances geo-proximity with equitable income rotation. If an artisan hasn't received a booking in the current shift, their rotation score increases, preventing monopolization by a few workers."
    },
    {
      q: "How does the Dual-Key OTP verification prevent fraud?",
      a: "Two separate cryptographic OTPs are required: Start OTP upon arrival to verify physical presence, and End OTP upon customer inspection to release funds. No customer can be charged without service delivery, and no worker can be denied payment after OTP validation."
    },
    {
      q: "How do Patronage Dividends work?",
      a: "At the end of each quarter, 100% of the platform's financial surplus (after the 5% capped IT server costs) is redistributed back to active cooperative artisans proportionally based on their completed jobs, transforming workers from exploited gig labor into cooperative equity owners."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-bold text-2xl shadow-sm">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 font-['Outfit']">
                  SIH26089 Jury Pitch Deck & Defense Q&A
                </h3>
                <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-black">
                  Hackathon Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Key differentiators, economic viability metrics, and answers for judges.
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

        {/* 3 Winning Value Pillars */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-black text-emerald-800 uppercase block mb-1">1. Economic Justice</span>
            <div className="text-2xl font-black text-emerald-700">88% Pay</div>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">Direct worker payout vs only ~65% on commercial apps.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-black text-amber-800 uppercase block mb-1">2. Social Security</span>
            <div className="text-2xl font-black text-amber-700">7% Health</div>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">Automatic cashless family health cover & zero-interest micro-loans.</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-black text-blue-800 uppercase block mb-1">3. Tech Excellence</span>
            <div className="text-2xl font-black text-blue-700">AI Voice PWA</div>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">Bilingual voice companion, live GPS, & 1-worker-1-vote democracy.</p>
          </div>
        </div>

        {/* Accordion FAQ for Judges */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Anticipated SIH Evaluator Questions & Tactical Answers:
          </h4>

          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-900 hover:bg-slate-100/80 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronDown className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 border-t border-slate-200/60 leading-relaxed font-medium bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition"
          >
            Ready for Presentation
          </button>
        </div>

      </div>
    </div>
  );
}
