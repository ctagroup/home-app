/**
 * Created by kavyagautam on 5/17/16.
 */

Template.messageList.helpers(
  {
    messages() {
      return messages.find().fetch();
    },
  }
);

Deps.autorun(() => {
  Meteor.subscribe('messages');
  Meteor.subscribe('onlineuser');
}
);

/*
Template.sidebar.helpers({
  onlineuser() {
    return Meteor.users.find({ 'status.online': true, _id: { $ne: Meteor.userId() } });
     // return Meteor.users.find({}); - even this doesnt list all the users??
  },

}
);

*/

