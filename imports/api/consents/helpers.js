export function isValidConsent(consent, projectId) { // eslint-disable-line
  // FIXME: real logic
  return false;
}

export function anyValidConsent(consents, projectId) {
  return consents.some(consent => isValidConsent(consent, projectId));
}

export function getPublicClientData(client) {
  const { clientId } = client;
  return {
    clientId,
  };
}
