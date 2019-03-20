import moment from 'moment';
import { Mongo } from 'meteor/mongo';

// client-side collection for tags data
export const Tags = Meteor.isClient ? new Mongo.Collection('tags') : undefined;


export function dateOnly(m) {
  const dateString = moment(m).format('YYYY-MM-DD');
  return moment(dateString);
}


export function getActiveTagNamesForDate(clientTags, dateStr) {
  const activeDateInMs = moment(dateStr).valueOf();

  const tagsActivityMap = clientTags
    .map(cTag => ({ appliedOnMs: dateOnly(cTag.appliedOn).valueOf(), ...cTag }))
    .filter(({ appliedOnMs }) => appliedOnMs <= activeDateInMs)
    .sort((a, b) => a.appliedOnMs - b.appliedOnMs)
    .reduce((all, cTag) => ({
      ...all,
      [cTag.tag.name]: cTag.operation,
    }), {})
    ;

  const activeTagNames = Object.keys(tagsActivityMap).filter(key => tagsActivityMap[key]);
  return activeTagNames;
}
