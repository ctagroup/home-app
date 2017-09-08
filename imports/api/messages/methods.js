import Messages from '/imports/api/messages/messages';

Meteor.methods(
  {
    addMessage(message) {
      Messages.insert(message);
    },
  }
);

