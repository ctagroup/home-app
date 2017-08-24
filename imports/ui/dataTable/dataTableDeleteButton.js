import { setAppContext } from '/imports/ui/app/appContext';
import './dataTableDeleteButton.html';


Template.DataTableDeleteButton.events({
  'click .btn-delete'(e) {
    e.preventDefault();
    setAppContext('appDeleteModal', this);
  },
});
