import { Clients } from '/imports/api/clients/clients';
import HousingUnits from '/imports/api/housingUnits/housingUnits';
import { HousingUnitsCache, ProjectsCache } from '/imports/both/cached-subscriptions';
import '/imports/ui/housingUnits/housingUnitsCreateView';
import '/imports/ui/housingUnits/housingUnitsEditView';
import { AppController } from './controllers';

const title = 'Housing Units';

Router.route('adminDashboardhousingUnitsView', {
  path: '/housingUnits',
  template: 'housingUnitsListView',
  controller: AppController,
  waitOn() {
    return HousingUnitsCache.subscribe('housingUnits.all');
  },
  data() {
    return {
      title,
      subtitle: 'View',
    };
  },
});

Router.route('adminDashboardhousingUnitsNew', {
  path: '/housingUnits/new',
  template: Template.housingUnitCreateView,
  controller: AppController,
  waitOn() {
    return ProjectsCache.subscribe('projects');
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
  waitOn() {
    const _id = this.params._id;
    return [
      Meteor.subscribe('housingUnits.one', _id),
      ProjectsCache.subscribe('projects'),
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
