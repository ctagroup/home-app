
import { ReactiveDict } from 'meteor/reactive-dict';

import './roleManager.html';
import Projects from '/imports/api/projects/projects';

import HomeRoles from '/imports/config/roles.js';
import {
  ClientsAccessRoles,
  DefaultAdminAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
} from '/imports/config/permissions.js';

// TODO [VK]: move to utils
const unique = (arr) => {
  if (!Array.isArray(arr)) return arr;
  const u = {};
  u.cleanable = {};
  const a = [];
  for (let i = 0, l = arr.length; i < l; ++i) {
    if (!u.cleanable.hasOwnProperty(arr[i])) {
      a.push(arr[i]);
      u.cleanable[arr[i]] = 1;
    }
  }
  u.cleanable = null;
  return a;
};

const allRoles = [
  ClientsAccessRoles,
  DefaultAdminAccessRoles,
  GlobalHouseholdsAccessRoles,
  HousingUnitsAccessRoles,
  PendingClientsAccessRoles,
  ResponsesAccessRoles,
].reduce((a, b) => a.concat(b));

console.log('homeroles', HomeRoles, 'allRoles', unique(allRoles));

// import QuestionEditForm from '/imports/ui/components/QuestionEditForm';

// Template.projectRoles.helpers({
//   getProjectInfo(data) {
//     console.log('getProjectInfo', data);
//     return '';
//   },
// });

// {
//   projectGroup: {
//     bucketName:"ho0002-6546a3c1-5cc3-4d9c-afd6-691a2704d8b9",
//     projectGroupCode:"HO0002",
//     projectGroupDesc:"Home Application",
//     projectGroupId:"880d5a3f-d194-4239-a982-8283cc56bab3",
//     projectGroupName:"HomeApp"
//   }
// }

Template.roleManager.onCreated(function roleManagerOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('selectedTab', 'roles');
});

Template.roleManager.helpers({
  isSelected(value) {
    const instance = Template.instance();
    return instance.state.get('selectedTab') === value;
  },
  selectedClasses(value) {
    const instance = Template.instance();
    return instance.state.get('selectedTab') === value ? 'btn-primary active ' : 'btn-secondary ';
  },
  selectedTab() {
    const instance = Template.instance();
    return instance.state.get('selectedTab');
  },
  getHomeRoles() {
    return [
      { title: 'Manager' },
      { title: 'User' },
      { title: 'Admin' },
    ];
  },
  getPermissions() {
    return [
      { name: 'fake permission1' },
      { name: 'fake permission2' },
    ];
  },
  isPermissionInRole() {
    return Math.floor(Math.random() * 2) === 0 ? 'checked' : '';
  },
  getProjects() {
    console.log('Projects.find().fetch()', Projects.find().fetch());
    return Projects.find().fetch();
  },
  selectedProject() {
    return Session.get('selectedProject') || {};
  },
  isProjectSelected(projectId) {
    const data = Router.current().data();
    if (projectId === data.projectId) console.log('selected', data);
    return projectId === data.projectId ? 'selected' : '';
  },
//    component() {
//        return QuestionEditForm;
//    },
//    question() {
//        return this.question || {};
//    },
});

Template.roleManager.events(
  {
    'change select'(event) {
      console.log('Changed', event.currentTarget.value, event);
      Session.set('selectedProject', Projects.findOne(event.currentTarget.value));
    },
    'click .option-btn'(event, instance) {
      // console.log('Clicked', event, event.currentTarget.value, instance);
      instance.state.set('selectedTab', event.currentTarget.value);
    },
  }
);

Template.roleManager.onRendered(() => {
  $('.project_id').select2({
    placeholder: 'Select a project',
    allowClear: true,
    theme: 'classic',
  });
});

