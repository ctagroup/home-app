import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import Alert from '/imports/ui/alert';
import { ClientCell } from '/imports/ui/components/Cells';
import { formatDateTime } from '/imports/both/helpers';


const SurveyedClientsList = () => {
  const columns = [{
    Header: 'Client',
    accessor: 'client',
    Cell: props => {
      const { client } = props.original;
      const { clientId, schema } = client;
      const href = Router.path('viewClient',
        { _id: clientId },
        { query: { schema },
      });
      return <ClientCell client={client} href={href} />;
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
