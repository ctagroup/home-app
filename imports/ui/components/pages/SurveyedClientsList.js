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
      const { clientId, schema } = client;
      const errorLabel = client.error ?
        <ErrorLabel hint={client.error.message} text={client.error.statusCode} />
        : null;

      if (errorLabel) {
        return (
          <span><ClientName client={client} /> {errorLabel}</span>
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
    accessor: 'surveyTitle',
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
