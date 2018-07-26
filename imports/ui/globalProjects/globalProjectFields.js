import './globalProjectFields.html';
import GlobalProjects from '/imports/api/globalProjects/globalProjects';
import Projects from '/imports/api/projects/projects';


function getUnassignedProjects(projectsToInclude) {
  const projectIds = new Set(Projects.find().fetch().map(p => p._id));
  GlobalProjects.find().fetch().forEach((gp) => {
    (gp.projects || []).forEach(p => projectIds.delete(p.projectId));
  });

  console.log('qqq', projectIds, projectsToInclude);

  return Projects.find(
    { _id: { $in: [...projectIds, ...projectsToInclude] } },
    { sort: {
      projectName: 1,
      schema: 1,
    } }
  ).fetch().map(p => ({
    value: `${p._id}::${p.schema.substring(1)}`,
    label: `${p.projectName} (${p.schema})`,
  }));
}

export function formSchema(doc) {
  const assignedProjects = (doc.projects || []).map(p => p.projectId);
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
        options: () => getUnassignedProjects(assignedProjects).map(p => ({
          value: p.value,
          label: p.label,
        })),
      },
    },
  };
  return new SimpleSchema(definition);
}

export function doc2form(doc) {
  const form = {
    ...doc,
    projects: (doc.projects || []).map(p => `${p.projectId}::${p.source}`),
  };
  console.log('f', form.projects);
  return form;
}
