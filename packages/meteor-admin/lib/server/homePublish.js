/**
 * Created by udit on 08/02/16.
 */
Meteor.publish("homeRoles", function () {
	if ( typeof homeRoles == "undefined")
		return;
	return homeRoles.find({});
});

Meteor.publish("rolePermissions", function () {
	if ( typeof rolePermissions == "undefined")
		return;
	return rolePermissions.find({});
});

Meteor.publish("options", function () {
	if ( typeof options == "undefined")
		return;
	return options.find({});
});

Meteor.publish("surveys", function () {
	if ( typeof surveys == "undefined")
		return;
	return surveys.find({});
});

Meteor.publish("questions", function () {
	if ( typeof questions == "undefined")
		return;
	return questions.find({});
});

Meteor.publish("surveyQuestionsMaster", function () {
	if ( typeof surveyQuestionsMaster == "undefined")
		return;
	return surveyQuestionsMaster.find({});
});

Meteor.publish("users", function () {
	if ( typeof users == "undefined")
		return;
	return users.find({});
});
Meteor.publish("clientInfo", function () {
	if ( typeof clientInfo == "undefined")
		return;
	return clientInfo.find({});
});
Meteor.publish("responses", function () {
	if ( typeof responses == "undefined")
		return;
	return responses.find({});
});

Meteor.publish("responses", function () {
	if ( typeof responses == "undefined")
		return;
	return responses.find({});
});
