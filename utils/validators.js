// utils/validators.js
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateCPF = (cpf) => {
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf);
  };
  
  const validatePassword = (password) => {
    return password && password.length >= 6;
  };
  
  module.exports = { validateEmail, validateCPF, validatePassword };