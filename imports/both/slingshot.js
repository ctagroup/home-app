import { Slingshot } from 'meteor/edgee:slingshot';

const MB = 1024 * 1024;

console.log('slingshot', Slingshot);

Slingshot.fileRestrictions('referrals', {
  // allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  allowedFileTypes: /.+/,
  maxSize: 10 * MB,
});

if (Meteor.isServer) {
  Slingshot.createDirective('referrals', Slingshot.S3Storage, {
    bucket: Meteor.settings.s3config.bucket,
    AWSAccessKeyId: Meteor.settings.s3config.key,
    AWSSecretAccessKey: Meteor.settings.s3config.secret,
    region: Meteor.settings.s3config.region,
    acl: 'bucket-owner-full-control',

    authorize(file, metaContext) {
      console.log('authorize', file, metaContext, this.userId);
      // deny uploads if user is not logged in.
      if (!this.userId) {
        throw new Meteor.Error(403, 'Login Required');
      }

      return true;
    },

    key(file, metaContext) {
      const { dedupClientId, matchId, step, fileId, ext } = metaContext;

      const key = `clients/${dedupClientId}/matching/${matchId}/${step}/${fileId}${ext}`;
      console.log('key', key);
      return key;
    },
  });
}
