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
    logger.info(`METHOD[${Meteor.userId()}]: s3bucket.get`, clientId, resource);
    return new Promise((resolve, reject) => {
      const params = {
        Key: `${SIGNATURES_PREFIX}/${clientId}/${resource}`,
      };
      s3.getObject(params, (err, data) => {
        if (err) {
          logger.error('Failed to download s3 ', resource, err);
          reject(err);
        } else {
          resolve(data.Body);
        }
      });
      // http://docs.amazonaws.cn/en_us/AWSJavaScriptSDK/guide/node-examples.html
      // s3.getSignedUrl('getObject', params, (err, url) => {
      //   logger.info('s3bucket.get The URL is', url);
      // });
    })
    .then(body => body.toString())
    // .then(body => String.fromCharCode.apply(null, body))
    .await();
  },
  's3bucket.put'(clientId, resource, data) {
    logger.info(`METHOD[${Meteor.userId()}]: s3bucket.put`, clientId, resource);
    // TODO: permission check
    return new Promise((resolve, reject) => {
      s3.upload({
        Key: `${SIGNATURES_PREFIX}/${clientId}/${resource}`,
        Body: data,
      }, (err, res) => {
        if (err) {
          logger.error('Failed to upload to s3', err);
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
