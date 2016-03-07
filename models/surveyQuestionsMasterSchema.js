/**
 * Created by udit on 07/03/16.
 */
surveyQuestionsMaster = new Meteor.Collection( 'surveyQuestionsMaster' );

Schemas.surveyQuestionsMaster = new SimpleSchema(
	{
		//survey_id,survey_title,content_type,content,order
		surveyID: {
			type: String,
			max: 256
		},
		surveyTitle: {
			type: String,
			max: 256
		},
		contentType: {
			type: String,
			max: 256
		},
		content: {
			type: String,
			max: 256
		},
		order: {
			type: Number
		}
	}
);

surveyQuestionsMaster.attachSchema( Schemas.surveyQuestionsMaster );

surveyQuestionsMaster.allow(
	{
		update: function updateProducts(userId, doc, fieldNames, modifier) {
			if (fieldNames.length !== 1 || fieldNames[0] !== 'order') return false;
			if (!Match.test(modifier, {$set: {order: Number}})) return false;
			if (typeof Meteor.users != 'undefined' && Meteor.users.findOne(userId, {fields:{Id:1}}).Id !== doc.Id) return false;
			return true;
		}
	}
);
