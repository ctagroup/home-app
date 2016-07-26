/**
 * Created by Anush-PC on 7/19/2016.
 */

Meteor.publish(
  'housingMatch', function publishHousingMatch() {
    const self = this;

    let housingMatch = [];

    // if (this.userId) {
    // } else {
    //   HMISAPI.setCurrentUserId('');
    // }

    housingMatch = [
      {
        reservation_id: '12345',
        client_id: '456788',
        housing_unit_id: '09876',
        match_date: '2016-10-10',
        user_id: 'admin',
        matchedStatus: true,
      },
      {
        reservation_id: '123456',
        client_id: '4567886',
        housing_unit_id: '09866',
        match_date: '2016-10-11',
        user_id: 'test_user',
        matchedStatus: true,
      },
    ];

    _.each(housingMatch, (item) => {
      self.added('housingMatch', Random.id(), item);
    });

    self.ready();
  }
);
