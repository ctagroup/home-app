/**
 * Created by Anush-PC on 8/1/2016.
 */
Template.selectClients.helpers(
  {
    getClientList() {
      Meteor.call('getClients', (err, res) => {
        if (err) {
          logger.log(err);
        } else {
          Session.set('clientData', res);
        }
        return;
      });
      return Session.get('clientData');
    },
  });

Template.selectClientRow.helpers({
  checkIfSelected(id) {
    const selectedClients = Session.get('selectedClients');
    let status = '';
    if ((selectedClients === null) || (selectedClients === undefined)) {
      status = '';
    } else {
      for (let i = 0; i < selectedClients.length; i++) {
        if (selectedClients[i].clientId === id) {
          status = 'checked';
        }
      }
    }
    return status;
  },
  getClientStatus(isHMIS) {
    let status = 'HMIS';
    if (isHMIS) {
      status = 'HMIS';
    } else {
      status = 'Local';
    }
    return status;
  },
  getValue(cId, fName, mName, lName) {
    return `${cId}|${fName.trim()} ${mName.trim()} ${lName.trim()}`;
  },
});

Template.selectedClientsView.helpers(
  {
    getSelectedClient() {
      setTimeout(() => $('.form-control:nth-child(1)').remove(), 0);
      return Session.get('selectedClients');
    },
  });
