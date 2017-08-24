import './housingUnitForm';
import './housingUnitsCreateView.html';

Template.housingUnitCreateView.events(
  {
    'click .createHousing': (evt, tmpl) => {
      const aliasName = tmpl.find('.name').value;
      const bedsCurrent = tmpl.find('.beds_avail').value;
      const bedsCapacity = tmpl.find('.beds_cap').value;
      const projectId = tmpl.find('.project_id').value;
      const familyUnit = tmpl.find('input[name="family_unit"]:checked').value;
      const inactive = tmpl.find('input[name="inactive"]:checked').value;
      const inService = tmpl.find('input[name="in_service"]:checked').value;
      const vacant = tmpl.find('input[name="vacant"]:checked').value;
      const housingObject = {
        inactive,
        bedsCurrent,
        projectId,
        bedsCapacity,
        familyUnit,
        inService,
        vacant,
        aliasName,
      };
      Meteor.call('housingUnits.create', housingObject,
        (err) => {
          if (err) {
            Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Housing unit created!', 'success', 'growl-top-right');
            // Router.go('/housingUnits');
          }
        }
      );
    },
  }
);
