import FeatureDecisions from '/imports/both/featureDecisions';
import './dashboardHome';
import './dashboardMonterey';
import './dashboardMc211';
import './dashboard.html';


Template.dashboard.helpers({
  dashboardTemplate() {
    const featureDecisions = FeatureDecisions.createFromMeteorSettings();
    if (featureDecisions.isMc211App()) return 'dashboardMc211';
    if (featureDecisions.isMontereyApp()) return 'dashboardMonterey';
    return 'dashboardHome';
  },
});
