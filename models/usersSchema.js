/**
 * Created by udit on 14/12/15.
 */
users = Meteor.users;

// Schemas.users = new SimpleSchema( {
//	services: {
//		type: Object,
//		blackbox: true
//	},
//	email: {
//		type: String,
//		label: 'Email address'
//	},
//	chooseOwnPassword: {
//		type: Boolean,
//		label: 'Let this user choose their own password with an email',
//		defaultValue: true
//	},
//	password: {
//		type: String,
//		label: 'Password',
//		optional: true
//	},
//	sendPassword: {
//		type: Boolean,
//		label: 'Send this user their password by email',
//		optional: true
//	}
// } );

// users.attachSchema( Schemas.users );

Schemas.CoOrdinates = new SimpleSchema(
  {
    lat: {
      type: Number,
      decimal: true,
    },
    long: {
      type: Number,
      decimal: true,
    },
    accuracy: {
      type: Number,
      decimal: true,
    }
  }
);

Schemas.LocationEntry = new SimpleSchema(
  {
    timestamp: {
      label: "Timestamp",
      type: Date,
    },
    position: {
      label: "Position",
      type: Schemas.CoOrdinates,
    }
  }
);

Schemas.UserCountry = new SimpleSchema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
      regEx: /^[A-Z]{2}$/,
    },
  }
);

Schemas.UserProfile = new SimpleSchema(
  {
    firstName: {
      type: String,
      optional: true,
    },
    lastName: {
      type: String,
      optional: true,
    },
    birthday: {
      type: Date,
      optional: true,
    },
    gender: {
      type: String,
      allowedValues: ['Male', 'Female'],
      optional: true,
    },
    organization: {
      type: String,
      optional: true,
    },
    website: {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true,
    },
    bio: {
      type: String,
      optional: true,
    },
    country: {
      type: Schemas.UserCountry,
      optional: true,
    },
  }
);

Schemas.users = new SimpleSchema(
  {
    username: {
      type: String,
      // For accounts-password, either emails or username is required, but not both.
      // It is OK to make this
      // optional here because the accounts-password package does its own validation.
      // Third-party login packages may not require either.
      // Adjust this schema as necessary for your usage.
      optional: true,
    },
    emails: {
      type: Array,
      // For accounts-password, either emails or username is required, but not both.
      // It is OK to make this
      // optional here because the accounts-password package does its own validation.
      // Third-party login packages may not require either.
      // Adjust this schema as necessary for your usage.
      optional: true,
    },
    'emails.$': {
      type: Object,
    },
    'emails.$.address': {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
    },
    'emails.$.verified': {
      type: Boolean,
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field /
    // splendido:meteor-accounts-meld
    registered_emails: {
      type: [Object],
      optional: true,
      blackbox: true,
    },
    chooseOwnPassword: {
      type: Boolean,
      label: 'Let this user choose their own password with an email',
      defaultValue: true,
    },
    password: {
      type: String,
      label: 'Password',
      optional: true,
    },
    sendPassword: {
      type: Boolean,
      label: 'Send this user their password by email',
      optional: true,
    },
    createdAt: {
      type: Date,
    },
    profile: {
      type: Schemas.UserProfile,
      optional: true,
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    roles: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    // roles: {
    //	type: [String],
    //	optional: true
    // },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
      type: Date,
      optional: true,
    },
    locationHistory: {
      label: "Location Tracker",
      type: Array,
      optional:true,
    },
    'locationHistory.$': {
      type: Schemas.LocationEntry,
    }
  }
);

users.attachSchema(Schemas.users);
