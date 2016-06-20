Template.newMessage.events({
    'submit .new-message': function(e) {
        e.preventDefault();

        var contentText = $(e.target).find('[name=content]');

        var msg = {
            name:    "Meteor Chatter",
            content: contentText.val()
        };

        msg._id = Messages.insert(msg);
        contentText.val('');
    }
});