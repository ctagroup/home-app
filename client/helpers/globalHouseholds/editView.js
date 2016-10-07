/**
 * Created by udit on 06/10/16.
 */

Template.globalHouseholdEditView.helpers(
  {
    isActive(currentVal) {
      const globalHousehold = globalHouseholds.findOne({ _id: Router.current().params._id });
      if (globalHousehold && globalHousehold.inactive == currentVal) {
        return 'checked';
      }
      return '';
    },
  }
);
