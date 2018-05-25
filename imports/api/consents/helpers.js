export function isValidConsent(consent, projectId) { // eslint-disable-line
  return consent.globalProjects.includes(projectId);
}

export function anyValidConsent(consents, projectId) {
  console.log('aaaa', consents, projectId);
  return consents.some(consent => isValidConsent(consent, projectId));
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
