function distance(meters) {
  if (meters < 1000) return `${meters.toFixed(0)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default { distance };
