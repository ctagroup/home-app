import Tags from '/imports/api/tags/tags.js';
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
    return (name) => Meteor.call('tags.create', name);
  },
});
