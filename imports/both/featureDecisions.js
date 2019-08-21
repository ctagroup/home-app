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

  isSkidrowApp() {
    return this.features.appProfile === 'skidrow';
  }

  isMontereyApp() {
    return this.features.appProfile === 'monterey';
  }

  static createFromMeteorSettings() {
    return new FeatureDecisions(Meteor.settings.public.features || []);
  }
}
