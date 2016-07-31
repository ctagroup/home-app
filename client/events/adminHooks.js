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
      HomeDashboard.alertFailure(error.message);
    },
  }
);

AutoForm.hooks(
  {
    openingScriptForm: {
      onSuccess() {
        HomeDashboard.alertSuccess('Opening Script saved successfully.');
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
        HomeDashboard.alertSuccess('Successfully created');
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
        HomeDashboard.alertSuccess('Successfully updated');
        Router.go(`/${collection}`);
      },
    },
    adminNewUser: {
      onSuccess() {
        HomeDashboard.alertSuccess('Created user');
        Router.go('/users');
      },
    },
    adminUpdateUser: {
      onSubmit(insertDoc, updateDoc) {
        Meteor.call('adminUpdateUser', updateDoc, Session.get('admin_id'), this.done);
        return false;
      },
      onSuccess() {
        HomeDashboard.alertSuccess('Updated user');
        Router.go('/users');
      },
    },
    adminSendResetPasswordEmail: {
      onSuccess() {
        HomeDashboard.alertSuccess('Email sent');
      },
    },
    adminChangePassword: {
      onSuccess() {
        HomeDashboard.alertSuccess('Password reset');
      },
    },
  }
);
