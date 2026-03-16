export const scoreColor = (score) => {
  if (score >= 85) return '#2f855a';
  if (score >= 70) return '#b7791f';
  return '#c53030';
};

export const normalizeScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));
