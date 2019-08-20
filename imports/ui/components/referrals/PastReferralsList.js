import React from 'react';
import DataTable from '/imports/ui/components/dataTable/DataTable';
import { formatDateTime } from '/imports/both/helpers';
import Projects from '/imports/api/projects/projects';
// import { removeReferralButton } from '/imports/ui/components/dataTable/helpers';

function PastReferralsList({ referrals }) {
  const options = {
    columns: [
      {
        title: 'Project Name',
        data: 'projectId',
        render(value) {
          const project = Projects.findOne(value);
          return project ? project.projectName : value;
        },
      },
      {
        title: 'Date Created',
        data: 'created',
        render(value, op, doc) {
          const { history } = doc;
          if (history.length) {
            return formatDateTime(history[0].created);
          }
          return '';
        },
      },
      {
        title: 'Last Update',
        data: 'modified',
        render(value, op, doc) {
          const { history } = doc;
          if (history.length) {
            return formatDateTime(history[history.length - 1].modified);
          }
          return '';
        },
      },
      {
        title: 'Outcome',
        data: 'outcome',
      },
      /*
      {
        title: 'Edit',
        data: 'id',
      },
      removeReferralButton((referral) => {
        console.log('removed', referral);
        return null;
        // Referrals._collection.remove(project._id); // eslint-disable-line
      }),
      */
    ],
  };
  return (
    <DataTable
      disableSearch
      options={options}
      data={referrals}
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

