import './globalProjectFields.html';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import Projects from '/imports/api/projects/projects';


function getUnassignedProjects() {
  const projectIds = new Set(Projects.find().fetch().map(p => p._id));
  console.log('a', projectIds);
  GlobalProjects.find().fetch().forEach((gp) => {
    (gp.projects || []).forEach(p => projectIds.delete(p.projectId));
  });
  console.log('b', projectIds);


  return ['aa', 'bb', 'ccc'];
}

export function formSchema() {
  const definition = {
    projectName: {
      type: String,
    },
    projectCommonName: {
      type: String,
      optional: true,
    },
    projects: {
      type: [String],
      autoform: {
        type: 'select-checkbox',
        options: () => getUnassignedProjects().map(p => ({
          label: p,
          value: p,
        })),
      },

    },
  };
  return new SimpleSchema(definition);
}

