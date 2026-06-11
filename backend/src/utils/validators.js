export const isValidEmail = (value) => {
  if (typeof value !== 'string') return false;
  const t = value.trim();
  if (t.length === 0 || t.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
};

export const isValidPassword = (value) => {
  if (typeof value !== 'string') return false;
  if (value.length > 128) return false;
  return value.length >= 8;
};
