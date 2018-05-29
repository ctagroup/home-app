import moment from 'moment';
import './consentsList.html';

Template.consentsList.helpers({
  getConsentsToDisplay() {
    return this.consents.map(c => ({
      status: c.status,
      startTime: moment.unix(c.startTime).format('MM/DD/YYYY'),
      endTime: moment.unix(c.endTime).format('MM/DD/YYYY'),
      projects: c.globalProjects.length ?
        c.globalProjects.map(p => p.projectName).join(', ')
         : 'no projects',
    }));
  },
});
