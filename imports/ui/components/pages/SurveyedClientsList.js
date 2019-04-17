import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import Alert from '/imports/ui/alert';
import { Link, ClientName, ErrorLabel } from '/imports/ui/components/generic';
import { formatDateTime } from '/imports/both/helpers';


const SurveyedClientsList = () => {
  const columns = [{
    Header: 'Client',
    accessor: 'client',
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
    Header: 'Survey',
    accessor: 'survey',
    Cell: props => {
      const { survey } = props.original;
      const { surveyTitle, surveyId, error } = survey;
      const errorLabel = error ?
        <ErrorLabel hint={error.message} text={error.statusCode} />
        : null;
      return <span>{errorLabel} {surveyTitle || surveyId}</span>;
    },
  }, {
    Header: 'Response Date',
    accessor: 'responseDate',
    Cell: props => formatDateTime(props.original.responseDate),
  }];

  const [data, setData] = useState([]);

  useEffect(() => {
    Meteor.call('responses.recentlySurveyedClients', (err, res) => {
      if (err) {
        Alert.error(err);
      } else {
        setData(res);
      }
    });
  }, []);


  return (
    <ReactTable
      columns={columns}
      data={data}
      defaultSorted={[{ id: 'responseDate', desc: true }]}
    />
  );
};

export default SurveyedClientsList;
