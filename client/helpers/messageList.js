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


Meteor.subscribe('messages');
