/**
 * Created by Anush-PC on 7/19/2016.
 */

Meteor.publish(
  'globalHousehold', function publishGlobalHousehold() {
    const self = this;

    let globalHousehold = [];

    // if (this.userId) {
    // } else {
    //   HMISAPI.setCurrentUserId('');
    // }

    globalHousehold = [
      {
        globalHouseHoldId: null,
        headOfHouseholdId: 'asdf-asdf-assdfasfd-dd',
        dateCreated: '6/06/2016',
        dateUpdated: '6/06/2016',
        userCreate: 'asdf-adf-asdsf',
        userUpdate: 'asdf-adfasf-asdfasds',
      },
      {
        globalHouseHoldId: null,
        headOfHouseholdId: 'asdf-asdf-assdfasfd-dd-sadf',
        dateCreated: '6/06/2016',
        dateUpdated: '6/06/2016',
        userCreate: 'asdf-adf-asdsf',
        userUpdate: 'asdf-adfasf-asdfasds',
      },
    ];

    _.each(globalHousehold, (item) => {
      self.added('globalHousehold', Random.id(), item);
    });

    self.ready();
  }
);
