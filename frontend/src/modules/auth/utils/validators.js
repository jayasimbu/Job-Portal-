export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
};
