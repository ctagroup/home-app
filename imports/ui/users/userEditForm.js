import { DefaultAdminAccessRoles } from '/imports/config/permissions';
import HomeRoles from '/imports/config/roles';
import './userEditForm.html';

Template.userEditForm.helpers({
  schema() {
    const hmisRoles = this.hmisRoles || [];
    const projectsLinked = this.projectsLinked || [];
    const typeOptions = {
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
      emailAddress: {
        type: String,
        optional: true,
      },
    };
    if (Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles)) {
      typeOptions.roles = {
        type: [String],
        allowedValues: hmisRoles.map(r => r.id),
        optional: true,
        autoform: {
          afFieldInput: {
            type: 'select-checkbox',
            options: hmisRoles.map(r => ({
              value: r.id,
              label: r.roleDescription,
            })),
          },
        },
      };
    }
    const schemaOptions = {
      'services.HMIS': {
        type: new SimpleSchema(typeOptions),
      },
      projectsLinked: {
        type: [String],
        allowedValues: projectsLinked.map(p => p.projectId),
        optional: true,
        autoform: {
          afFieldInput: {
            type: 'select-checkbox',
            options: projectsLinked.map(p => ({
              value: p.projectId,
              label: p.projectName,
            })),
          },
        },
      },
    };
    if (Roles.userIsInRole(Meteor.userId(), DefaultAdminAccessRoles)) {
      schemaOptions['roles.__global_roles__'] = {
        label: 'HOME roles',
        type: [String],
        allowedValues: HomeRoles,
        autoform: {
          afFieldInput: {
            type: 'select-checkbox',
          },
        },
      };
    }
    return new SimpleSchema(schemaOptions);
  },
});

AutoForm.addHooks('updateUserForm', {
  onSubmit: function submit(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault();
    Meteor.call('users.update', currentDoc._id, insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Bert.alert('User updated', 'success', 'growl-top-right');
  },
  onError(formType, err) {
    Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
  },
});
