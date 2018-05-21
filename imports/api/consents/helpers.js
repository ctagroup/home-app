export function isValidConsent(consent, projectId) {
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
