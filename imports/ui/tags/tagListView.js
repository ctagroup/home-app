import { Tags } from '/imports/api/tags/tags.js';
import TagList from '/imports/ui/components/tags/TagList.js';
import './tagListView.html';

Template.tagListView.helpers({
  component() {
    return TagList;
  },

  tags() {
    return Tags.find().fetch();
  },

  createNewTag() {
    return (name) =>
      Meteor.call('tags.create', name, (err, res) => {
        // console.log('tags.create', name, err, res);
        if (!err) Tags._collection.insert(res); // eslint-disable-line
      });
  },

  removeTag() {
    return (id) =>
      Meteor.call('tags.delete', id, (err /* , res*/) => {
        if (!err) Tags._collection.remove(id); // eslint-disable-line
        // console.log('tags.delete', id, err, res);
      });
  },
});
