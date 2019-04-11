import { setAppContext } from '/imports/ui/app/appContext';
import './dataTableTextButton.html';


Template.DataTableTextButton.events({
  'click .remove-link'(e) {
    e.preventDefault();
    setAppContext('appDeleteModal', this);
  },
});
