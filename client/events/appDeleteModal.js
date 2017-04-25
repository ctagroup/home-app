/**
 * Created by udit on 27/07/16.
 */
import { logger } from '/imports/utils/logger';

Template.AppDeleteModal.events({
  'click #confirm-delete': () => {
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
  },
});
