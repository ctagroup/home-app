import './clientTagList.html';
import ClientTagList from '/imports/ui/components/tags/ClientTagList.js';
import { Tags } from '/imports/api/tags/tags.js';
import { ClientTags } from '/imports/api/tags/clientTags.js';
import { setAppContext } from '/imports/ui/app/appContext';


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
      const dedupClientId = res.clientId;
      return new Promise((resolve, reject) => {
        Meteor.call('eligibleClients.updateBonusScore', dedupClientId, (err, res2) => {
          if (err) reject(err);
          else resolve(res2);
        });
      });
    };
    // return (data) =>
    //   Meteor.call('tagApi', 'createClientTag', { operation: 1, ...data }, (err, res) => {
    //     if (!err) ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
    //   });
  },
  removeClientTagHandler() {
    return (res) => {
      ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
      const dedupClientId = res.clientId;
      return new Promise((resolve, reject) => {
        Meteor.call('eligibleClients.updateBonusScore', dedupClientId, (err, res2) => {
          if (err) reject(err);
          else resolve(res2);
        });
      });
    };
  },
  setAppContext() {
    return (key, data) => setAppContext(key, { ...this, ...data });
  },
});
