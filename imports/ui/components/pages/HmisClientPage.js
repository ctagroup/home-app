import JSONTree from 'react-json-tree';
import React, { useState } from 'react';

const clientEndpoints = [
  '/clients',
  '/clients/{clientId}/enrollments',
  '/clients/{clientId}/veteraninfos',
  '/projects',
  '/organizations',
  '/search?q=',
  '/questions',
  '/v2/questions',
];

const apis = {
  '': [],
  'https://api.hslynk.com/hmis-clientapi/rest/v2017': clientEndpoints,
  'https://api.hslynk.com/hmis-clientapi/rest/v2016': clientEndpoints,
  'https://api.hslynk.com/hmis-clientapi/rest/v2015': clientEndpoints,
  'https://api.hslynk.com/hmis-clientapi/rest/v2014': clientEndpoints,
  'https://api.hslynk.com/hmis-developer-service/rest': [
    '/developercompanies',
    '/developercompanies/{serviceid}',
    '/services/{trustedappid}',
  ],
  'https://api.hslynk.com/inventory-api/rest': [
    '/housing-units',
    '/housing-units/{housing_unit_uuid}',
    '/projects/{projectid}/eligibilityrequirements',
  ],
  'https://api.hslynk.com/house-matching-api/rest': [
    '/v3/matches',
    '/v3/matches/client/{dedupClientId}',
    '/eligibleclients/{clientId}',
    '/matches/client/{dedupClientId}/status',
  ],
  'https://api.hslynk.com/survey-api/rest': [
    '/questiongroups',
    '/v2/questiongroups/{questiongroupid}/questions',
    '/v2/surveys',
    '/v2/surveys/{surveyid}',
    '/surveys/{surveyid}/surveysections',
    '/surveys/{surveyid}/surveysections/{sectionid}',
    '/surveys/{surveyid}/surveysections/{sectionid}/questions',
    '/v3/clients/{dedupclientid}/surveys/{surveyid}/responses',
    '/v3/clients/{dedupclientid}/surveys/{surveyid}/sections/{sectionid}/scores',
    '/v3/clients/{dedupclientid}/surveys/{surveyid}/scores',
    '/v3/clients/{dedupclientid}/surveys/{surveyid}/submissions/{submissionid}',
    '/clientsurveysubmissions/{clientId}',
    '/clientsurveysubmissions?q=',
    '/questions',
  ],
  'https://api.hslynk.com/hmis-globalapi/rest': [
    '/search/{searchentity}',
    '/global-projects',
    '/global-projects/${globalProjectId}/users',
    '/clients/{clientDedupId}/global-enrollments/{global-enrollmentId}',
    '/clients/{dedupClientId}',
    '/notifications',
    '/generic-enrollments',
    '/global-Households',
  ],
  'https://api.hslynk.com/global-household-api/rest': [
    '/generic-households',
    '/members',
  ],
  'https://api.hslynk.com/hmis-user-service/rest': [
    '/accounts',
    '/accounts/{uuid}',
    '/profiles',
    '/roles',
    '/projectgroups',
  ],
};

export const HmisClientPage = () => {
  const [currentApi, setCurrentApi] = useState(Object.keys(apis)[0]);
  const [currentEndpoint, setCurrentEndpoint] = useState('');

  const [calls, setCalls] = useState([]);

  function handleSendRequest() {
    const currentUrl = `${currentApi}${currentEndpoint}`;
    const id = new Date().getTime();
    const newCall = {
      id,
      request: currentUrl,
      response: null,
    };
    setCalls([...calls, newCall]);

    Meteor.call('hmisApi.get', currentUrl, (err, res) => {
      if (err) {
        newCall.response = {
          statusCode: err.details && err.details.code,
          body: `${err}`,
        };
      } else {
        newCall.response = {
          statusCode: 'ok',
          body: res,
        };
      }
      setCalls([...calls, newCall]);
    });
  }

  function renderApiSelect() {
    return (
      <div>
        <select
          className="form-control"
          onChange={(evt) => setCurrentApi(evt.target.value)}
        >
          {Object.keys(apis).map((api) => (
            <option key={api}>{api}</option>
          ))}
        </select>
        <div>
          {apis[currentApi].map((endpoint) => (
            <button
              key={endpoint}
              className="btn btn-default"
              onClick={() => setCurrentEndpoint(endpoint)}
            >
              {endpoint}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function renderCalls() {
    const theme = {
      scheme: 'ocean',
      author: 'chris kempson (http://chriskempson.com)',
      base00: '#2b303b',
      base01: '#343d46',
      base02: '#4f5b66',
      base03: '#65737e',
      base04: '#a7adba',
      base05: '#c0c5ce',
      base06: '#dfe1e8',
      base07: '#eff1f5',
      base08: '#bf616a',
      base09: '#d08770',
      base0A: '#ebcb8b',
      base0B: '#a3be8c',
      base0C: '#96b5b4',
      base0D: '#8fa1b3',
      base0E: '#b48ead',
      base0F: '#ab7967',
    };
    return calls.map((c, i) => {
      const request = (
        <div>
          #{i + 1}) {c.request}
        </div>
      );

      const response = c.response ? (
        <div>
          <div>{c.response.statusCode}</div>
          <JSONTree data={c.response.body} theme={theme} hideRoot />
        </div>
      ) : (
        '...'
      );

      return (
        <div key={c.id}>
          {request}
          {response}
        </div>
      );
    });
  }

  return (
    <div>
      {renderCalls()}
      <hr />
      <div className="form-group">
        {renderApiSelect()}
        <input
          type="text"
          className="form-control"
          value={currentEndpoint}
          onChange={(evt) => setCurrentEndpoint(evt.target.value)}
        />
      </div>
      <button onClick={handleSendRequest} className="btn btn-default">
        Send
      </button>
    </div>
  );
};
