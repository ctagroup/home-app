import TagList from '/imports/ui/components/tags/TagList.js';
import './tagListView.html';

Template.tagListView.helpers({
  component() {
    return TagList;
  },
});
