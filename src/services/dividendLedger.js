// Cooperative Dividend & Welfare Fund Ledger Calculation Engine (SIH26089)

/**
 * Calculates the exact rupee allocation for any service invoice
 */
export function calculateInvoiceBreakdown(totalAmount, service) {
  const workerPercent = service?.workerSharePercent || 88;
  const welfarePercent = service?.welfareSharePercent || 7;
  const platformPercent = service?.platformSharePercent || 5;

  const workerPayout = Math.round((totalAmount * workerPercent) / 100);
  const welfareFundContribution = Math.round((totalAmount * welfarePercent) / 100);
  const platformMaintenance = totalAmount - workerPayout - welfareFundContribution;

  // Accrued patronage dividend estimate (surplus from platform ops returned to worker)
  const estimatedPatronageDividend = Math.round(platformMaintenance * 0.40);

  return {
    totalAmount,
    workerPayout,
    workerPercent,
    welfareFundContribution,
    welfarePercent,
    platformMaintenance,
    platformPercent,
    estimatedPatronageDividend,
    cooperativeTrustScore: 100, // 100% transparent zero-hidden fees
    welfareBreakdown: {
      healthInsurancePool: Math.round(welfareFundContribution * 0.50),
      toolFinancingSubsidies: Math.round(welfareFundContribution * 0.30),
      emergencyFamilyAid: Math.round(welfareFundContribution * 0.20)
    }
  };
}

/**
 * Calculates comparative earnings vs traditional private aggregators
 */
export function calculateAggregatorComparison(totalEarnings) {
  // Private aggregators charge 25% - 30% commission + hidden lead generation fees
  const aggregatorTake = Math.round(totalEarnings * 0.28);
  const aggregatorNet = totalEarnings - aggregatorTake;

  // SahakarGig cooperative platform takes only ~5% ops, worker keeps 88% + dividends
  const coopTake = Math.round(totalEarnings * 0.05);
  const coopNet = totalEarnings - coopTake;
  const workerGain = coopNet - aggregatorNet;

  return {
    traditionalAggregatorNet: aggregatorNet,
    traditionalAggregatorDeduction: aggregatorTake,
    sahakarNet: coopNet,
    sahakarOpsDeduction: coopTake,
    extraWorkerIncome: workerGain,
    percentageGain: Math.round((workerGain / aggregatorNet) * 100)
  };
}
