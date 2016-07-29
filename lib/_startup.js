/**
 * Created by udit on 27/07/16.
 */

AdminTables = {};

defaultColumns = () => [
  {
    data: '_id',
    title: 'ID',
  },
];

adminTablePubName = (collection) => `admin_tabular_${collection}`;

adminCreateTables = (collections) => {
  if (collections) {
    _.each(collections, (collection, name) => {
      _.defaults(collection, {
        showEditColumn: true,
        showDelColumn: true,
      });

      let columns = _.map(collection.tableColumns, (column) => {
        let createdCell;
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
          width: column.width != null ? column.width : void 0,
          searchable: column.searchable != null ? column.searchable : void 0,
          render: column.render != null ? column.render : void 0,
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
        pub: collection.children && adminTablePubName(name),
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
    onAfterAction() {
      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'View');
      Session.set('admin_collection_name', collectionName);
      if (collection.routes && collection.routes.view && collection.view.onAfterAction) {
        collection.view.onAfterAction();
      }
    },
  };

  if (collection.templates && collection.templates.view && collection.templates.view.waitOn) {
    options.waitOn = collection.templates.view.waitOn;
  }

  if (collection.routes && collection.routes.view) {
    options = _.defaults(options, collection.routes.view);
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
    onAfterAction() {
      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
      Session.set('admin_subtitle', 'Create new');
      Session.set('admin_collection_page', 'new');
      Session.set('admin_collection_name', collectionName);
      if (collection.routes && collection.routes.new && collection.routes.new.onAfterAction) {
        collection.routes.new.onAfterAction();
      }
    },
    data() {
      return {
        admin_collection: HomeUtils.adminCollectionObject(collectionName),
      };
    },
  };

  if (collection.routes && collection.routes.new) {
    options = _.defaults(options, collection.routes.new);
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
      if (collection.template && collection.template.waitOn) {
        collection.template.waitOn();
      }
    },
    action() {
      return this.render();
    },
    onAfterAction() {
      const doc = HomeUtils.adminCollectionObject(collectionName).findOne({
        _id: HomeUtils.parseID(this.params._id),
      });

      let subtitle = this.params._id;
      if (collectionName === 'users') {
        subtitle = HomeHelpers.getCurrentUserFullName();
      }

      Session.set('admin_title', AdminDashboard.collectionLabel(collectionName));
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

  if (collection.routes && collection.routes.edit) {
    options = _.defaults(options, collection.routes.edit);
  }

  return options;
};

adminCreateRouteEdit = (collection, collectionName) => Router.route(
  `adminDashboard${collectionName}Edit`,
  adminCreateRouteEditOptions(collection, collectionName)
);

adminPublishTables = (collections) => {
  _.each(collections, (collection, name) => {
    if (!collection.children) {
      return;
    }

    Meteor.publishComposite(
      adminTablePubName(name),
      function publishCompositeMethod(tableName, ids, fields) {
        check(tableName, String);
        check(ids, Array);
        const extraFields = _.reduce(collection.extraFields, (efields, efname) => {
          const efieldz = efields;
          efieldz[efname] = 1;
          return efieldz;
        }, {});
        _.extend(fields, extraFields);
        this.unblock();
        return {
          find() {
            this.unblock();
            return HomeUtils.adminCollectionObject(name).find({ _id: { $in: ids } }, { fields });
          },
          children: collection.children,
        };
      }
    );
  });
};

adminCreateRoutes = (collections) => {
  _.each(collections, adminCreateRouteView);
  _.each(collections, adminCreateRouteNew);
  _.each(collections, adminCreateRouteEdit);
};

Meteor.startup(() => {
  if (HomeConfig && HomeConfig.collections) {
    adminCreateTables(HomeConfig.collections);
    adminCreateRoutes(HomeConfig.collections);

    if (Meteor.isServer) {
      adminPublishTables(HomeConfig.collections);
    }
  }
});
