/**
 * Created by udit on 08/02/16.
 */
Meteor.publish(null, function () {
	if ( typeof homeRoles == "undefined")
		return;
	return homeRoles.find({});
});

Meteor.publish(null, function () {
	if ( typeof rolePermissions == "undefined")
		return;
	return rolePermissions.find({});
});
