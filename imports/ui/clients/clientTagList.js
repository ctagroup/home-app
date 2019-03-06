import './clientTagList.html';
import ClientTagList from '/imports/ui/components/tags/ClientTagList.js';

Template.clientTagListView.helpers({
  component() {
    return ClientTagList;
  },
});
