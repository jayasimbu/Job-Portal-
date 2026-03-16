export const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export const toUpperLogLevel = (level = 'info') => String(level).toUpperCase();
