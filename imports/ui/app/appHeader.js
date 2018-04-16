import '../agencies/projectSelect';
import './appHeader.html';


Template.AppHeader.helpers({
  appName() {
    return Meteor.settings.public.appName
      || Meteor.settings.public.features.appProfile
      || 'H O M E';
  },
});
