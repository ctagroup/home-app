import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import ConfirmButton from '/imports/ui/components/generic/ConfirmButton';
import Alert from '/imports/ui/alert';
import { Link, ClientName } from '/imports/ui/components/generic';
import { formatDateTime } from '/imports/both/helpers';


const SubmissionsTable = ({ dedupClientId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(-1);
  const [tableState, setTableState] = useState({ page: 0, pageSize: 20, sorted: [] });

  function handleDeleteSubmission({ clientId, surveyId, submissionId }, done) {
    Meteor.call('submissions.delete', clientId, surveyId, submissionId, (err) => {
      if (err) {
        Alert.error(err);
      } else {
        Alert.success('Response deleted');
        setData(data.filter(row => row.submissionId !== submissionId));
      }
      done();
    });
  }

  const columns = [{
    Header: 'Survey',
    accessor: 'surveyTitle',
    Cell: props => {
      const { clientId, survey, surveyId, submissionId, type, mongoId } = props.original;

      if (type.startsWith('local')) {
        return (
          <Link route="adminDashboardresponsesEdit" params={{ _id: mongoId }}>
            {survey.surveyTitle || surveyId}
          </Link>
        );
      }

      const routeParams = {
        clientId,
        surveyId,
        submissionId,
      };

      return (
        <Link route="editSubmission" params={routeParams}>
          {survey.surveyTitle || surveyId}
        </Link>
      );
    },
  }, {
    Header: 'Client',
    accessor: 'clientName',
    Cell: props => {
      const { client } = props.original;
      const { clientId, schema } = client;

      return (
        <Link route="viewClient" params={{ _id: clientId }} query={{ schema }}>
          <ClientName client={client} />
        </Link>
      );
    },
  }, {
    Header: 'Submission Date',
    accessor: 'submissionDate',
    Cell: props => (props.original.submissionDate ?
      formatDateTime(props.original.submissionDate) : ''),
  }, {
    Header: 'Type',
    accessor: 'type',
  }, {
    Header: 'Actions',
    accessor: 'actions',
    Cell: props => (
      <ConfirmButton
        label="Delete"
        confirmMessage="Are you sure you want to delete this submission?"
        clientId={props.original.clientId}
        surveyId={props.original.surveyId}
        submissionId={props.original.submissionId}
        onConfirm={handleDeleteSubmission}
      />
    ),
  }];


  function loadData(state) {
    setTableState(state);

    const pageNumber = state.page;
    const pageSize = state.pageSize;

    const sorted = state.sorted[0] || {};

    const sort = {
      by: sorted.id,
      order: sorted.desc ? 'desc' : 'asc',
    };

    setLoading(true);
    Meteor.call('submissions.getPage', dedupClientId, pageNumber, pageSize, sort, (err, res) => {
      setLoading(false);
      if (err) {
        Alert.error(err);
      } else {
        setData(res.content);
        setTotalPages(res.page.totalPages);
      }
    });
  }

  useEffect(() => {
    loadData(tableState);
  }, [dedupClientId]);

  return (
    <ReactTable
      columns={columns}
      data={data}
      manual
      loading={loading}
      resizable
      pages={totalPages}
      onFetchData={loadData}
    />
  );
};


export default SubmissionsTable;
