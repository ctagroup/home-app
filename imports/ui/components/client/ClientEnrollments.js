import React, { useState } from 'react';
import { Link, ErrorLabel, Warning } from '/imports/ui/components/generic';
import Survey from '/imports/ui/components/surveyForm/Survey';
import { getEnrollmentSurveyIdForProject } from '/imports/ui/clients/helpers';
import {
  // formatDateTimeFunction as formatDateTime,
  formatDate99Function as formatDate99,
  formatDateFunction as formatDate,
} from '/imports/ui/templateHelpers';
import { SurveyLoader } from '../surveyForm/SurveyLoader';


const EditMode = Object.freeze({
  NONE: null,
  CREATE_ENROLLMENT: 'CREATE_ENROLLMENT',
  UPDATE_ENROLLMENT: 'UPDATE_ENROLLMENT',
  EXIT_ENROLLMENT: 'EXIT_ENROLLMENT',
  ANNUAL_ENROLLMENT: 'ANNUAL_ENROLLMENT',
});

const ProjectNameCell = ({ project }) => {
  const { projectId, projectName, error } = project;
  const errorLabel = error ?
    <ErrorLabel hint={error.message} text={error.statusCode} />
    : null;

  return (
    <span>
      {errorLabel} <span title={projectId}>
        {projectName || projectId}
      </span>
    </span>
  );
};


const ProjectEnrollmentCell = ({ client, enrollmentId, surveyId, dataCollectionStage,
  children }) => {
  const { clientId, schema } = client;
  return (
    <div>
      <Link
        className="btn btn-primary"
        route="viewEnrollmentAsResponse"
        params={{ _id: clientId, enrollmentId }}
        query={{ schema, surveyId, dataCollectionStage }}
      >
        <i className="fa fa-eye"></i> View
      </Link>
      {children}
    </div>
  );
};


const EnrollmentRow = ({ enrollment, client }) => {
  const { projectId, enrollmentId } = enrollment;
  const entrySurveyId = getEnrollmentSurveyIdForProject(projectId, 'entry');
  const updateSurveyId = !!getEnrollmentSurveyIdForProject(projectId, 'update');
  const exitSurveyId = !!getEnrollmentSurveyIdForProject(projectId, 'exit');

  const entryCell = entrySurveyId ?
    <ProjectEnrollmentCell
      client={client}
      enrollmentId={enrollmentId}
      surveyId={entrySurveyId}
      dataCollectionStage={1}
    />
    : <Warning>Entry survey not set</Warning>;

  const updateCell = updateSurveyId ?
    <ProjectEnrollmentCell
      client={client}
      enrollmentId={enrollmentId}
      surveyId={entrySurveyId}
      dataCollectionStage={2}
    >
      <a className="updateLink update btn btn-default">
        <i className="fa fa-plus" /> Update Enrollment
      </a>
      <a className="updateLink update btn btn-default">
        <i className="fa fa-plus" /> Annual Assessment
      </a>
    </ProjectEnrollmentCell>
  : <Warning>Update survey not set</Warning>;

  const exitCell = exitSurveyId ?
    <ProjectEnrollmentCell
      client={client}
      enrollmentId={enrollmentId}
      surveyId={entrySurveyId}
      dataCollectionStage={3}
    >
      <a className="updateLink update btn btn-default">
        <i className="fa fa-plus" /> Exit Enrollment
      </a>
    </ProjectEnrollmentCell>
  : <Warning>Exit survey not set</Warning>;

  return (
    <tr key={enrollment.enrollmentId}>
      <td>{formatDate99(enrollment.entryDate)}</td>
      <td><ProjectNameCell project={enrollment.project} /></td>
      <td>{entryCell}</td>
      <td>{updateCell}</td>
      <td>{exitCell}</td>
      <td>{formatDate(enrollment.dateUpdated)}</td>
    </tr>
  );
};


function ClientEnrollments(props) {
  const { activeProjectId, client, enrollments } = props;
  const [editMode, setEditMode] = useState({ mode: EditMode.NONE });
  if (enrollments.length === 0) return (<p>Loading enrollments...</p>);

  function handleSurveySubmit() {
    setEditMode({ mode: EditMode.NONE });
    // TODO: refresh enrollments view
  }

  function handleSurveyCancel() {
    setEditMode({ mode: EditMode.NONE });
  }

  const columnNames = [
    'Entry Date',
    'Project Name',
    'Entry Response',
    'Update Response',
    'Exit Response',
    'Date updated',
  ];

  /*
                      {{> enrollmentsUpdate
                        client=currentClient
                        projectId=updateEnrollmentProjectId
                        project=updateEnrollmentProject
                        surveyId=projectUpdateSurveyId
                        enrollmentInfo=updateEnrollmentInfo
                      }}
  */

  let editComponent = null;
  let surveyId;
  const debugMode = true;
  const definition = {};




  switch (editMode.mode) {
    case EditMode.CREATE_ENROLLMENT:
      surveyId = getEnrollmentSurveyIdForProject(activeProjectId, 'entry');
      console.log(editMode.mode, props, surveyId);
      editComponent = (
        <div style={{ border: 1 }}>
          <SurveyLoader
            client={client}
            surveyId={surveyId}
            projectId={activeProjectId}
            onSubmit={handleSurveySubmit}
          />
          <button
            className="btn btn-default"
            onClick={handleSurveyCancel}
          >
            Cancel
          </button>
        </div>
      );
      // for edit, see: /imports/ui/enrollments/viewEnrollmentAsResponse.js
      break;
    default:
      surveyId = getEnrollmentSurveyIdForProject(activeProjectId, 'entry');
      editComponent = (
        <div>
          <button
            disabled={!surveyId}
            className="btn btn-primary"
            onClick={() => setEditMode({
              mode: EditMode.CREATE_ENROLLMENT,
              projectId: null,
            })}
          >
            <i className="fa fa-plus" /> Create Enrollment
          </button>
          {surveyId ? null : <p>Entry enrollment survey is not set for active project</p>}
        </div>
      );
  }

  /*
        /*
        {editMode === EditMode.NONE ?
          <button
            className="btn btn-primary"
            onClick={() => setEditMode({
              mode: EditMode.CREATE_ENROLLMENT,
              projectId: null,
            })}
          >
            <i className="fa fa-plus" /> Create Enrollment
          </button>
        : null}
        {editMode === EditMode.CREATE_ENROLLMENT ?
          <p>TODO: create enrollment survey</p>
        : null}
        {editMode === EditMode.UPDATE_ENROLLMENT ?
          <p>TODO: update enrollment survey</p>
        : null}
        {editMode === EditMode.EXIT_ENROLLMENT ?
          <p>TODO: exit enrollment survey</p>
        : null}
        {editMode === EditMode.ANNUAL_ENROLLMENT ?
          <p>TODO: annual enrollment survey</p>
        : null}

  */

  return (
    <div className="row">
      <div className="col-xs-12">
        <h3>{enrollments.length} Enrollments</h3>
        <div className="table-responsive enrollments-list">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                {columnNames.map((name, i) => (<th key={i}>{name}</th>))}
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (
                <EnrollmentRow
                  key={enrollment.enrollmentId}
                  enrollment={enrollment}
                  client={client}
                />
              ))}
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
        {editComponent}
      </div>
    </div>
  );
}

export default ClientEnrollments;
