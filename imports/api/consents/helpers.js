export function isValidConsent(consent, allowedProjects) { // eslint-disable-line
  const nowTimestamp = Math.floor(Date.now() / 1000);
  if (consent.endTime < nowTimestamp) {
    return false;
  }
  const consentProjects = consent.globalProjects.map(p => p.id);
  return consentProjects.some(projectId => allowedProjects.includes(projectId));
}

export function anyValidConsent(consents, allowedProjects) {
  return consents.some(consent => isValidConsent(consent, allowedProjects));
}

export function filterClientProfileFields(client) {
  const {
    clientId,
    firstName,
    middleName,
    lastName,
    consentIsGranted,
    dedupClientId,
    dob,
  } = client;

  return {
    clientId,
    firstName,
    middleName,
    lastName,
    consentIsGranted,
    dedupClientId,
    dob,
  };
}
