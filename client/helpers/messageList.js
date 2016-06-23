/**
 * Created by kavyagautam on 5/17/16.
 */

Template.messageList.helpers(
  {
    messages() {
      return Messages.find().fetch();
    },
  }
);
