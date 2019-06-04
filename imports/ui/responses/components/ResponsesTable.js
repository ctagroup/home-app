import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import Alert from '/imports/ui/alert';
import { Link, ClientName, ErrorLabel } from '/imports/ui/components/generic';
import { fullName } from '/imports/api/utils';
import { formatDateTime } from '/imports/both/helpers';
import { ResponseStatusCell } from './ResponseStatus';
import { ResponseActionsCell } from './ResponseActionsCell';


const columns = [{
  Header: 'Survey',
  accessor: 'surveyId',
  Cell: props => {
    const { survey } = props.original;
    const { surveyTitle, surveyId, error } = survey;
    const errorLabel = error ?
      <ErrorLabel hint={error.message} text={error.statusCode} />
      : null;

    if (errorLabel) {
      return (<span>{errorLabel} {surveyId}</span>);
    }

    return (
      <Link route="adminDashboardresponsesEdit" params={{ _id: props.original._id }}>
        {surveyTitle || surveyId}
      </Link>
    );
  },
}, {
  Header: 'Client',
  accessor: 'clientId',
  Cell: props => {
    const { client } = props.original;
    const { clientId, schema, error } = client;
    const errorLabel = error ?
      <ErrorLabel hint={error.message} text={error.statusCode} />
      : null;

    if (errorLabel) {
      return (
        <span>{errorLabel} <ClientName client={client} /></span>
      );
    }

    return (
      <Link route="viewClient" params={{ _id: clientId }} query={{ schema }}>
        <ClientName client={client} />
      </Link>
    );
  },
}, {
  Header: 'Date Created',
  accessor: 'createdAt',
  Cell: props => formatDateTime(props.original.createdAt),
}, {
  Header: 'Date Updated',
  accessor: 'updatedAt',
  Cell: props => formatDateTime(props.original.updatedAt),
}, {
  Header: 'Status',
  accessor: 'submittedAt',
  Cell: props => (
    <ResponseStatusCell response={props.original} />
  ),
}, {
  Header: 'Version',
  accessor: 'version',
}, {
  Header: 'Actions',
  accessor: 'actions',
  Cell: props => (
    <ResponseActionsCell response={props.original} />
  ),
}];


const ResponsesTable = ({ enableSearch }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(-1);
  const [filter, setFilter] = useState('');

  function loadData(state = {}) {
    const query = Router.current().params.query || {};
    const methodOptions = {
      clientId: query.clientId,
      clientSchema: query.schema,
      pageNumber: state.page,
      pageSize: state.pageSize,
      sortBy: state.sorted,
    };

    setLoading(true);
    Meteor.call('responses.getPage', methodOptions, (err, res) => {
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
    loadData();
  }, []);

  const filteredData = data.filter(row => {
    const clientFullName = fullName(row.client);
    return clientFullName.toLowerCase().includes(filter);
  });

  return (
    <div>
      {enableSearch &&
        <div className="form-inline" style={{ paddingBottom: 10 }}>
          <div className="form-group">
            <label>Search: </label>
            <input
              type="text"
              className="form-control"
              placeholder="client name"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      }
      <ReactTable
        columns={columns}
        data={filteredData}
        defaultSorted={[{ id: 'dateCreated', desc: true }]}
        manual
        loading={loading}
        resizable
        pages={totalPages}
        onFetchData={loadData}
      />
    </div>
  );
};


export default ResponsesTable;
