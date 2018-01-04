import { fullName } from '/imports/api/utils';

export function userEmails(user) {
  const emails = (user.emails || []).map(email => email.address);
  if (user.services && user.services.HMIS) {
    const { emailAddress } = user.services.HMIS;
    emails.unshift(emailAddress);
  }
  return emails;
}

export function userName(user) {
  if (user.services && user.services.HMIS) {
    return fullName(user.services.HMIS);
  }
  return userEmails(user)[0] || user._id;
}
