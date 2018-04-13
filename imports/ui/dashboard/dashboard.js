import FeatureDecisions from '/imports/both/featureDecisions';
import './dashboardHome';
import './dashboardMc211';
import './dashboard.html';


Template.dashboard.helpers({
  dashboardTemplate() {
    const featureDecisions = FeatureDecisions.createFromMeteorSettings();
    return featureDecisions.isMc211App() ?
      'dashboardMc211' : 'dashboardHome';
  },
});
