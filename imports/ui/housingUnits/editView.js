/**
 * Created by Mj on 25-Aug-16.
 */
import { logger } from '/imports/utils/logger';

Template.housingUnitEditView.events(
  {
    'click .update_housing': (evt, tmpl) => {
      const housingInventoryId = Template.currentData()._id;
      const aliasName = tmpl.find('.name').value;
      const bedsCurrent = tmpl.find('.beds_avail').value;
      const bedsCapacity = tmpl.find('.beds_cap').value;
      const projectId = tmpl.find('.project_id').value;
      const familyUnit = tmpl.find('input[name="family_unit"]:checked').value;
      const inactive = tmpl.find('input[name="inactive"]:checked').value;
      const inService = tmpl.find('input[name="in_service"]:checked').value;
      const vacant = tmpl.find('input[name="vacant"]:checked').value;
      // Printing.
      const housingObject = {
        inactive,
        housingInventoryId,
        bedsCurrent,
        projectId,
        userId: Meteor.user().services.HMIS.id,
        bedsCapacity,
        familyUnit,
        inService,
        vacant,
        aliasName,
      };
      logger.info(`Create Housing: ${JSON.stringify(housingObject, null, 2)}`);
      Meteor.call('updateHouseUnit', housingObject,
        (err, result) => {
          if (err) {
            Bert.alert(err.reason || err.error, 'error', 'growl-top-right');
          } else {
            // receives complete object and not just client ID.
            logger.info(result);
            Router.go('/housingUnits');
          }
        }
      );
    },
    'click .cancel_housing': () => {
      history.back();
    },
  }
);
