import { Slingshot } from 'meteor/edgee:slingshot';
import {
  UpdateReferralsPermission,
} from '/imports/config/permissions';


const MB = 1024 * 1024;

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
    region: Meteor.settings.s3config.region || 'us-west-2',
    acl: 'bucket-owner-full-control',

    authorize(file, metaContext) {
      const canUpload = Roles.userIsInRole(this.userId, UpdateReferralsPermission);

      if (!metaContext.dedupClientId) {
        throw new Meteor.Error(400, 'No dedupClientId');
      }

      if (!canUpload) {
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
