import { deleteHousingUnitButton, editButton, TableDom } from '/imports/ui/dataTable/helpers';
import HousingUnits from '/imports/api/housingUnits/housingUnits';
import './housingUnitsListView.html';

const tableOptions = {
  columns: [
    {
      title: 'Name',
      data: 'aliasName',
      render(value, _, rowData) {
        console.log(value);
        return value || rowData._id;
      },
    },
    {
      title: 'Project',
      data: 'project',
      render(value) {
        if (value.loading) {
          return 'Loading...';
        }
        if (value.error) {
          return value.error;
        }
        return value.projectName;
      },
    },
    {
      title: 'Vacant?',
      data: 'vacant',
      render(value) {
        return value ? '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>' : ''; // eslint-disable-line max-len
      },
    },
    editButton('adminDashboardhousingUnitsEdit'),
    deleteHousingUnitButton(),
  ],
  dom: TableDom,
  stateSave: true,
  processing: true,
};

Template.housingUnitsListView.helpers(
  {
    hasData() {
      return HousingUnits.find().count() > 0;
    },
    tableOptions() {
      return tableOptions;
    },
    tableData() {
      return () => HousingUnits.find().fetch();
    },
  }
);
