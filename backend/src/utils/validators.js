export const isValidEmail = (value) => {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export const isValidPassword = (value) => {
  return typeof value === 'string' && value.trim().length >= 8;
};
