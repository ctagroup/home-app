import '/imports/ui/dataTable/dataTableEditButton';
import '/imports/ui/dataTable/dataTableDeleteButton';
import '/imports/ui/dataTable/dataTableTextButton';
import '/imports/ui/dataTable/createButton';
import { fullName } from '/imports/api/utils';
import BlazeTemplate from '/imports/ui/components/BlazeComponent';
import React from 'react';
import Users from '/imports/api/users/users';


export const TableDom = '<"box"<"box-header"<"box-toolbar"<"clearfix"ri><"pull-left"<lf>><"pull-right"p>>><"box-body table-responsive"t>>'; // eslint-disable-line max-len

// eslint-disable-next-line react/react-in-jsx-scope
export const blazeData = (name, data, classes) =>
  (<BlazeTemplate name={name} data={data} classes={classes} />);

export function editButton(path, options) {
  return Object.assign({
    data: '_id',
    title: 'Edit',
    filterable: false,
    render() {
      return '';
    },
    createdCell(node, _id) {
      const data = {
        path,
        _id,
      };
      Blaze.renderWithData(Template.DataTableEditButton, data, node);
    },
    reactCreatedCell(node, _id, row) {
      const data = {
        path,
        _id,
        row,
      };
      return blazeData('DataTableEditButton', data);
    },
    width: '45px',
    orderable: false,
  }, options);
}

export function deleteHouseholdButton() {
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
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
    reactCreatedCell(node, _id) {
      const templateData = {
        _id,
        message: `Are you sure you want to delete household ${_id}?`,
        method: 'deleteHousehold',
        args: [_id],
        onSuccess() {
          Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteHousingUnitButton() {
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
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
    reactCreatedCell(node, _id, rowData) {
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
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteSurveyButton(onSuccessCallback) {
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const title = rowData.title || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete Survey ${title} (${_id})?`,
        method: 'surveys.delete',
        args: [_id],
        onSuccess() {
          if (onSuccessCallback) {
            onSuccessCallback(rowData);
          }
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    reactCreatedCell(node, _id, rowData) {
      const title = rowData.title || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete Survey ${title} (${_id})?`,
        method: 'surveys.delete',
        args: [_id],
        onSuccess() {
          if (onSuccessCallback) {
            onSuccessCallback(rowData);
          }
        },
      };
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}


export function deleteQuestionButton(onSuccessCallback) {
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
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
    reactCreatedCell(node, _id, rowData) {
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
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteUserButton() {
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
    render() { return ''; },
    createdCell(node, _id) {
      const user = Users.findOne(_id);
      const name = fullName(user.services.HMIS || {}) || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete user ${name}?`,
        method: 'users.delete',
        args: [_id],
        onSuccess() {
          // Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    reactCreatedCell(node, _id) {
      const user = Users.findOne(_id);
      const name = fullName(user.services.HMIS || {}) || _id;
      const templateData = {
        _id,
        message: `Are you sure you want to delete user ${name}?`,
        method: 'users.delete',
        args: [_id],
        onSuccess() {
          // Meteor.setTimeout(() => location.reload(), 1500);
        },
      };
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteFileButton() {
  const composeData = (_id) => ({
    _id,
    message: 'Are you sure you want to delete this file?',
    method: 'files.delete',
    args: [_id],
  });
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
    render() { return ''; },
    createdCell(node, _id) {
      const templateData = composeData(_id);
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    reactCreatedCell(node, _id) {
      const templateData = composeData(_id);
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteResponseButton(onSuccessCallback) {
  const composeData = (_id, rowData) => {
    const name = fullName(rowData.clientDetails) || rowData.clientId;
    return {
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
  };

  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const templateData = composeData(_id, rowData);
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    reactCreatedCell(node, _id, rowData) {
      const templateData = composeData(_id, rowData);
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}

export function deleteProjectButton(onSuccessCallback) {
  const composeData = (_id, rowData) => (
    {
      _id,
      message: `Are you sure you want to delete the project ${rowData.projectName}?`,
      method: 'projects.delete',
      args: [_id, rowData.schema],
      onSuccess() {
        if (onSuccessCallback) {
          onSuccessCallback(rowData);
        }
      },
    }
  );
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
    render() { return ''; },
    createdCell(node, _id, rowData) {
      const templateData = composeData(_id, rowData);
      Blaze.renderWithData(Template.DataTableDeleteButton, templateData, node);
    },
    reactCreatedCell(node, _id, rowData) {
      const templateData = composeData(_id, rowData);
      return blazeData('DataTableDeleteButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}

export function removeClientTagButton(onSuccessCallback) {
  const composeData = (_id, rowData) => {
    const removed = rowData.operation;
    const inverseOperation = rowData.operation ? 0 : 1;
    return {
      _id,
      operation: rowData.operation,
      operationText: removed ? 'Remove' : 'Add',
      title: `Confirm ${removed ? 'removal' : 'adding'}`,
      message: `Are you sure you want to ${removed ? 'remove' : 'add'
        } client tag #${rowData.id} (${rowData.tag.name})?`,
      method: 'tagApi',
      args: ['createClientTag', { ...rowData, operation: inverseOperation }],
      onSuccess(result) {
        if (onSuccessCallback) onSuccessCallback(result);
      },
    };
  };
  return {
    data: '_id',
    title: 'Delete',
    filterable: false,
    render() { return ''; },
    reactCreatedCell(node, _id, rowData) {
      const templateData = composeData(_id, rowData);
      return blazeData('DataTableTextButton', templateData);
    },
    width: '45px',
    orderable: false,
  };
}
