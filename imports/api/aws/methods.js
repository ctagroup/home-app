import moment from 'moment';

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
    // legacy method, use slingshot instead
    const { logger, s3storageService } = this.context;
    logger.info(`METHOD[${this.userId}]: s3bucket.put`, clientId, resource, data.length);
    const path = `${SIGNATURES_PREFIX}/${clientId}/${resource}`;
    // TODO: permission check
    return s3storageService.uploadAsync(path, data).await();
  },

  's3bucket.list'(rootDir = '') {
    const { s3storageService } = this.context;
    const result = s3storageService.listObjectsAsync(rootDir).await();
    return result;
  },

  's3bucket.getObject'(resourcePath) {
    const { s3storageService } = this.context;
    // TODO: permission check
    const buffer = s3storageService.getObjectAsync(resourcePath).await();
    return buffer;
  },

  's3bucket.getClientFile'(dedupClientId, resourcePath) {
    // using s3bucket.getClientFileDownloadLink is preferred
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
    return s3storageService.getObjectDownloadLinkAsync(path, expiryInSeconds).await();
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

  's3bucket.importSignatures'(first = '0') {
    const { hmisClient, logger } = this.context;
    const allowed = '0123456789abcdef';
    for (let i = allowed.indexOf(first); i < allowed.length; i++) {
      const key = `consent signatures/${allowed.charAt(i)}`;
      const files = Meteor.call('s3bucket.list', key).Contents;
      return files.reduce((result, file) => {
        const [, clientId, type] = file.Key.split('/');
        if (type === 'signature') {
          if (file.Size === 0) {
            logger.warn(clientId, 'Empty signature');
            return {
              ...result,
              emptySignature: result.emptySignature + 1,
            };
          }

          const searchResults = hmisClient.api('client').searchClient(clientId);
          if (searchResults.length === 0) {
            logger.warn(clientId, 'Client not found');
            return {
              ...result,
              notFound: result.notFound + 1,
            };
          }

          const dedupClientId = searchResults[0].dedupClientId;

          const existingRois = Meteor.call('roiApi', 'getRoisForClient', dedupClientId);
          if (existingRois.length) {
            logger.warn(clientId, 'ROI already exists');
            return {
              ...result,
              roiExists: result.roiExists + 1,
            };
          }

          const roiData = {
            clientId: dedupClientId,
            startDate: moment(file.LastModified).format('YYYY-MM-DD'),
            endDate: moment(file.LastModified).add(3, 'Y').format('YYYY-MM-DD'),
            notes: 'ROI migrated from legacy HOME',
            signature: Meteor.call('s3bucket.get', clientId, 'signature'),
          };

          Meteor.call('roiApi', 'createRoi', roiData);
          logger.info('ROI created');
          return {
            ...result,
            success: result.success + 1,
          };
        }
        return result;
      }, { notFound: 0, emptySignature: 0, roiExists: 0, success: 0 });
    }
  },
});
