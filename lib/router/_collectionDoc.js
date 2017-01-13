/**
 * Created by udit on 01/08/16.
 */

/* eslint-disable */
import Tabular from 'meteor/aldeed:tabular';
/* eslint-enable */

AdminTables = {};

defaultColumns = () => [
  {
    data: '_id',
    title: 'ID',
  },
];

adminCreateTables = (collections) => {
  if (collections) {
    _.each(collections, (collection, name) => {
      _.defaults(collection, {
        showEditColumn: true,
        showDelColumn: true,
      });

      let columns = _.map(collection.tableColumns, (column) => {
        let createdCell = false;
        if (column.template) {
          createdCell = (node, cellData, rowData) => {
            $(node).html('');
            return Blaze.renderWithData(Template[column.template], {
              value: cellData,
              doc: rowData,
            }, node);
          };
        }
        return {
          data: column.name,
          title: column.label,
          createdCell,
          width: column.width != null ? column.width : undefined,
          searchable: column.searchable != null ? column.searchable : undefined,
          orderable: column.orderable != null ? column.orderable : undefined,
          render: column.render != null ? column.render : undefined,
        };
      });

      if (columns.length === 0) {
        columns = defaultColumns();
      }

      if (collection.showEditColumn) {
        columns.push(HomeConfig.appEditButton);
      }

      if (collection.showDelColumn) {
        columns.push(HomeConfig.appDelButton);
      }

      let changeSelector = '';
      if (collection.changeSelector) {
        changeSelector = collection.changeSelector;
      }

      AdminTables[name] = new Tabular.Table({
        name,
        collection: HomeUtils.adminCollectionObject(name),
        pub: collection.children && HomeUtils.adminTablePubName(name),
        sub: collection.sub,
        columns,
        extraFields: collection.extraFields,
        dom: HomeConfig.adminTablesDom,
        changeSelector,
      });
    });
  }
};

adminCreateRouteViewOptions = (collection, collectionName) => {
  let options = {
    path: `/${collectionName}`,
    template: 'AdminDashboardView',
    controller: 'AppController',
    data() {
      return {
        admin_table: AdminTables[collectionName],
      };
    },
    action() {
      return this.render();
    },
    onBeforeAction() {
      if (collection.userRoles) {
        if (!Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', HomeDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'View');
      Session.set('admin_collection_name', collectionName);
      if (collection.templates && collection.templates.view
          && collection.templates.view.onAfterAction) {
        collection.templates.view.onAfterAction();
      }
    },
  };

  if (collection.templates && collection.templates.view && collection.templates.view.waitOn) {
    options.waitOn = collection.templates.view.waitOn;
  }

  if (collection.templates && collection.templates.view && collection.templates.view.data) {
    options.data = collection.templates.view.data;
  }

  if (collection.routes && collection.routes.view) {
    options = _.extend(options, collection.routes.view);
  }

  return options;
};

adminCreateRouteView = (collection, collectionName) => Router.route(
  `adminDashboard${collectionName}View`,
  adminCreateRouteViewOptions(collection, collectionName)
);

adminCreateRouteNewOptions = (collection, collectionName) => {
  let options = {
    path: `/${collectionName}/new`,
    template: 'AdminDashboardNew',
    controller: 'AppController',
    action() {
      return this.render();
    },
    onBeforeAction() {
      if (collection.userRoles) {
        if (!Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      Session.set('admin_title', HomeDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'Create new');
      Session.set('admin_collection_page', 'new');
      Session.set('admin_collection_name', collectionName);
      if (collection.templates && collection.templates.new
          && collection.templates.new.onAfterAction) {
        collection.templates.new.onAfterAction();
      }
    },
    data() {
      return {
        admin_collection: HomeUtils.adminCollectionObject(collectionName),
      };
    },
  };

  if (collection.templates && collection.templates.new && collection.templates.new.waitOn) {
    options.waitOn = collection.templates.new.waitOn;
  }

  if (collection.templates && collection.templates.new && collection.templates.new.data) {
    options.data = collection.templates.new.data;
  }

  if (collection.routes && collection.routes.new) {
    options = _.extend(options, collection.routes.new);
  }

  return options;
};

adminCreateRouteNew = (collection, collectionName) => Router.route(
  `adminDashboard${collectionName}New`,
  adminCreateRouteNewOptions(collection, collectionName)
);

adminCreateRouteEditOptions = (collection, collectionName) => {
  let options = {
    path: `/${collectionName}/:_id/edit`,
    template: 'AdminDashboardEdit',
    controller: 'AppController',
    waitOn() {
      Meteor.subscribe('collectionDoc', collectionName, HomeUtils.parseID(this.params._id));
      if (collection.templates && collection.templates.edit && collection.templates.edit.waitOn) {
        collection.templates.edit.waitOn();
      }
    },
    action() {
      return this.render();
    },
    onBeforeAction() {
      if (collectionName === 'users' && Meteor.userId() === this.params._id) {
        // Do Nothing. Don't block
      } else if (collection.userRoles) {
        if (!Roles.userIsInRole(Meteor.user(), collection.userRoles)) {
          Router.go('notEnoughPermission');
        }
      }
      this.next();
    },
    onAfterAction() {
      const doc = HomeUtils.adminCollectionObject(collectionName).findOne({
        _id: HomeUtils.parseID(this.params._id),
      });

      let subtitle = this.params._id;
      if (collectionName === 'users') {
        subtitle = HomeHelpers.getCurrentUserFullName();
      }

      Session.set('admin_title', HomeDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', `Edit: ${subtitle}`);
      Session.set('admin_collection_page', 'edit');
      Session.set('admin_collection_name', collectionName);
      Session.set('admin_id', HomeUtils.parseID(this.params._id));
      Session.set('admin_doc', doc);
      if (collection.routes && collection.routes.edit && collection.routes.edit.onAfterAction) {
        collection.routes.edit.onAfterAction();
      }
    },
    data() {
      return {
        admin_collection: HomeUtils.adminCollectionObject(collectionName),
      };
    },
  };

  if (collection.templates && collection.templates.edit && collection.templates.edit.waitOn) {
    options.waitOn = collection.templates.edit.waitOn;
  }

  if (collection.templates && collection.templates.edit && collection.templates.edit.data) {
    options.data = collection.templates.edit.data;
  }

  if (collection.routes && collection.routes.edit) {
    options = _.extend(options, collection.routes.edit);
  }

  return options;
};

adminCreateRouteEdit = (collection, collectionName) => Router.route(
  `adminDashboard${collectionName}Edit`,
  adminCreateRouteEditOptions(collection, collectionName)
);

adminCreateRoutes = (collections) => {
  _.each(collections, adminCreateRouteView);
  _.each(collections, adminCreateRouteNew);
  _.each(collections, adminCreateRouteEdit);
};

if (HomeConfig && HomeConfig.collections) {
  adminCreateTables(HomeConfig.collections);
  adminCreateRoutes(HomeConfig.collections);
}
