/**
 * Created by kavyagautam on 5/17/16.
 */

Template.messageList.helpers({
    messages: function() {
        console.log("Hi");
        console.log(Messages.find().fetch());
        //var MessageCollection = adminCollectionObject("Messages");
        return Messages.find().fetch();
    }
});