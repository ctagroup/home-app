export default class FeatureDecisions {
  constructor(features) {
    this.features = features;
  }

  showSimpleUserProfile() {
    return !!this.features.showSimpleUserProfile;
  }

  static createFromMeteorSettings() {
    return new FeatureDecisions(Meteor.settings.public.features);
  }
}
