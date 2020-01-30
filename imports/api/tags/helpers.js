import moment from 'moment';
import { getActiveTagsForDate } from '/imports/api/tags/tags';
import { Tags } from '/imports/api/tags/tags.js';
import { ClientTags } from '/imports/api/tags/clientTags.js';


export const getBonusScore = () => {
  // const tags = Tags.find().fetch();
  const uniqTagNames = ['Medically Frail', 'MC-WPC', 'SBC-WPC'];
  const uniqTags = uniqTagNames.map((name) => Tags.findOne({ name }));
  const uniqTagIds = uniqTags.map((tag) => tag && tag.id);

  const clientTags = ClientTags.find().fetch();
  const now = moment().format('YYYY-MM-DD');
  let uniqTagFlag = false;
  const activeTags = getActiveTagsForDate(clientTags, now)
    .reduce((acc, tag) => {
      if (uniqTagIds.includes(tag.id)) {
        uniqTagFlag = true;
        return acc;
      }
      return [...acc, tag];
    }, []);
  const activeTagScores = activeTags.reduce((acc, tag) => acc + tag.tag.score, 0);
  if (uniqTagFlag) return activeTagScores + uniqTags[0].score;
  return activeTagScores;
};
