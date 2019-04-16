import './clientTagList.html';
import ClientTagList from '/imports/ui/components/tags/ClientTagList.js';
import { Tags } from '/imports/api/tags/tags.js';
import { ClientTags } from '/imports/api/tags/clientTags.js';
import { setAppContext } from '/imports/ui/app/appContext';
import { getActiveTagsForDate } from '/imports/api/tags/tags';

const getBonusScore = () => {
  const clientTags = ClientTags.find().fetch();
  const now = moment().format('YYYY-MM-DD');
  const activeTags = getActiveTagsForDate(clientTags, now);
  const activeTagScores = activeTags.map((tag) => tag.score);
  return _.max(activeTagScores);
};

Template.clientTagListView.helpers({
  component() {
    return ClientTagList;
  },
  tags() {
    return Tags.find().fetch();
  },
  clientTags() {
    return ClientTags.find().fetch();
  },
  newClientTagHandler() {
    return (res) => {
      ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
      Meteor.call('updateBonusScore', res.clientId, getBonusScore());
    };
    // return (data) =>
    //   Meteor.call('tagApi', 'createClientTag', { operation: 1, ...data }, (err, res) => {
    //     if (!err) ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
    //   });
  },
  removeClientTagHandler() {
    return (res) => {
      ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
      Meteor.call('updateBonusScore', res.clientId, getBonusScore());
    };
  },
  setAppContext() {
    return (key, data) => setAppContext(key, { ...this, ...data });
  },
});
