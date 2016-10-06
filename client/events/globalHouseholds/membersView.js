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

      if ($('.globalHouseholdMembers').children().length < 1) {
        const tr = $('<tr class="no-household-members-found-row"></tr>');
        const td = $('<td class="bg-warning text-warning" colspan="5"></td>');
        td.html('No Household members found. Search clients to add them into global household.');
        tr.append(td);
        $('.globalHouseholdMembers').append(tr);
      }
    },
  }
);
