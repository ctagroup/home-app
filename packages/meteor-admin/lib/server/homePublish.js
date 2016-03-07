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

Meteor.publish(null, function () {
	if ( typeof options == "undefined")
		return;
	return options.find({});
});

Meteor.publish(null, function () {
	if ( typeof surveys == "undefined")
		return;
	return surveys.find({});
});

Meteor.publish(null, function () {
	if ( typeof questions == "undefined")
		return;
	return questions.find({});
});

Meteor.publish(null, function () {
	if ( typeof surveyQuestionsMaster == "undefined")
		return;
	return surveyQuestionsMaster.find({});
});
