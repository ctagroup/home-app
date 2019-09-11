import AWS from 'aws-sdk';


export function utf8ArrayToStr(array) {
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


class S3StorageService {
  constructor({ meteorSettings, logger }) {
    this.s3 = new AWS.S3({
      accessKeyId: meteorSettings.s3config.key,
      secretAccessKey: meteorSettings.s3config.secret,
      params: {
        Bucket: meteorSettings.s3config.bucket,
      },
      logger,
    });
    this.logger = logger;
  }

  getObjectAsync(filePath) {
    return new Promise((resolve, reject) => {
      this.s3.getObject({
        Key: filePath,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          // resolve(utf8ArrayToStr(data.Body));
          resolve(data.Body);
        }
      });
    });
  }

  deleteObjectAsync(filePath) {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject({
        Key: filePath,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  getObjectAsUtfStringAsync(filePath) {
    return new Promise((resolve, reject) => {
      this.s3.getObject({
        Key: filePath,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(utf8ArrayToStr(data.Body));
        }
      });
    });
  }

  uploadAsync(filePath, data) {
    this.logger.debug('upload started', filePath);
    return new Promise((resolve, reject) => {
      this.s3.upload({
        Key: filePath,
        Body: data,
      }, (err, res) => {
        this.logger.debug('upload completed', !!err);
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  listObjectsAsync(prefix) {
    return new Promise((resolve, reject) => {
      this.s3.listObjects({
        Prefix: prefix,
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default S3StorageService;
