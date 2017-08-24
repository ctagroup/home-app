import '/imports/ui/dataTable/dataTableEditButton';
import '/imports/ui/dataTable/dataTableDeleteButton';


export const TableDom = '<"box"<"box-header"<"box-toolbar"<"clearfix"ri><"pull-left"<lf>><"pull-right"p>>><"box-body table-responsive"t>>'; // eslint-disable-line max-len

export function editButton(path) {
  return {
    data: '_id',
    title: 'Edit',
    render() {
      return '';
    },
    createdCell(node, cellData) {
      const data = {
        path,
        _id: cellData,
      };
      Blaze.renderWithData(Template.DataTableEditButton, data, node);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteHouseholdButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id) {
      window.xxx = node;
      const templateData = {
        _id,
        message: `Are you sure you want to delete household ${_id}?`,
        method: 'deleteHousehold',
        args: [_id],
        onSuccess() {
          Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteHousingUnitButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id) {
      const templateData = {
        _id,
        message: `Are you sure you want to delete housing unit ${_id}?`,
        method: 'deleteHousing',
        args: [_id],
        onSuccess() {
          location.reload();
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}
