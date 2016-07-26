/**
 * Created by udit on 26/07/16.
 */

Meteor.methods(
  {
    adminRemoveDoc(collection, _id) {
      // #		if Roles.userIsInRole this.userId, ['delete_'+collection]
      let val = '';
      if (collection === 'Users') {
        val = Meteor.users.remove({ _id });
      } else {
        // # global[collection].remove {_id:_id}
        val = adminCollectionObject(collection).remove({ _id });
      }
      return val;
    },
  }
);
