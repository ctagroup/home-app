/**
 * Created by udit on 06/10/16.
 */
import { GlobalHouseholds } from '/imports/api/global-households/global-households';


Template.globalHouseholdEditView.helpers(
  {
    isActive(currentVal) {
      const globalHousehold = GlobalHouseholds.findOne({ _id: Router.current().params._id });
      if (globalHousehold && globalHousehold.inactive === currentVal) {
        return 'checked';
      }
      return '';
    },
  }
);
