import HomeRoles from '/imports/config/roles';
import './userEditForm.html';

Template.userEditForm.helpers({
  schema() {
    const hmisRoles = this.hmisRoles || [];
    const projectsLinked = this.projectsLinked || [];
    return new SimpleSchema({
      'services.HMIS': {
        type: new SimpleSchema({
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
          emailAddress: {
            type: String,
            optional: true,
          },
          roles: {
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
          },
        }),
      },
      'roles.__global_roles__': {
        label: 'HOME roles',
        type: [String],
        allowedValues: HomeRoles,
        autoform: {
          afFieldInput: {
            type: 'select-checkbox',
          },
        },
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
    });
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
