export function fullName(user) {
  if (!user) {
    return '';
  }
  const parts = [];
  if (user.firstName) {
    parts.push(user.firstName);
  }
  if (user.middleName) {
    parts.push(user.middleName);
  }
  if (user.lastName) {
    parts.push(user.lastName);
  }
  return parts.join(' ').trim();
}
