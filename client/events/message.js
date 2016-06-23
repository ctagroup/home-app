Template.newMessage.events(
  {
    'submit .new-message'(e) {
      e.preventDefault();
      const contentText = $(e.target).find('[name=content]');
      const msg = {
        name: 'Meteor Chatter',
        content: contentText.val(),
      };
      msg._id = Messages.insert(msg);
      contentText.val('');
    },
  }
);
