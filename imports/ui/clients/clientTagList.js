import './clientTagList.html';
import ClientTagList from '/imports/ui/components/tags/ClientTagList.js';
import { Tags } from '/imports/api/tags/tags.js';
import { ClientTags } from '/imports/api/tags/clientTags.js';

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
    return (data) =>
      Meteor.call('clientTags.create', data, (err, res) => {
        if (!err) ClientTags._collection.insert(res); // eslint-disable-line
        // console.log('clientTags.create', err, res);
      });
  },
  removeClientTagHandler() {
    return (tagId, date) =>
    Meteor.call('clientTags.delete', tagId, date, (err /* , res*/) => {
      if (!err) ClientTags._collection.remove(tagId); // eslint-disable-line
      // console.log('clientTags.delete', err, res);
    });
  },
});
