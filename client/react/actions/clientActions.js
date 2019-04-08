import { Clients } from '../../../imports/api/clients/clients';

export const getClientProfile = function getClientProfile(clientId) {
  //const client = Clients.findOne({ _id: clientId });
  return { firstName: 'first name', lastName: 'last name', middleName: 'middle name',
  dob: 'DOB', ssn: 'XXX-XX-2314', client_Id: clientId, email: 'shanni@brihaspatitech.com' };
};
