/**
 * Created by kavyagautam on 6/26/16.
 */
Meteor.methods(
  {
    addMessage(message) {
      messages.insert(message);
    },
  }
);

