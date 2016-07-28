/**
 * Created by udit on 12/12/15.
 */
Template.login.helpers(
  {
    atDisabled() {
      return AccountsTemplates.disabled();
    },
    atClass() {
      return AccountsTemplates.disabled() ? 'disabled' : 'active';
    },
  }
);
