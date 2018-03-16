import GlobalProjects from '/imports/api/globalProjects/globalProjects';

/*
HMIS global project example
{
  "id": "5a78fc9d-6258-488a-a75c-bfef4fa00feb",
  "projectName": "aa",
  "projectCommonName": "bb",
  "description": "cc",
  "projects": {
    "projects": [
      {
        "projectId": "b8adfc49-078e-40ec-a130-cb705c99d65b",
        "source": "2015",
        "link": "/hmis-clientapi/v2015/rest/projects/b8adfc49-078e-40ec-a130-cb705c99d65b"
      }
    ]
  }
}
*/

export function globalProjectToDoc(project, projectUsers = [], existingDoc = {}) {
  const updatedDoc = {
    agencyName: project.projectName,
    commonName: project.projectCommonName,
    description: project.description,
    projects: project.projects.projects.map(p => p.projectId),
    members: projectUsers.map(user => {
      // copy user role wich is stored in local doc and not in HMIS
      const member = (existingDoc.members || []).find(m => m.userId === user.userId);
      return {
        userId: user.userId,
        role: member ? member.role : '?', // TODO: set default role
      };
    }),
  };
  return updatedDoc;
}

export function docToGlobalProject(doc) {
  const project = {
    projectName: doc.agencyName,
    projectCommonName: doc.commonName,
    description: doc.description,
    projects: {
      projects: doc.projects.map(id => ({ projectId: id, schema: 2015 })),
    },
  };
  const users = (doc.members || []).map(m => ({ userId: m.userId }));
  return {
    project,
    users,
  };
}

export function syncGlobalProjectsCollection(hc) {
  const projects = hc.api('global').getGlobalProjects();
  const projectsIds = projects.map(p => p.id);
  // remove local non-existing documents

  // FIXME: this is going to create a lot of mess if 2 users will
  // FIXME: call this function at the same time, because they can get
  // FIXME: two different sets of data, but at the same time
  // FIXME: they can share projects with same ids
  GlobalProjects.remove({
    _id: { $nin: projectsIds },
    createdBy: this.userId,
  });

  // create/update docs for existing global projects
  projects.forEach(project => {
    const projectUsers = hc.api('global').getGlobalProjectUsers(project.id);
    const existingDoc = GlobalProjects.findOne(project.id);

    if (!existingDoc) {
      GlobalProjects.insert({
        ...globalProjectToDoc(project, projectUsers),
        _id: project.id,
        createdBy: this.userId,
      });
    } else {
      GlobalProjects.update(project.id, { $set: {
        ...globalProjectToDoc(project, projectUsers, existingDoc),
      } });
    }
  });
}

