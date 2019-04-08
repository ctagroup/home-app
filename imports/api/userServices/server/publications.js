import UserServices from '/imports/api/userServices/userServices';

Meteor.publish('userServices.all', function publishClientServices() {
  return UserServices.find();
});
