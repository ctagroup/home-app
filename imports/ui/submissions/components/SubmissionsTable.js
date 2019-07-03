import React, { useState, useEffect, useMemo } from 'react';
import ReactTable from 'react-table';
import Alert from '/imports/ui/alert';
import { Link, ClientName } from '/imports/ui/components/generic';
import { formatDateTime } from '/imports/both/helpers';


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


const SubmissionsTable = ({ }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(-1);
  const [filter, setFilter] = useState('');

  function loadData(state, component) {
    const pageNumber = state.page;
    const pageSize = state.pageSize;

    console.log('ld', state, state.sorted);
    setLoading(true);
    Meteor.call('submissions.getPage', pageNumber, pageSize, (err, res) => {
      console.log(res);
      setLoading(false);
      if (err) {
        Alert.error(err);
      } else {
        setData(res.content);
        setTotalPages(res.page.totalPages);
      }
    });
  }

  const debouncedFetch = useMemo(() => _.debounce((state, component) => {
    loadData(state, component);
  }, 1000), []);

  // const debouncedFetch = useCallback(() => {
  //   console.log('aaa', debounceFn);
  //   // const fn = _.debounce(() => {
  //   //   console.log('debounced');
  //   // }, 1000);
  //   // return fn;
  // }, []);

  function onFetchData(...args) {
    debouncedFetch(...args);
  }

  function onFilteredChange(filters) {
    console.log(filters);
  }




  // const loadDataDebounced = useCallback(_.debounce(loadData, 1000), []);

  // useEffect(() => {
  //   loadDataDebounced({});
  // }, []);

  return (
    <div>
      {/* enableSearch &&
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
      */}
      <ReactTable
        columns={columns}
        data={data}
        manual
        filterable
        loading={loading}
        resizable
        pages={totalPages}
        onFetchData={loadData}
        onFilteredChange={onFilteredChange}
      />
    </div>
  );
};


export default SubmissionsTable;
