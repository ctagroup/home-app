/**
 * Created by Anush-PC on 8/10/2016.
 */
Template.selectedClientsEdit.helpers({
  getSelectedClientEdit() {
    setTimeout(() => $('.form-control:nth-child(1)').hide(), 0);
    Meteor.call('getHouseholdClients', window.location.href.split('/')[4], (err, res) => {
      if (err) {
        logger.log(err);
      } else {
        if ((Session.get('selectedClients') === undefined) ||
          (Session.get('selectedClients').length < res.length)) {
          Session.set('selectedClients', res);
        }
      }
    });
    return Session.get('selectedClients');
  },
  updateHOH() {
    let hoh = null;
    Meteor.call('getHousehold', window.location.href.split('/')[4], (err, res) => {
      if (err) {
        logger.log(err);
      } else {
        hoh = res;
        $(`#${hoh.headOfHouseholdId} input`).prop('checked', true);
      }
    });
  },
});

Template.selectedClientRowEdit.helpers({
  updaterelhoh(clientId, rehoh) {
    setTimeout(() => $(`#${clientId} select`).val(rehoh).change(), 0);
  },
});
