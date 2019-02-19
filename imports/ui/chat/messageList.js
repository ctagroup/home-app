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
