import HousingUnits from '/imports/api/housingUnits/housingUnits';
import { HousingUnitsAccessRoles } from '/imports/config/permissions';
import { HousingUnitsCache } from '/imports/both/cached-subscriptions';
import '/imports/ui/housingUnits/housingUnitsCreateView';
import '/imports/ui/housingUnits/housingUnitsEditView';
import { AppController } from './controllers';

Router.route('adminDashboardhousingUnitsView', {
  path: '/housingUnits',
  template: 'housingUnitsListView',
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), HousingUnitsAccessRoles);
    },
  },
  waitOn() {
    return HousingUnitsCache.subscribe('housingUnits.list');
  },
  data() {
    return {
      title: 'Housing Units',
      subtitle: 'View',
    };
  },
});

Router.route('adminDashboardhousingUnitsNew', {
  path: '/housingUnits/new',
  template: Template.housingUnitCreateView,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), HousingUnitsAccessRoles);
    },
  },
  waitOn() {
    return Meteor.subscribe('projects');
  },
  data() {
    return {
      title: 'Housing Units',
      subtitle: 'New',
    };
  },
});

Router.route('adminDashboardhousingUnitsEdit', {
  path: '/housingUnits/:_id/edit',
  template: Template.housingUnitEditView,
  controller: AppController,
  authorize: {
    allow() {
      return Roles.userIsInRole(Meteor.userId(), HousingUnitsAccessRoles);
    },
  },
  waitOn() {
    const _id = this.params._id;
    return [
      Meteor.subscribe('housingUnits.one', _id),
      Meteor.subscribe('projects'),
    ];
  },
  data() {
    const _id = this.params._id;
    const housingUnit = HousingUnits.findOne({ _id });
    return {
      title: 'Housing Units',
      subtitle: 'Edit',
      housingUnit,
    };
  },
});
