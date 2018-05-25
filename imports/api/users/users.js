import HomeRoles from '/imports/config/roles';

SimpleSchema.messages({
  passwordMismatch: 'Passwords do not match',
  wrongPasswordFormat: 'The password must contain 8 to 16 characters long, It must contain at least one lowercase character, one uppercase character, one number, and one of the following special characters !@#$*', // eslint-disable-line max-len
});

function passwordField(minLength) {
  return {
    type: String,
    min: minLength,
    custom() {
      const regExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$*])(?=.{8,16})');
      if (!regExp.test(this.value)) {
        return 'wrongPasswordFormat';
      }
      return undefined;
    },
    autoform: {
      afFieldInput: { type: 'password' },
    },
  };
}

function confirmPasswordField(passwordFieldName) {
  return {
    type: String,
    custom() {
      if (this.value !== this.field(passwordFieldName).value) {
        return 'passwordMismatch';
      }
      return undefined;
    },
    autoform: {
      afFieldInput: { type: 'password' },
    },
  };
}

export const UserCreateFormSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  password: passwordField(8),
  passwordConfirm: confirmPasswordField('password'),
  firstName: {
    type: String,
    optional: true,
  },
  middleName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  gender: {
    type: Number,
    allowedValues: [0, 1],
    autoform: {
      options: [
        { value: 0, label: 'Male' },
        { value: 1, label: 'Female' },
      ],
    },
    optional: true,
  },
  roles: {
    label: 'HOME roles',
    type: [String],
    allowedValues: HomeRoles,
    autoform: {
      afFieldInput: {
        type: 'select-checkbox',
      },
      options: HomeRoles.map(r => ({ value: r, label: r })),
    },
    optional: true,
  },
});


export const ChangePasswordSchema = new SimpleSchema({
  currentPassword: {
    type: String,
    autoform: {
      afFieldInput: { type: 'password' },
    },
  },
  newPassword: passwordField(8),
  confirmNewPassword: confirmPasswordField('newPassword'),
});

const GeoCoordinatesSchema = new SimpleSchema(
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
    },
  }
);

const LocationEntrySchema = new SimpleSchema(
  {
    timestamp: {
      label: 'Timestamp',
      type: Date,
    },
    position: {
      label: 'Position',
      type: GeoCoordinatesSchema,
    },
  }
);

const UserCountrySchema = new SimpleSchema(
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

const UserProfileSchema = new SimpleSchema(
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
      type: UserCountrySchema,
      optional: true,
    },
  }
);

const Users = Meteor.users;

Users.schema = new SimpleSchema(
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
      type: UserProfileSchema,
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
    //  type: [String],
    //  optional: true
    // },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
      type: Date,
      optional: true,
    },
    locationHistory: {
      label: 'Location Tracker',
      type: Array,
      optional: true,
    },
    status: {
      type: Object,
      optional: true,
      blackbox: true,
    },
    'locationHistory.$': {
      type: LocationEntrySchema,
    },
    projectsLinked: {
      // TODO: unused field?
      label: 'Linked Projects',
      type: [String],
      optional: true,
    },
    activeConsentGroupId: {
      label: 'Active Consent Group',
      type: String,
      optional: true,
    },
    activeAgencyId: {
      label: 'Active Agency',
      type: String,
      optional: true,
    },
    activeProjectId: {
      label: 'Active Project',
      type: String,
      optional: true,
    },
  }
);

Users.attachSchema(Users.schema);

export default Users;
