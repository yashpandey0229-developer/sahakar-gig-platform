// Fair Dispatch & Geolocation Dispatch Engine for SahakarGig (SIH26089)

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
 * Fair Dispatch Priority Algorithm:
 * Rather than pure "star rating monopoly" which starves newer or honest workers,
 * we combine:
 * 1. Proximity Weight (40%) - Quick ETA for customer
 * 2. Fair-Rotation Score (35%) - Equitable distribution of daily earning opportunities
 * 3. Skill & Certification Match (15%) - Verified NSDC / ITI badges
 * 4. Customer Rating Factor (10%) - Minimum threshold quality assurance
 */
export function findBestMatchingWorkers(serviceId, customerLocation, allWorkers) {
  const eligibleWorkers = allWorkers.filter(w => 
    w.status === 'online' && w.skills.includes(serviceId)
  );

  const scoredWorkers = eligibleWorkers.map(worker => {
    const distance = calculateDistanceKm(
      customerLocation.lat,
      customerLocation.lng,
      worker.location.lat,
      worker.location.lng
    );

    // Normalize proximity score (closer is higher, max 15km radius)
    const proximityScore = Math.max(0, (15 - distance) / 15) * 100;
    const rotationScore = worker.fairRotationScore || 85;
    const ratingScore = (worker.rating / 5) * 100;
    const certScore = worker.skillIndiaBadge ? 100 : 80;

    // Weighted aggregate score
    const totalScore = (
      proximityScore * 0.40 +
      rotationScore * 0.35 +
      certScore * 0.15 +
      ratingScore * 0.10
    );

    const etaMinutes = Math.max(8, Math.round(distance * 3.5 + 4));

    return {
      ...worker,
      distanceKm: distance,
      matchScore: Math.round(totalScore),
      estimatedEtaMins: etaMinutes
    };
  });

  // Sort descending by match score
  return scoredWorkers.sort((a, b) => b.matchScore - a.matchScore);
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
