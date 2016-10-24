/**
 * Created by Mj on 10/8/2016.
 */

Template.housingMatchListView.events(
  {
    'click .postHousingMatches': () => {
      Meteor.call('postHousingMatches', (error, result) => {
        if (error) {
          logger.error(`postHousingMatches - ${error}`);
        } else {
          logger.info(`postHousingMatches - ${result}`);
        }
      });
    },
    'click .js-notify-agency-contact': (evt) => {
      const clientId = $(evt.currentTarget).data('client-id');
      Meteor.call(
        'updateClientMatchStatus',
        clientId,
        // Agency Contact Status.
        1,
        'Comments from HOME App',
        (err, res) => {
          if (err) {
            logger.log(err);
          } else {
            logger.log(res);
            $(evt.currentTarget).parent().append(referralStatusHelpers.generateStatusTagMarkup(1));
            $(evt.currentTarget).remove();
          }
        }
      );
    },
  }
);
