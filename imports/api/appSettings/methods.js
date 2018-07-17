Meteor.methods({
  'app.buildInfo'() {
    const { GIT_BRANCH, GIT_TAG, GIT_COMMIT } = process.env;
    return (GIT_BRANCH || GIT_TAG || GIT_COMMIT) ?
      `${GIT_TAG || '?'} (${(GIT_COMMIT || '?').substr(0, 4)}/${GIT_BRANCH || '?'})` : 'dev';
  },
});
