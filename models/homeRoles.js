/**
 * Created by udit on 05/02/16.
 */
homeRoles = new Meteor.Collection("homeRoles");

Schemas.homeRoles = new SimpleSchema(
	{
		title: {
			type: String,
			max: 256
		}
	}
);

homeRoles.attachSchema( Schemas.homeRoles );
