const SIGNATURES_PREFIX = 'consent signatures';

Meteor.injectedMethods({
  's3bucket.get'(clientId, resource) {
    // legacy method, use s3bucket.getClientFile instead
    const { logger, s3storageService } = this.context;
    logger.info(`METHOD[${this.userId}]: s3bucket.get`, clientId, resource);
    const path = `${SIGNATURES_PREFIX}/${clientId}/${resource}`;
    // TODO: permission check
    return s3storageService.getObjectAsUtfStringAsync(path).await();
  },

  's3bucket.put'(clientId, resource, data) {
    // legacy method, use s3bucket.uploadClientFile instead
    const { logger, s3storageService } = this.context;
    logger.info(`METHOD[${this.userId}]: s3bucket.put`, clientId, resource, data.length);
    const path = `${SIGNATURES_PREFIX}/${clientId}/${resource}`;
    // TODO: permission check
    return s3storageService.uploadAsync(path, data).await();
  },

  's3bucket.list'(rootDir = '') {
    const { s3storageService } = this.context;
    return s3storageService.listObjectsAsync(rootDir).await();
  },

  's3bucket.getObject'(resourcePath) {
    const { s3storageService } = this.context;
    // TODO: permission check
    const buffer = s3storageService.getObjectAsync(resourcePath).await();
    return buffer;
  },

  's3bucket.getClientFile'(dedupClientId, resourcePath) {
    const { logger, s3storageService } = this.context;
    const path = `clients/${dedupClientId}/${resourcePath}`;
    logger.debug('getting client file', path);
    // TODO: permission check
    const buffer = s3storageService.getObjectAsync(path).await();

    // uncomment to verify that the file is saved correcty server-side
    // console.log(buffer.length, buffer);
    // var fs = require('fs');
    // const xx = `/tmp/downloaded_${resourcePath.split('/').pop()}`;
    // console.log(xx);
    // fs.writeFileSync(xx, buffer);

    const base64data = buffer.toString('base64');

    logger.debug('sending file content to client');

    return base64data; // return binary data? buffer.toString('binary')
  },

  's3bucket.getClientFileDownloadLink'(dedupClientId, resourcePath) {
    const { logger, s3storageService } = this.context;
    const path = `clients/${dedupClientId}/${resourcePath}`;
    logger.debug('getting client file', path);
    // TODO: permission check
    const expiryInSeconds = 60;
    return s3storageService.getObjectLinkAsync(path, expiryInSeconds).await();
  },

  's3bucket.uploadClientFile'(dedupClientId, resourcePath, base64data) {
    const { logger, s3storageService } = this.context;
    const path = `clients/${dedupClientId}/${resourcePath}`;
    logger.debug('uploading client file', path);

    const buffer = new Buffer(base64data, 'base64');
    const binaryBuffer = Buffer.from(buffer, 'binary');

    // uncomment to verify that the file is passed correcty from client to server
    // var fs = require('fs');
    // const xx = `/tmp/uploaded_${resourcePath.split('/').pop()}`;
    // console.log(xx);
    // fs.writeFileSync(xx, buffer);

    // TODO: permission check
    return s3storageService.uploadAsync(path, binaryBuffer).await();
  },

  's3bucket.deleteClientFile'(dedupClientId, resourcePath) {
    const { logger, s3storageService } = this.context;
    const path = `clients/${dedupClientId}/${resourcePath}`;
    logger.debug('getting client file', path);
    // TODO: permission check
    return s3storageService.deleteObjectAsync(path).await();
  },

  's3bucket.listClientFiles'(dedupClientId, resourcePath) {
    const { s3storageService } = this.context;
    const path = `clients/${dedupClientId}/${resourcePath}`;
    return s3storageService.listObjectsAsync(path).await();
  },

});
