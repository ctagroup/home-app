Meteor.startup(() => {
  const adminEmails = [
    'javier@ctagroup.org',
    'bob@ctagroup.org',
    'emma@ctagroup.org',
  ];
  for (let i = 0; i < adminEmails; i += 1) {
    const devUser = Meteor.users.findOne(
      {
        emails: {
          $elemMatch: {
            address: adminEmails[i],
          },
        },
      }
    );
    if (devUser) {
      if (!Roles.userIsInRole(devUser._id, 'Developer')) {
        Roles.addUsersToRoles(devUser._id, ['Developer'], Roles.GLOBAL_GROUP);
      }
    }
  }
});
