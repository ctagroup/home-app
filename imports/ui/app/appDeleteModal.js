import { logger } from '/imports/utils/logger';
import { getAppContext } from '/imports/ui/app/appContext';
import './appDeleteModal.html';


Template.AppDeleteModal.helpers({
  title() {
    const ctx = getAppContext('appDeleteModal') || {};
    return ctx.title || 'Confirm delete';
  },
  text() {
    const ctx = getAppContext('appDeleteModal') || {};
    return ctx.message || 'Are you sure?';
  },
});

Template.AppDeleteModal.events({
  'click #confirm-delete': (event) => {
    const ctx = getAppContext('appDeleteModal');
    $(event.target).addClass('disabled');
    Meteor.apply(ctx.method, ctx.args, (error, result) => {
      $(event.target).removeClass('disabled');
      if (error) {
        Bert.alert(error.reason || error.message, 'danger', 'growl-top-right');
        logger.error(ctx.method, ctx.args, error);
        if (ctx.onError) {
          ctx.onError(error);
        }
      } else {
        logger.info(ctx.method, ctx.args);
        Bert.alert('Deleted!', 'success', 'growl-top-right');
        if (ctx.onSuccess) {
          ctx.onSuccess(result);
        }
      }
      $('#app-delete-modal').modal('hide');
    });
  },
});
