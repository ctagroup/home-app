import '/imports/ui/dataTable/dataTableEditButton';
import '/imports/ui/dataTable/dataTableDeleteButton';
import { fullName } from '/imports/api/utils';


export const TableDom = '<"box"<"box-header"<"box-toolbar"<"clearfix"ri><"pull-left"<lf>><"pull-right"p>>><"box-body table-responsive"t>>'; // eslint-disable-line max-len

export function editButton(path, options) {
  return Object.assign({
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
  }, options);
}

export function deleteHouseholdButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id) {
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
    createdCell(node, _id, rowData) {
      const name = rowData.aliasName || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete housing unit ${name} (${_id})?`,
        method: 'housingUnits.delete',
        args: [_id],
        onSuccess() {
          // Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteSurveyButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const title = rowData.title || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete Survey ${title} (${_id})?`,
        method: 'surveys.delete',
        args: [_id],
        onSuccess() {
          // Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteQuestionButton(onSuccessCallback) {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const title = rowData.displayText || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete Question ${title} (${_id})?`,
        method: 'questions.delete',
        args: [rowData.questionGroupId, _id],
        onSuccess() {
          if (onSuccessCallback) {
            onSuccessCallback(rowData);
          }
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteUserButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id) {
      const name = '';
      const templateData = {
        _id,
        message: `Are you sure you want to delete user ${name} (${_id})?`,
        method: 'users.delete',
        args: [_id],
        onSuccess() {
          // Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteFileButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id) {
      const templateData = {
        _id,
        message: 'Are you sure you want to delete this file?',
        method: 'files.delete',
        args: [_id],
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteResponseButton(onSuccessCallback) {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const name = fullName(rowData.clientDetails) || rowData.clientId;
      const templateData = {
        _id,
        message: `Are you sure you want to delete the response of ${name}?`,
        method: 'responses.delete',
        args: [_id],
        onSuccess() {
          if (onSuccessCallback) {
            onSuccessCallback(rowData);
          }
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteAgencyButton() {
  return {
    data: '_id',
    title: 'Delete',
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const templateData = {
        _id,
        message: `Are you sure you want to delete agency ${rowData.agencyName}?`,
        method: 'globalProjects.delete',
        args: [_id],
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    width: '45px',
    orderable: false,
  };
}
