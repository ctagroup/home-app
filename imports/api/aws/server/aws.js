import AWS from 'aws-sdk';
import { logger } from '/imports/utils/logger';

const s3 = new AWS.S3({
  accessKeyId: Meteor.settings.s3config.key,
  secretAccessKey: Meteor.settings.s3config.secret,
  params: { Bucket: Meteor.settings.s3config.bucket },
  logger,
});

const SIGNATURES_PREFIX = 'consent signatures';

function utf8ArrayToStr(array) {
  const len = array.length;
  let out = '';
  let i = 0;
  let c;
  let char2;
  let char3;

  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                      ((char2 & 0x3F) << 6) |
                      ((char3 & 0x3F) << 0));
        break;
      default:
        break;
    }
  }

  return out;
}

Meteor.methods({
  's3bucket.get'(clientId, resource) {
    logger.info(`METHOD[${this.userId}]: s3bucket.get`, clientId, resource);
    // TODO: permission check
    return new Promise((resolve, reject) => {
      s3.getObject({
        Key: `${SIGNATURES_PREFIX}/${clientId}/${resource}`,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(utf8ArrayToStr(data.Body));
        }
      });
    })
    .await();
  },
  's3bucket.put'(clientId, resource, data) {
    logger.info(`METHOD[${this.userId}]: s3bucket.put`, clientId, resource, data.length);
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
