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
    return (name, score) =>
      Meteor.call('tagApi', 'createTag', { name, score }, (err, res) => {
        // console.log('tags.create', name, err, res);
        if (!err) Tags._collection.insert({ _id: res.id, ...res }); // eslint-disable-line
      });
  },

  removeTag() {
    return (id) => Tags._collection.remove(id); // eslint-disable-line
      // Meteor.call('tagApi', 'deleteTag', id, (err, res) => {
      //   console.log('deleteTag', err, res);
      //   if (!err) Tags._collection.remove(id); // eslint-disable-line
      //   // console.log('tags.delete', id, err, res);
      // });
  },
  updateTag() {
    return (id, name, score) =>
      Meteor.call('tagApi', 'updateTag', id, { name, score }, (err, res) => {
        console.log('updateTag', err, res);
        if (!err) Tags._collection.upsert(id, {$set: res}); // eslint-disable-line
        // console.log('tags.delete', id, err, res);
      });
  },
});
