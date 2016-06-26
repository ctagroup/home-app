Template.newMessage.events(
  {
    'submit .new-message'(e) {

      e.preventDefault();
      const contentText = $(e.target).find('[name=content]');
      const msg = {
        name: Meteor.userId(),
        content: contentText.val(),
        timestamp: Date.now(),
      };
      console.log(msg);
      Meteor.call('addMessage', msg, ( error, result ) => {
          if ( error ) {
            console.log(error);
          } else {
            console.log(result);
          }
        },
      );
      contentText.val('');
    },
  }
);
