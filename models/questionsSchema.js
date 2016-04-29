/**
 * Created by udit on 13/12/15.
 */
questions = new Meteor.Collection( 'questions' );

Schemas.questions = new SimpleSchema( {
	name: {
		type: String,
		max: 256
	},
	question: {
		type: String,
		autoform: {
			rows: 5
		}
	},
	category: {
		type: String,
		max: 256
	},
	'options.$': {
		type: Object,
		max: 256,
		optional: true
	},
	'options.$.value': {
		type: Number,
		max: 256,
		optional: true
	},
	'options.$.description': {
		type: String,
		max: 256,
		optional: true
	},
	dataType: {
		type: String,
		max: 256
	},
	hud: {
		type: Boolean
	},
	locked: {
		type: Boolean
	},
	isCopy: {
		type: Boolean
	},
	createdAt: {
		type: Date,
		label: 'Created At',
		autoValue: function () {
			if ( this.isInsert ) {
				return new Date();
			}
		}
	},
	updatedAt: {
		type: Date,
		label: 'Updated At',
		autoValue: function() {
			return new Date();
		}
	},
	//author: {
	//	type: String,
	//	regEx: SimpleSchema.RegEx.Id,
	//	autoValue: function () {
	//		if ( this.isInsert ) {
	//			return Meteor.userId();
	//		}
	//	},
	//	autoform: {
	//		options: function () {
	//			return _.map(Meteor.users.find().fetch(), function (user) {
	//				return {
	//					label: user.emails[0].address,
	//					value: user._id
	//				};
	//			} );
	//		}
	//	}
	//}
} );

questions.attachSchema( Schemas.questions );
