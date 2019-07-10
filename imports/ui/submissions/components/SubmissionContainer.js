import React, { useState, useEffect } from 'react';
import Survey from '/imports/ui/components/surveyForm/Survey';


const SubmissionContainer = ({ clientId, surveyId, submissionId }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Meteor.call('submissions.view', clientId, surveyId, submissionId, (err, res) => {
      if (err) {
        setError(err);
      } else {
        setData(res);
      }
    });
  }, [clientId, surveyId, submissionId]);

  if (error) return `An error has ocurred: ${error}`;

  if (!data) return 'Loading...';

  const { response, invalidResponses, survey, client } = data;
  const isAdmin = true;

  console.log(response, invalidResponses);

  function renderInvalidResponses() {
    return (
      <div className="alert alert-warning">
        <p>This survey has following errors:</p>
        <ul>
          {invalidResponses.map(r => (
            <li key={r.response.responseId}>
              <strong>Response: </strong>{r.value}
              <br />
              <strong>Error: </strong>{r.error}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {renderInvalidResponses()}
      <Survey
        definition={survey.definition}
        client={client}
        initialValues={response.values}
        surveyId={surveyId}
        debugMode={isAdmin}
      />
    </div>
  );
};

export default SubmissionContainer;
