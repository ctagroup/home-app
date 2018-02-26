
import { ReactiveDict } from 'meteor/reactive-dict';

import './components/rolePermissionManager.js';
import './components/userRoleManager.js';

import './roleManager.html';
import Projects from '/imports/api/projects/projects';

Template.roleManager.onCreated(function roleManagerOnCreated() {
  this.state = new ReactiveDict();
  this.state.set('selectedTab', 'user-roles');
  this.subscribe('users.all');
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

