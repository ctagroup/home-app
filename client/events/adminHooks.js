/**
 * Created by udit on 22/06/16.
 */

AutoForm.addHooks(
  [
    'admin_insert',
    'admin_update',
    'adminNewUser',
    'adminUpdateUser',
    'adminSendResetPasswordEmail',
    'adminChangePassword',
  ],
  {
    beginSubmit() {
      $('.btn-primary').addClass('disabled');
    },
    endSubmit() {
      $('.btn-primary').removeClass('disabled');
    },
    onError(formType, error) {
      AdminDashboard.alertFailure(error.message);
    },
  }
);

AutoForm.hooks(
  {
    adminSettingsForm: {
      onSuccess() {
        AdminDashboard.alertSuccess('Settings saved successfully.');
      },
    },
    admin_insert: {
      onSubmit(insertDoc, updateDoc, currentDoc) {
        const hook = this;
        Meteor.call('adminInsertDoc', insertDoc, Session.get('admin_collection_name'), (e) => {
          if (e) {
            hook.done(e);
          } else {
            HomeUtils.adminCallback(
              'onInsert',
              [Session.get('admin_collection_name', insertDoc, updateDoc, currentDoc)],
              (collection) => {
                hook.done(null, collection);
              }
            );
          }
        });
        return false;
      },
      onSuccess(formType, collection) {
        AdminDashboard.alertSuccess('Successfully created');
        Router.go(`/${collection}`);
      },
    },
    admin_update: {
      onSubmit(insertDoc, updateDoc, currentDoc) {
        const hook = this;
        Meteor.call(
          'adminUpdateDoc',
          updateDoc,
          Session.get('admin_collection_name'),
          Session.get('admin_id'),
          (e) => {
            if (e) {
              hook.done(e);
            } else {
              HomeUtils.adminCallback(
                'onUpdate',
                [Session.get('admin_collection_name', insertDoc, updateDoc, currentDoc)],
                (collection) => {
                  hook.done(null, collection);
                }
              );
            }
          }
        );
        return false;
      },
      onSuccess(formType, collection) {
        AdminDashboard.alertSuccess('Successfully updated');
        Router.go(`/${collection}`);
      },
    },
    adminNewUser: {
      onSuccess() {
        AdminDashboard.alertSuccess('Created user');
        Router.go('/users');
      },
    },
    adminUpdateUser: {
      onSubmit(insertDoc, updateDoc) {
        Meteor.call('adminUpdateUser', updateDoc, Session.get('admin_id'), this.done);
        return false;
      },
      onSuccess() {
        AdminDashboard.alertSuccess('Updated user');
        Router.go('/users');
      },
    },
    adminSendResetPasswordEmail: {
      onSuccess() {
        AdminDashboard.alertSuccess('Email sent');
      },
    },
    adminChangePassword: {
      onSuccess() {
        AdminDashboard.alertSuccess('Password reset');
      },
    },
  }
);
