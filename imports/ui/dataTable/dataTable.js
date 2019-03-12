import DataTable from '/imports/ui/components/dataTable/DataTable.js';
import './dataTable.html';

Template.dataTable.helpers({
  component() {
    return DataTable;
  },
});
