import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import Alert from '/imports/ui/alert';
import { Link, ClientName } from '/imports/ui/components/generic';


const columns = [{
  Header: 'Survey',
  accessor: 'surveyTitle',
  Cell: props => {
    const { clientId, survey, surveyId, submissionId } = props.original;

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
}, {
  Header: 'Actions',
  accessor: 'actions',
  Cell: () => (
    <p></p>
  ),
}];


const SubmissionsTable = ({ dedupClientId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(-1);
  const [tableState, setTableState] = useState({ page: 0, pageSize: 20, sorted: [] });

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
