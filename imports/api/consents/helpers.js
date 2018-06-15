import { ConsentPermission } from './consents';


export function canViewClient(consentPermission) {
  return [ConsentPermission.VIEW, ConsentPermission.EDIT].includes(consentPermission);
}

export function canEditClient(consentPermission) {
  return consentPermission === ConsentPermission.EDIT;
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
