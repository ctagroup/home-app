import moment from 'moment';
import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

const ERROR_EXPIRY_IN_MINUTES = 10;
const EXPIRY_IN_MINUTES = 60 * 24;

class HmisCacheCollection extends Mongo.Collection {
  getClient(clientId, schema, userId) {
    const _id = `client::${clientId}::${schema}`;
    const entry = super.findOne({
      _id,
      expiresAt: { $gte: new Date() },
    }) || {};

    if (entry.data) {
      return entry.data;
    }

    let data;
    let error;
    try {
      const hc = HmisClient.create(userId);
      data = hc.api('client').getClient(clientId, schema);
    } catch (err) {
      logger.warn('cache', err);
      error = err;
    } finally {
      super.upsert(_id, {
        data,
        error,
        type: 'client',
        createdAt: new Date(),
        expiresAt: moment(new Date()).add(
            !!error ? ERROR_EXPIRY_IN_MINUTES : EXPIRY_IN_MINUTES, 'm'
          )
          .toDate(),
        userId,
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

  getSurvey(surveyId, userId) {
    const _id = `survey::${surveyId}`;
    const entry = super.findOne({
      _id,
      expiresAt: { $gte: new Date() },
    }) || {};

    if (entry.data) {
      return entry.data;
    }

    let data;
    let error;
    try {
      const hc = HmisClient.create(userId);
      data = hc.api('survey2').getSurvey(surveyId);
    } catch (err) {
      logger.warn('cache', err);
      error = err;
    } finally {
      super.upsert(_id, {
        data,
        error,
        type: 'survey',
        createdAt: new Date(),
        expiresAt: moment(new Date()).add(
            !!error ? ERROR_EXPIRY_IN_MINUTES : EXPIRY_IN_MINUTES, 'm'
          )
          .toDate(),
        userId,
      });
    }
    return data;
  }

  getData(cacheKey, userId, noDataCallback, forceReload = false) {
    const _id = `data::${cacheKey}::${userId}`;
    if (!forceReload) {
      const entry = super.findOne({
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

    logger.debug('caching ', cacheKey);

    let data;
    let error;
    let originalError = false;

    try {
      data = noDataCallback();
    } catch (err) {
      logger.warn('cache', err);
      originalError = err;
      error = err;
    } finally {
      super.upsert(_id, {
        data,
        error,
        type: 'data',
        createdAt: new Date(),
        expiresAt: moment(new Date()).add(
            !!originalError ? ERROR_EXPIRY_IN_MINUTES : EXPIRY_IN_MINUTES, 'm'
          )
          .toDate(),
        userId,
      });
    }

    if (originalError) {
      throw originalError;
    }

    return data;
  }
}

export const HmisCache = new HmisCacheCollection('cache');
