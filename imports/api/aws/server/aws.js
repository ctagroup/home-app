import AWS from 'aws-sdk';
import { logger } from '/imports/utils/logger';

const s3 = new AWS.S3({
  accessKeyId: Meteor.settings.s3config.key,
  secretAccessKey: Meteor.settings.s3config.secret,
  params: { Bucket: Meteor.settings.s3config.bucket },
  logger,
});

const SIGNATURES_PREFIX = 'consent signatures';

Meteor.methods({
  's3bucket.get'(clientId, resource) {
    // TODO: permission check
    return new Promise((resolve, reject) => {
      s3.getObject({
        Key: `${SIGNATURES_PREFIX}/${clientId}/${resource}`,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Body);
        }
      });
    })
    .then(body => String.fromCharCode.apply(null, body))
    .await();
  },
  's3bucket.put'(clientId, resource, data) {
    // TODO: permission check
    return new Promise((resolve, reject) => {
      s3.upload({
        Key: `${SIGNATURES_PREFIX}/${clientId}/${resource}`,
        Body: data,
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }).await();
  },
  's3bucket.list'(clientId) {
    return new Promise((resolve, reject) => {
      s3.listObjects({
        Prefix: `${SIGNATURES_PREFIX}/${clientId}`,
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }).await();
  },
});
