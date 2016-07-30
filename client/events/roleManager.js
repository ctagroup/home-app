/**
 * Created by udit on 26/07/16.
 */

Template.roleManager.onRendered(
  () => {
    $('.js-tooltip').tooltip();
  }
);

Template.roleManager.events(
  {
    'click .js-update': (e) => {
      e.preventDefault();
      const serializeInput = $('#js-frm-role-manager').serializeArray();
      $('#js-frm-role-manager :input').attr('disabled', true);
      Meteor.call(
        'updateRolePermissions', serializeInput, (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
          $('#js-frm-role-manager :input').attr('disabled', false);
        }
      );
    },
    'click .js-reset': (e) => {
      e.preventDefault();
      Meteor.call(
        'resetRolePermissions', (error, result) => {
          if (error) {
            logger.log(error);
          } else {
            logger.log(result);
          }
        }
      );
    },
  }
);
