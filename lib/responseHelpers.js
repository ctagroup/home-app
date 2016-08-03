/**
 * Created by udit on 02/08/16.
 */

ResponseHelpers = {
  surveyContents(surveyElements, status) {
    const sectionID = [];
    for (let i = 0; i < surveyElements.length; i++) {
      if (surveyElements[i].contentType === 'section') {
        if (checkSectionAudience(surveyElements[i]._id, status)) {
          sectionID.push(surveyElements[i]);
        }
      } else {
        if (checkSectionAudience(surveyElements[i].sectionID, status)) {
          sectionID.push(surveyElements[i]);
        }
      }
    }
    return sectionID;
  },
};
