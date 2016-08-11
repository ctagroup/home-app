/**
 * Created by Anush-PC on 8/10/2016.
 */
Template.selectedClientsEdit.helpers({
  getSelectedClientEdit() {
    Meteor.call('getHouseholdClients', window.location.href.split('/')[4], (err, res) => {
      if (err) {
        logger.log(err);
      } else {
        Session.set('selectedEditClients', res);
      }
    });
    return Session.get('selectedEditClients');
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
