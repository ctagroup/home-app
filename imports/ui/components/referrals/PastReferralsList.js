import React from 'react';
import moment from 'moment';
import DataTable from '/imports/ui/components/dataTable/DataTable';
import { formatDateTime } from '/imports/both/helpers';
import Projects from '/imports/api/projects/projects';
import config from './config';
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
      SubComponent={(row) => {
        const historyData = row.original.history;
        const referralNotes = row.original.notes;
        const stepNotes = referralNotes.reduce((acc, note) => {
          const currentStepNotes = acc[note.step] || [];
          currentStepNotes.push(note);
          return { ...acc, [note.step]: currentStepNotes };
        }, {});
        const getStepTitle = (stepId) =>
          config.steps && config.steps[stepId - 1] && config.steps[stepId - 1].title;
        return (
          <div>
            <h4>&nbsp;History:</h4>
            <ul>
              {historyData.map(({ id, step, outcome, created }) =>
                (<li key={`${row.original.id}-${id}`}>
                  <strong>Step {getStepTitle(step)} {moment(created).format('MM/DD/YYYY')}:</strong>
                  &nbsp;{outcome} &nbsp;
                  <strong>Notes: {stepNotes[step] && stepNotes[step].length || 0}</strong>
                  {stepNotes[step] && <ul>
                    {stepNotes[step].map((note) =>
                      (<li>
                        <strong>{moment(note.created).format('MM/DD/YYYY')}</strong>: {note.note}
                      </li>))}
                  </ul>}
                </li>))}
            </ul>
          </div>
        );
      }}
    />
  );
}

export default PastReferralsList;

