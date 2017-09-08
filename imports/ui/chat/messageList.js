import Messages from '/imports/api/messages/messages';

Template.messageList.helpers(
  {
    messages() {
      return Messages.find().fetch();
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

