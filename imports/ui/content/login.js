import './login.html';

Template.Login.helpers({
  atDisabled() {
    return AccountsTemplates.disabled();
  },
  atClass() {
    return AccountsTemplates.disabled() ? 'disabled' : 'active';
  },
});


Template.Login.onRendered(() => {
  $('#at-HMIS').html('<img src="/imgs/logo/home-circle-neg.png" /> Sign In to HOME');
});
