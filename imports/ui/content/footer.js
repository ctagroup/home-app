import AppSettings from '/imports/api/appSettings/appSettings';
import './footer.html';

Template.Footer.helpers({
  currentYear: new Date().getFullYear(),

  buildInfo() {
    return AppSettings.get('buildInfo', '');
  },
});
