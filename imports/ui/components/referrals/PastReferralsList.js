import React from 'react';
import DataTable from '/imports/ui/components/dataTable/DataTable';
import { removeReferralButton } from '/imports/ui/components/dataTable/helpers';

function PastReferralsList() {
  const options = {
    columns: [
      {
        title: 'Project Name',
        data: 'projectName',
        // render(value, op, doc) {
        //   Projects.find(doc.projectId).name
        // },

      },
      {
        title: 'Outcome',
        data: 'outcome',
      },
      {
        title: 'Date Created',
        data: 'created',
      },
      {
        title: 'Last Update',
        data: 'modified',
      },
      {
        title: 'Edit',
        data: 'id',
      },
      removeReferralButton((referral) => {
        console.log('removed', referral);
        return null;
        // Referrals._collection.remove(project._id); // eslint-disable-line
      }),
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
          id: 'modified',
          desc: true,
        },
      ]}
    />
  );
}

export default PastReferralsList;

