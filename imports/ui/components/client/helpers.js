
export const formatSSN = (socialSecurityNumber) => {
  if (!socialSecurityNumber) return '';
  // XXX-XX-3210
  return `XXX-XX${socialSecurityNumber.slice(6)}`;
};
