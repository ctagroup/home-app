import moment from 'moment';
import { Mongo } from 'meteor/mongo';

// client-side collection for tags data
export const Tags = Meteor.isClient ? new Mongo.Collection('tags') : undefined;


export function dateOnly(m) {
  const dateString = moment(m).format('YYYY-MM-DD');
  return moment(dateString);
}

export function getActiveTagsForDate(clientTags, dateStr) {
  const activeDateInMs = moment(dateStr).valueOf();
  return clientTags
    .map(cTag => ({ appliedOnMs: dateOnly(cTag.appliedOn).valueOf(), ...cTag }))
    .filter(({ appliedOnMs }) => appliedOnMs <= activeDateInMs)
    .sort((a, b) => moment(b) - moment(a));
}

export function getClientTagsSummary(clientTags, dateStr) {
  const active = getActiveTagsForDate(clientTags, dateStr);
  const summary = active.reduce((all, cTag) => ({
    ...all,
    [cTag.tag.id]: {
      operation: cTag.operation,
      tag: cTag.tag,
    },
  }), {})
  ;
  return Object.values(summary);
}


export function getActiveTagNamesForDate(clientTags, dateStr) {
  const summary = getClientTagsSummary(clientTags, dateStr);

  return summary
    .filter(tag => tag.operation)
    .map(tag => tag.tag.name)
    ;
}
