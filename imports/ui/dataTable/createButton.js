import { setAppContext } from '/imports/ui/app/appContext';
import './createButton.html';


Template.CreateButton.events({
  'click .remove-link'(e) {
    e.preventDefault();
    setAppContext('appDeleteModal', this);
  },
});
