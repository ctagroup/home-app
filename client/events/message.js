Template.newMessage.events(
  {
    'submit .new-message': (e) => {
      e.preventDefault();
      const contentText = $(e.target).find('[name=content]');
      const msg = {
        name: Meteor.userId(),
        content: contentText.val(),
        timestamp: Date.now(),
      };
      Meteor.call(
        'addMessage', msg, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
      contentText.val('');
    },
  }
);
