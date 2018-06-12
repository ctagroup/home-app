import { ConsentPermission } from './consents';


export function isConsentPermissionGranted(consentPermission) {
  return [ConsentPermission.VIEW, ConsentPermission.EDIT].includes(consentPermission);
}

export function filterClientProfileFields(client) {
  const {
    clientId,
    firstName,
    middleName,
    lastName,
    consentPermission,
    dedupClientId,
    dob,
  } = client;

  return {
    clientId,
    firstName,
    middleName,
    lastName,
    consentPermission,
    dedupClientId,
    dob,
  };
}
