/**
 * Created by udit on 02/10/16.
 */

globalHouseholdsHelpers = {
  generateMemberHtml(client) {
    return `<tr id="${client.clientId}">
              <td class="clientID">${client.clientId}</td>
              <td class="clientName">${client.clientName}</td>
              <td>
                <select class="relationshiptohoh" name="relationshiptohoh">
                  <option value="1">Self</option>
                  <option value="2">Head of household’s child</option>
                  <option value="3">Head of household’s spouse or partner</option>
                  <option value="4">
                    Head of household’s other relation member (other relation to head of household)
                  </option>
                  <option value="5">Other:  non-relation member</option>
                </select>
                <input type="hidden" name="householdMembershipId" class="householdMembershipId"
                  value="" />
              </td>
              <td>
                <input type="radio" class="ihoh" name="ishoh" value=${client.clientId} />
              </td>
              <td>
                <a href="#" class="btn btn-danger deleteMember"><i class="fa fa-remove"></i></a>
              </td>
            </tr>`;
  },
};
