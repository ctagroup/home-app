export function isValidConsent(consent, projectId) {
  // FIXME: real logic
  return true;
}

export function anyValidConsent(consents, projectId) {
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