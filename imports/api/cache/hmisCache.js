import { logger } from '/imports/utils/logger';
import { HmisClient } from '/imports/api/hmisApi';

class HmisCacheCollection extends Mongo.Collection {
  getClient(clientId, schema, userId) {
    const _id = `client::${clientId}::${schema}`;
    const entry = super.findOne(_id) || {};
    let data = entry.data;

    if (data) {
      return data;
    }

    try {
      logger.debug('caching ', _id);
      const hc = HmisClient.create(userId);
      data = hc.api('client').getClient(clientId, schema);
    } catch (err) {
      logger.warn('cache', err);
      data = {
        error: err.reason || 'Error',
      };
    } finally {
      super.insert({
        _id,
        data,
        type: 'client',
        createdAt: new Date(),
        userId,
      });
    }
    return data;
  }

  getSurvey(surveyId, userId) {
    const _id = `survey::${surveyId}`;
    const entry = super.findOne(_id) || {};
    let data = entry.data;

    if (data) {
      return data;
    }

    try {
      logger.debug('caching ', _id);
      const hc = HmisClient.create(userId);
      data = hc.api('survey2').getSurvey(surveyId);
    } catch (err) {
      logger.warn('cache', err);
      data = {
        error: err.reason || 'Error',
      };
    } finally {
      super.insert({
        _id,
        data,
        type: 'survey',
        createdAt: new Date(),
        userId,
      });
    }
    return data;
  }
}

export const HmisCache = new HmisCacheCollection('cache');
