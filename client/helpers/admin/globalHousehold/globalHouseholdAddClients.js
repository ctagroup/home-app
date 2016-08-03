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
  getClientStatus(isHMIS) {
    let status = 'HMIS';
    if (isHMIS) {
      status = 'HMIS';
    } else {
      status = 'Local';
    }
    return status;
  },
});
