/**
 * Created by udit on 13/12/15.
 */
questions = new Meteor.Collection( 'questions' );

Schemas.questions = new SimpleSchema( {
	title: {
		type: String,
		max: 256
	},
	content: {
		type: String,
		autoform: {
			rows: 5
		}
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
	author: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		autoValue: function () {
			if ( this.isInsert ) {
				return Meteor.userId();
			}
		},
		autoform: {
			options: function () {
				return _.map(Meteor.users.find().fetch(), function (user) {
					return {
						label: user.emails[0].address,
						value: user._id
					};
				} );
			}
		}
	}
} );

questions.attachSchema( Schemas.questions );
