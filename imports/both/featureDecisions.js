export default class FeatureDecisions {
  constructor(features) {
    this.features = features;
  }

  isSubmissionUploader() {
    return this.features.uploader === true;
  }

  isMc211App() {
    return this.features.appProfile === 'mc211';
  }

  static createFromMeteorSettings() {
    return new FeatureDecisions(Meteor.settings.public.features || []);
  }
}
