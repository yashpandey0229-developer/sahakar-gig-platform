// Dynamic Multi-Objective Dispatch & Optimization Engine for SahakarGig (SIH26089)

/**
 * Calculates distance in kilometers between two coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Dynamic Multi-Objective Optimization Dispatch Algorithm:
 * Replaces the legacy 35% rotation algorithm with a real-time Pareto-optimal
 * Multi-Criteria Decision Analysis (MCDA) function that dynamically balances:
 * 
 * 1. Proximity / Nearest Factor (40% Weight):
 *    Minimizes customer wait time by evaluating real Haversine GPS distance.
 *    Closer artisans receive higher proximity scores.
 * 
 * 2. Quality / Best Rating Factor (35% Weight):
 *    Ensures superior craftsmanship and customer satisfaction.
 *    Higher verified star ratings (e.g. 4.9★, 4.95★) are heavily weighted.
 * 
 * 3. Cost-Efficiency / Affordability Factor (25% Weight):
 *    Protects citizens from surge price exploitation.
 *    Workers with lower hourly/visiting rates get higher affordability scores,
 *    dynamically favoring the most economical choice without compromising quality.
 * 
 * Mathematical Formulation:
 * OptimizationScore = (ProximityScore * 0.40) + (RatingScore * 0.35) + (CostScore * 0.25)
 */
export function findBestMatchingWorkers(serviceId, customerLocation, allWorkers, options = {}) {
  const eligibleWorkers = allWorkers.filter(w => 
    w.status === 'online' && w.skills && w.skills.includes(serviceId)
  );

  if (!eligibleWorkers || eligibleWorkers.length === 0) {
    const onlineWorkers = allWorkers.filter(w => w.status === 'online');
    if (onlineWorkers.length === 0) return allWorkers.slice(0, 3);
    return onlineWorkers;
  }

  // Pre-calculate distances and costs for cohort normalization
  const workerMetrics = eligibleWorkers.map(worker => {
    const distance = calculateDistanceKm(
      customerLocation?.lat || 18.5298,
      customerLocation?.lng || 73.8472,
      worker.location?.lat || 18.5298,
      worker.location?.lng || 73.8472
    );

    const cost = Number(worker.hourlyRate || worker.visitingCharge || worker.baseRate || 249);
    const rating = Number(worker.rating || 4.8);

    return {
      worker,
      distance,
      cost,
      rating
    };
  });

  // Calculate cohort min/max for dynamic scaling
  const distances = workerMetrics.map(m => m.distance);
  const costs = workerMetrics.map(m => m.cost);

  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  const scoredWorkers = workerMetrics.map(({ worker, distance, cost, rating }) => {
    // 1. Proximity Score (40%): Max score for nearest; decay over 15km
    let proximityScore = 100;
    if (maxDistance > minDistance) {
      const relativeCloseness = 1 - (distance - minDistance) / (maxDistance - minDistance);
      const absoluteCloseness = Math.max(0, (15 - distance) / 15);
      proximityScore = Math.round((relativeCloseness * 0.6 + absoluteCloseness * 0.4) * 100);
    } else {
      proximityScore = Math.round(Math.max(0, (15 - distance) / 15) * 100);
    }
    proximityScore = Math.max(10, Math.min(100, proximityScore));

    // 2. Rating Score (35%): Direct scaling based on customer feedback
    const ratingScore = Math.max(20, Math.min(100, Math.round((rating / 5) * 100)));

    // 3. Cost Optimization Score (25%): Lower cost = higher score for citizen affordability
    let costScore = 85;
    if (maxCost > minCost) {
      const costSavingsRatio = 1 - (cost - minCost) / (maxCost - minCost);
      costScore = Math.round(50 + costSavingsRatio * 50);
    } else {
      costScore = Math.max(30, Math.min(100, Math.round(100 - (cost / 350) * 40)));
    }
    costScore = Math.max(20, Math.min(100, costScore));

    // Composite Dynamic Optimization Score (Weights sum to 100%)
    const optimizationScore = Math.round(
      proximityScore * 0.40 +
      ratingScore * 0.35 +
      costScore * 0.25
    );

    const etaMinutes = Math.max(6, Math.round(distance * 3.2 + 3));

    return {
      ...worker,
      distanceKm: distance,
      hourlyRate: cost,
      cost,
      proximityScore,
      ratingScore,
      costScore,
      optimizationScore,
      matchScore: optimizationScore, // backward compatibility
      estimatedEtaMins: etaMinutes,
      optimizationSummary: {
        nearestDistKm: distance,
        topRating: rating,
        economicalCost: cost,
        weights: { nearest: '40%', rating: '35%', cost: '25%' }
      }
    };
  });

  // Sort descending by highest optimization score (Nearest + Best Rating + Less Cost)
  return scoredWorkers.sort((a, b) => b.optimizationScore - a.optimizationScore);
}

/**
 * Simulates GPS step interpolation between worker coordinate and target coordinate
 */
export function interpolateGeoStep(currentLat, currentLng, targetLat, targetLng, progressFraction) {
  const nextLat = currentLat + (targetLat - currentLat) * progressFraction;
  const nextLng = currentLng + (targetLng - currentLng) * progressFraction;
  return {
    lat: parseFloat(nextLat.toFixed(6)),
    lng: parseFloat(nextLng.toFixed(6))
  };
}
