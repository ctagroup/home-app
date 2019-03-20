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
      Meteor.call('tagApi', 'createClientTag', { operation: 1, ...data }, (err, res) => {
        if (!err) ClientTags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
      });
  },
  removeClientTagHandler() {
    return ({ _id }) => ClientTags._collection.remove({ _id }); // eslint-disable-line
  },
});
