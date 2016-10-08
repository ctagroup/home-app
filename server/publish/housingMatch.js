/**
 * Created by Anush-PC on 7/19/2016.
 */

Meteor.publish(
  'housingMatch', function publishHousingMatch() {
    const self = this;

    let housingMatch = [];
    if (self.userId) {
      HMISAPI.setCurrentUserId(self.userId);
      housingMatch = HMISAPI.getHousingMatchForPublish();
      // according to the content received.
      // Adding Dummy Data for now.
      if (!housingMatch) {
        housingMatch = [
          {
            reservationId: 'f396b640-faf6-4f2f-98db-26a0c84c8e4f',
            eligibleClients: {
              clientId: '963cc91f-cd15-4307-ae92-a7a3e6fdba25',
              surveyScore: 10,
              matched: false,
              surveyDate: '09-29-2016 11:05',
            },
            matchDate: '2016-10-07',
            manualMatch: false,
            inactive: false,
            dateCreated: '2016-10-07',
            dateUpdated: '2016-10-07',
            links: [
              {
                rel: 'history',
                href: '/matches/client/963cc91f-cd15-4307-ae92-a7a3e6fdba25/status',
              },
            ],
          },
        ];
      }
      if (housingMatch) {
        logger.info(`Publishing Housing Match: ${housingMatch.length}`);
        for (let i = 0; i < housingMatch.length; i += 1) {
          // TODO Add client details (Name & link to profile) here.
          self.added('housingMatch', housingMatch[i].reservationId, housingMatch[i]);
        }
      }
      // Ideally all should be returned here. Keeping it commented for now.
      // for (let i = 1; i < response.page.totalPages; i += 1) {
      //   const temp = HMISAPI.getEligibleClientsForPublish(i);
      //   eligibleClients.push(...temp.content);
      //   logger.info(`Temp: ${eligibleClients.length}`);
      // }
      self.ready();
    } else {
      HMISAPI.setCurrentUserId('');
    }
    // housingMatch = [
    //   {
    //     reservation_id: '12345',
    //     client_id: '456788',
    //     housing_unit_id: '09876',
    //     match_date: '2016-10-10',
    //     user_id: 'admin',
    //     matchedStatus: true,
    //   },
    //   {
    //     reservation_id: '123456',
    //     client_id: '4567886',
    //     housing_unit_id: '09866',
    //     match_date: '2016-10-11',
    //     user_id: 'test_user',
    //     matchedStatus: true,
    //   },
    // ];
    //
    // _.each(housingMatch, (item) => {
    //   self.added('housingMatch', Random.id(), item);
    // });
    //
    // self.ready();
  }
);
