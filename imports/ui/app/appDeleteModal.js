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
  operationText() {
    const ctx = getAppContext('appDeleteModal') || {};
    return ctx.operationText || 'Delete';
  },
  operationButton() {
    const ctx = getAppContext('appDeleteModal') || {};
    return (ctx.operation !== undefined && ctx.operation ? 'btn-danger' : 'btn-success')
      || 'btn-danger';
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

    /*
    const collection = Session.get('admin_collection_name');
    const _id = Session.get('admin_id');
    if (collection === 'globalHouseholds') {
      Meteor.call('deleteHousehold', _id, (e, r) => {
        logger.info(e);
        logger.info(r);
      });
      $('#app-delete-modal').modal('hide');
      location.reload();
    } else if (collection === 'housingUnits') {
      Meteor.call('deleteHousing', _id, (err, res) => {
        logger.info(`Delete: ${err}`);
        logger.info(`Delete: ${res}`);
      });
      $('#app-delete-modal').modal('hide');
      location.reload();
    } else if (collection === 'questions') {
      Meteor.call('deleteQuestion', _id, (err, res) => {
        if (err) {
          logger.error(`Error deleting question: ${err}`);
        } else {
          logger.info(`Success deleting question: ${res}`);
        }
      });
      $('#app-delete-modal').modal('hide');
      location.reload();
    } else {
      Meteor.call('adminRemoveDoc', collection, _id, (e, r) => {
        logger.info(e);
        logger.info(r);
      });
      $('#app-delete-modal').modal('hide');
    }
    */
  },
});
