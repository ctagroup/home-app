/**
 * Created by udit on 02/10/16.
 */

Template.globalHouseholdMembers.events(
  {
    'click .deleteMember': (evt) => {
      // remove the whole TR tag
      $(evt.currentTarget).parent()
        .parent()
        .remove();
    },
  }
);
