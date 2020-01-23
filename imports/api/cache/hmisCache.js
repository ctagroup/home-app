import moment from 'moment';
import { logger as globalLogger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

const ERROR_EXPIRY_IN_MINUTES = 10;
const EXPIRY_IN_MINUTES = 5;

export const HmisCacheCollection = new Mongo.Collection('cache');

export class HmisCache {
  constructor({ hmisClient, userId, logger, hmisCacheCollection }) {
    this.userId = userId;
    this.hmisClient = hmisClient;
    this.logger = logger;
    this.collection = hmisCacheCollection;
  }

  getClient(clientId, schema) {
    const _id = `client::${clientId}::${schema}::${this.userId}`;

    const entry = this.collection.findOne({
      _id,
      expiresAt: { $gte: new Date() },
    }) || {};

    if (entry.data) {
      return entry.data;
    }

    this.logger.debug('caching ', _id);

    let data;
    let error;
    try {
      data = this.hmisClient.api('client').getClient(clientId, schema);
    } catch (err) {
      this.logger.warn('cache', err);
      error = err;
    } finally {
      this.collection.upsert(_id, {
        data,
        error,
        type: 'client',
        createdAt: new Date(),
        expiresAt: moment(new Date()).add(
            !!error ? ERROR_EXPIRY_IN_MINUTES : EXPIRY_IN_MINUTES, 'm'
          )
          .toDate(),
        userId: this.userId,
      });
    }
    const result = {
      clientId,
      schema,
      ...data,
    };

    if (error) {
      result.error = {
        message: error.message,
        statusCode: error.details.code,
      };
    }
    return result;
  }

  getSurvey(surveyId) {
    const _id = `survey::${surveyId}::${this.userId}`;
    const entry = this.collection.findOne({
      _id,
      expiresAt: { $gte: new Date() },
    }) || {};

    if (entry.data) {
      return entry.data;
    }

    this.logger.debug('caching ', _id);

    let data;
    let error;
    try {
      data = this.hmisClient.api('survey2').getSurvey(surveyId);
    } catch (err) {
      this.logger.warn('cache', err);
      error = err;
    } finally {
      this.collection.upsert(_id, {
        data,
        error,
        type: 'survey',
        createdAt: new Date(),
        expiresAt: moment(new Date()).add(
            !!error ? ERROR_EXPIRY_IN_MINUTES : EXPIRY_IN_MINUTES, 'm'
          )
          .toDate(),
        userId: this.userId,
      });
    }

    const result = {
      surveyId,
      ...data,
    };

    if (error) {
      result.error = {
        message: error.message,
        statusCode: error.details.code,
      };
    }
    return result;
  }

  getData(cacheKey, noDataCallback, forceReload = false) {
    const _id = `data::${cacheKey}::${this.userId}`;
    if (!forceReload) {
      const entry = this.collection.findOne({
        _id,
        expiresAt: { $gte: new Date() },
      }) || {};

      if (entry.data !== undefined) {
        return entry.data;
      }
      // For now, do not cache errors
      // if (entry.error !== undefined) {
      //   throw new Error(`${entry.error} (cached)`);
      // }
    }

    this.logger.debug('caching ', cacheKey, this.userId);

    let data;
    let error;
    let originalError = false;

    try {
      data = noDataCallback();
    } catch (err) {
      this.logger.warn('cache', err);
      originalError = err;
      error = err;
    } finally {
      this.collection.upsert(_id, {
        data,
        error,
        type: 'data',
        createdAt: new Date(),
        expiresAt: moment(new Date()).add(
            !!originalError ? ERROR_EXPIRY_IN_MINUTES : EXPIRY_IN_MINUTES, 'm'
          )
          .toDate(),
        userId: this.userId,
      });
    }

    if (originalError) {
      throw originalError;
    }

    return data;
  }


  static create(userId) {
    // use this function when cache cannot be injected via DI
    // remove in the future
    const hmisClient = HmisClient.create(userId);
    const logger = globalLogger;
    return new HmisCache({
      hmisClient,
      userId,
      logger,
      hmisCacheCollection: HmisCacheCollection,
    });
  }
}

