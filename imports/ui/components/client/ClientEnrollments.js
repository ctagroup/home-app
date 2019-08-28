import React from 'react';

import { dataCollectionStages, dataCollectionStageNames,
  // getStageId, getStageName
} from '/imports/both/helpers';

import {
  formatDateTimeFunction as formatDateTime,
  formatDate99Function as formatDate99,
  formatDateFunction as formatDate,
} from '/imports/ui/templateHelpers';


function ClientEnrollments(props) {
  const { enrollments, helpers } = props;
  const {
    viewEnrollmentPath,
    currentProjectHasEnrollment,
    enrollmentResponses,
    enrollmentExited,
  } = helpers;

  if (!enrollments) return (<p>Loading enrollments...</p>);

  const columnNames = [
    'Entry Date',
    'Project Name',
    'Entry Response',
    'Update Response',
    'Exit Response',
    'Date updated',
  ];
  const noSurveyText = (stage) =>
    (<span>No {dataCollectionStageNames[stage]} survey for active project</span>);

  const responsesForStage = (enrollment, stage) => {
    if (!currentProjectHasEnrollment(stage)) return null;
    return (
      <ul>
        <li><a href={viewEnrollmentPath(enrollment, stage)} className="btn btn-primary">
          <i className="fa fa-eye"></i> View
        </a></li>
        {enrollmentResponses(enrollment.enrollmentId, stage)
          .map((enrollmentResponse) => (
            <li>
              <i className="fal fa-poll-h"></i>&nbsp;
              <a href="{{pathFor 'adminDashboardresponsesEdit'}}">{
                formatDateTime(enrollmentResponse.createdAt)}</a>
            </li>)
        )}
      </ul>
    );
  };
  return (
    <div className="row">
      <div className="col-xs-12">
        <h3>Enrollments</h3>
        <div className="table-responsive enrollments-list">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                {columnNames.map((name) => (<th key={`column-${name}`}>{name}</th>))}
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={`row-${enrollment.enrollmentId}`}>
                  <td>{formatDate99(enrollment.entryDate)}</td>

                  <td>
                    <span
                      className="js-tooltip"
                      data-toggle="tooltip" title={enrollment.project.projectCommonName}
                    >
                      {enrollment.project.projectName}
                    </span>
                  </td>

                  <td>
                    {!currentProjectHasEnrollment(dataCollectionStages.ENTRY) &&
                      noSurveyText(dataCollectionStages.ENTRY)}
                    {responsesForStage(enrollment, dataCollectionStages.ENTRY)}
                  </td>

                  <td>
                    {!currentProjectHasEnrollment(dataCollectionStages.UPDATE) &&
                      noSurveyText(dataCollectionStages.UPDATE)}
                    {responsesForStage(enrollment, dataCollectionStages.UPDATE)}
                    {currentProjectHasEnrollment(dataCollectionStages.UPDATE) &&
                      <a
                        id={`u-${enrollment.enrollmentId}`}
                        className="updateLink update btn btn-default"
                      ><i className="fa fa-plus"></i> Update Enrollment</a>}
                    {currentProjectHasEnrollment(dataCollectionStages.UPDATE) &&
                      <a
                        id={`a-${enrollment.enrollmentId}`}
                        className="updateLink update btn btn-default"
                      ><i className="fa fa-plus"></i> Annual assessment</a>
                    }
                  </td>

                  <td>
                    {!currentProjectHasEnrollment(dataCollectionStages.EXIT) &&
                      noSurveyText(dataCollectionStages.EXIT)}
                    {responsesForStage(enrollment, dataCollectionStages.EXIT)}
                    {currentProjectHasEnrollment(dataCollectionStages.EXIT) &&
                      !enrollmentExited(enrollment.enrollmentId) &&
                      <a
                        id={`e-${enrollment.enrollmentId}`}
                        className="updateLink btn btn-default"
                      ><i className="fa fa-plus"></i> Exit Enrollment</a>
                    }
                  </td>

                  <td>{formatDate(enrollment.dateUpdated)}</td>

                </tr>
              ))}
            </tbody>
            <tfoot>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientEnrollments;
