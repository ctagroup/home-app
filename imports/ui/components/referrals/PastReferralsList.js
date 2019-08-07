import React from 'react';
import DataTable from '/imports/ui/components/dataTable/DataTable';

function PastReferralsList() {
  const options = {
    columns: [
      {
        title: 'Project Name',
        data: 'projectName',
      },
      {
        title: 'Outcome',
        data: 'outcome',
      },
      {
        title: 'Date Created',
        data: 'createdAt',
      },
      {
        title: 'Last Update',
        data: 'updatedAt',
      },
      {
        title: 'Actions',
        data: 'projectId',
      },
    ],
  };
  const data = [];

  return (
    <DataTable
      disableSearch
      options={options}
      data={data}
      defaultSorted={[
        {
          id: 'updatedAt',
          desc: true,
        },
      ]}
    />
  );
}

export default PastReferralsList;

