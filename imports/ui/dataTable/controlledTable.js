import ControlledTable from '/imports/ui/components/dataTable/ControlledTable.js';
import './controlledTable.html';

Template.controlledTable.helpers({
  component() {
    return ControlledTable;
  },
});
