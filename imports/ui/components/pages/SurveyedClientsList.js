import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import { fullName } from '/imports/api/utils';


const SurveyedClientsList = () => {
  const columns = [{
    Header: 'Client',
    Cell: props => fullName(props.original.client) || props.original.clientId,
  }, {
    Header: 'Survey',
    Cell: props => props.original.survey.surveyTitle,
  }, {
    Header: 'Survey Date',
    acessor: 'xyz',
  }];

  const [data, setData] = useState([]);

  useEffect(() => {
    Meteor.call('responses.recentlySurveyedClients', (err, res) => {
      console.log(err, res);
      setData(res);
    });
  }, []);


  return (

    <ReactTable columns={columns} data={data} xx={console.log(data)} />
  );
};

export default SurveyedClientsList;
