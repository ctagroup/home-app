import { Mongo } from 'meteor/mongo';

const UserServices = new Mongo.Collection('userServices');
UserServices.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
});

export default UserServices;
