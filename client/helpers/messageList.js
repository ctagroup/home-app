/**
 * Created by kavyagautam on 5/17/16.
 */

Template.messageList.helpers(
  {
    messages() {
      console.log('Hi');
      console.log(messages.find().fetch());
      return messages.find().fetch();
    },
  }
);


Meteor.subscribe('messages');
