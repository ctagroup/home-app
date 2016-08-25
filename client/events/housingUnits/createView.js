/**
 * Created by Mj on 24-Aug-16.
 */

Template.housingUnitCreateView.events(
  {
    'click .createHousing': (evt, tmpl) => {
      // ResponseHelpers.saveResponse('Paused', tmpl);
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
      Meteor.call('createHouseUnit', housingObject,
        (error, result) => {
          if (error) {
            // console.log(error);
          } else {
            const clientId = result;
            // console.log(result);
            logger.info(clientId);
            Router.go('/housingUnits');
            // Router.go('viewClient', { _id: clientId });
          }
        }
      );
    },
  }
);
