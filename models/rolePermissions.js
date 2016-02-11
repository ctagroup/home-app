/**
 * Created by udit on 09/02/16.
 */
rolePermissions = new Meteor.Collection("rolePermissions");

Schemas.rolePermissions = new SimpleSchema(
	{
		role: {
			type: String,
			max: 256
		},
		permission: {
			type: String,
			max: 256
		},
		value: {
			type: Boolean
		}
	}
);

rolePermissions.attachSchema( Schemas.rolePermissions );
