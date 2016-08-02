/**
 * Created by udit on 13/12/15.
 */

HomeConfig = {
  name: 'H O M E',
  adminEmails: [
    'desaiuditd@gmail.com',
    'kavithamuthu14@gmail.com',
    'anushagovindan@gmail.com',
    'javier@ctagroup.org',
    'bob@ctagroup.org',
    'emma@ctagroup.org',
    'kgautam@scu.edu',
    'kghate@scu.edu',
    'agovindan@scu.edu',
  ],
  defaultHomeRoles: [
    'Developer',
    'System Admin',
    'Admin',
    'Program Manager',
    'Case Manager',
    'Surveyor',
  ],
  defaultPermissions: [
    'Developer',
    'System Admin',
    'Admin',
    'Program Manager',
    'Case Manager',
    'Surveyor',
    'view_organization',
    'create_organization',
    'edit_organization',
    'delete_organization',
    'update_referral',
    'view_user',
    'create_user',
    'edit_user',
    'delete_user',
    'manage_user_role',
    'manage_user_status',
    'reset_user_password',
    'view_reports',
    'view_survey',
    'create_survey',
    'edit_survey',
    'delete_survey',
    'view_project',
    'create_project',
    'edit_project',
    'delete_project',
    'view_inventory',
    'create_inventory',
    'edit_inventory',
    'delete_inventory',
    'view_intake',
    'create_intake',
    'edit_intake',
    'delete_intake',
    'manage_settings',
  ],
  defaultRolePermissions: {
    Developer: [
      'Developer',
      'System Admin',
      'Admin',
      'Program Manager',
      'Case Manager',
      'Surveyor',
      'view_admin',
      'view_organization',
      'create_organization',
      'edit_organization',
      'delete_organization',
      'update_referral',
      'view_user',
      'create_user',
      'edit_user',
      'delete_user',
      'manage_user_role',
      'manage_user_status',
      'reset_user_password',
      'view_reports',
      'view_survey',
      'create_survey',
      'edit_survey',
      'delete_survey',
      'view_project',
      'create_project',
      'edit_project',
      'delete_project',
      'view_inventory',
      'create_inventory',
      'edit_inventory',
      'delete_inventory',
      'view_intake',
      'create_intake',
      'edit_intake',
      'delete_intake',
      'manage_settings',
    ],
    'System Admin': [
      'System Admin',
      'Admin',
      'Program Manager',
      'Case Manager',
      'Surveyor',
      'view_organization',
      'create_organization',
      'edit_organization',
      'delete_organization',
      'update_referral',
      'view_user',
      'create_user',
      'edit_user',
      'delete_user',
      'manage_user_role',
      'manage_user_status',
      'reset_user_password',
      'view_reports',
      'view_survey',
      'create_survey',
      'edit_survey',
      'delete_survey',
      'view_project',
      'create_project',
      'edit_project',
      'delete_project',
      'view_inventory',
      'create_inventory',
      'edit_inventory',
      'delete_inventory',
      'view_intake',
      'create_intake',
      'edit_intake',
      'delete_intake',
      'manage_settings',
    ],
    Admin: [
      'Admin',
      'Program Manager',
      'Case Manager',
      'Surveyor',
      'view_user',
      'create_user',
      'edit_user',
      'delete_user',
      'reset_user_password',
      'view_reports',
      'view_project',
      'create_project',
      'edit_project',
      'delete_project',
      'view_inventory',
      'create_inventory',
      'edit_inventory',
      'delete_inventory',
    ],
    'Program Manager': [
      'Program Manager',
      'Case Manager',
      'Surveyor',
      'view_admin',
      'view_user',
      'view_reports',
      'view_inventory',
      'edit_inventory',
    ],
    'Case Manager': [
      'Case Manager',
      'Surveyor',
      'update_referral',
      'view_inventory',
      'view_intake',
      'create_intake',
      'edit_intake',
      'delete_intake',
    ],
    Surveyor: [
      'Surveyor',
      'view_survey',
      'view_intake',
      'create_intake',
      'edit_intake',
      'delete_intake',
    ],
  },
  /* eslint-disable */
  adminTablesDom: '<"box"<"box-header"<"box-toolbar"<"clearfix"ri><"pull-left"<lf>><"pull-right"p>>><"box-body table-responsive"t>>',
  /* eslint-enable */
  appEditButton: {
    data: '_id',
    title: 'Edit',
    createdCell(node, cellData/* , rowData */) {
      $(node).html(Blaze.toHTMLWithData(Template.AppEditBtn, { _id: cellData }));
    },
    width: '40px',
    orderable: false,
  },
  appDelButton: {
    data: '_id',
    title: 'Delete',
    createdCell(node, cellData/* , rowData */) {
      $(node).html(Blaze.toHTMLWithData(Template.AppDeleteBtn, { _id: cellData }));
    },
    width: '40px',
    orderable: false,
  },
  fontFamilies: [
    'Arial',
    'Arial Black',
    'Comic Sans MS',
    'Courier New',
    'Helvetica Neue',
    'Helvetica',
    'Impact',
    'Lucida Grande',
    'Raleway',
    'Tahoma',
    'Times New Roman',
    'Verdana',
  ],
  collections: {
    clients: {
      icon: 'user',
      label: 'Clients',
      templates: {
        view: {
          name: 'searchClient',
          onAfterAction() {
            Session.set('admin_subtitle', 'Search');
          },
        },
        new: {
          name: 'createClient',
        },
        edit: {
          name: 'editClient',
          data() {
            const params = Router.current().params;
            return clients.findOne({ _id: params._id });
          },
        },
      },
    },
    questions: {
      icon: 'question',
      label: 'Questions',
      showEditColumn: false,
      tableColumns: [
        {
          name: 'name',
          label: 'Question Name',
        },
        {
          name: 'question',
          label: 'Question Label',
          render(value) {
            const div = document.createElement('div');
            div.innerHTML = value;
            let text = div.textContent || div.innerText || value;

            if (text.length > 40) {
              text = text.substr(0, 40);
              text += ' ... ';
            }

            return text;
          },
        },
        {
          name: 'category',
          label: 'Category',
        },
        {
          name: 'dataType',
          label: 'Date Type',
          render(value) {
            let valuez = value;
            switch (value) {
              case 'wysiwyg':
                valuez = 'WYSIWYG';
                break;
              case 'date':
                valuez = 'Date';
                break;
              case 'label':
                valuez = 'Label';
                break;
              case 'mtv':
                valuez = 'Multiple Textbox Values';
                break;
              default:
                valuez = value;
                break;
            }
            return valuez;
          },
        },
        {
          name: 'qtype',
          label: 'Question Type',
          render(value) {
            let val = '';
            switch (value) {
              case 'hud':
                val = 'HUD';
                break;
              case 'spdat':
                val = 'VI-SPDAT';
                break;
              default:
                val = '';
                break;
            }
            return val;
          },
        },
        {
          name: 'audience',
          label: 'Audience',
          render(value) {
            let val = '';
            switch (value) {
              case 'adult':
                val = 'Adult';
                break;
              case 'hoh':
                val = 'Head of household';
                break;
              case 'bothadultsandhoh':
                val = 'Adults and Head of Household';
                break;
              case 'child':
                val = 'Child';
                break;
              case 'everyone':
                val = 'Everyone';
                break;
              default:
                val = '';
                break;
            }
            return val;
          },
        },
        {
          name: 'locked',
          label: 'Locked?',
          render(value) {
            /* eslint-disable */
            return value ? '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>' : '';
            /* eslint-enable */
          },
        },
        {
          name: 'iscopy',
          label: 'Copy?',
          render(value) {
            /* eslint-disable */
            return value ? '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>' : '';
            /* eslint-enable */
          },
        },
        {
          name: 'createdAt',
          label: 'Date created',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
        {
          name: 'updatedAt',
          label: 'Date updated',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
        {
          name: '_id',
          label: 'Edit',
          orderable: false,
          render(value, type, doc) {
            /* eslint-disable */
            return `<a href="#newQuestionModal" role="button" data-toggle="modal" data-survey-id="${doc._id}" class="btn btn-primary edit"><i class="fa fa-edit"></i></a>`;
            /* eslint-enable */
          },
        },
      ],
      templates: {
        view: {
          name: 'questionViewTemplate',
        },
      },
    },
    surveys: {
      icon: 'file-text',
      label: 'Surveys',
      showEditColumn: false,
      tableColumns: [
        {
          name: 'title',
          label: 'Title',
          render(value, type, doc) {
            const path = Router.path(
              `adminDashboard${Session.get('admin_collection_name')}Edit`,
              { _id: doc._id }
            );

            let val = value;

            if (doc.active) {
              /* eslint-disable */
              val = `<input type="hidden" id="newsurveyID" value="${doc.id}" /><a href="${path}">${value}</a>`;
              /* eslint-enable */
            }

            return val;
          },
        },
        {
          name: 'stype',
          label: 'Survey Type',
          orderable: false,
          render(value) {
            let val = '';
            switch (value) {
              case 'hud':
                val = 'HUD';
                break;
              case 'spdat':
                val = 'VI-SPDAT';
                break;
              default:
                val = '';
                break;
            }
            return val;
          },
        },
        {
          name: 'active',
          label: 'Active?',
          orderable: false,
          render(value) {
            return value ? '<i class="fa fa-check"></i>' : '';
          },
        },
        {
          name: 'copy',
          label: 'Copy?',
          orderable: false,
          render(value) {
            /* eslint-disable */
            return value ? '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>' : '';
            /* eslint-enable */
          },
        },
        {
          name: 'createdAt',
          label: 'Date created',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
        {
          name: 'updatedAt',
          label: 'Date updated',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
        {
          name: '_id',
          label: 'Edit',
          orderable: false,
          render(value, type, doc) {
            /* eslint-disable */
            return `<a href="#newSurveyModal" role="button" data-toggle="modal" data-survey-id="${doc._id}" class="btn btn-primary edit"><i class="fa fa-edit"></i></a>`;
            /* eslint-enable */
          },
        },
      ],
      templates: {
        view: {
          name: 'surveyViewTemplate',
        },
        edit: {
          name: 'surveyEditTemplate',
          data() {
            return Meteor.isClient && Session.get('admin_doc');
          },
        },
      },
    },
    responses: {
      icon: 'comments-o',
      label: 'Responses',
      templates: {

      },
    },
    housingUnits: {
      icon: 'home',
      label: 'Housing Units',
      tableColumns: [
        {
          title: 'ID',
          data: 'housingInventoryId',
        },
        {
          title: 'Active?',
          data: 'inactive',
          orderable: false,
          render(value) {
            /* eslint-disable */
            return value ? '' : '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>';
            /* eslint-enable */
          },
        },
        {
          title: 'Current Beds',
          data: 'bedsCurrent',
        },
        {
          title: 'Project',
          data: 'projectId',
        },
        {
          title: 'User',
          data: 'userId',
        },
        {
          title: 'Beds Capacity',
          data: 'bedsCapacity',
        },
        {
          title: 'In Service?',
          data: 'inService',
          render(value) {
            /* eslint-disable */
            return value ? '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>' : '';
            /* eslint-enable */
          },
        },
        {
          title: 'Vacant?',
          data: 'vacant',
          render(value) {
            /* eslint-disable */
            return value ? '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>' : '';
            /* eslint-enable */
          },
        },
      ],
      templates: {
        view: {
          name: 'housingUnitsListView',
          waitOn() {
            return Meteor.subscribe('housingUnits');
          },
        },
        edit: {
          name: 'housingUnitEditView',
          waitOn() {
            const _id = Router.current().params._id;
            return Meteor.subscribe('singleHousingUnit', _id);
          },
          data() {
            const _id = Router.current().params._id;
            return housingUnits.findOne({ _id });
          },
        },
      },
    },
    housingMatch: {
      icon: 'bed',
      label: 'Housing Matching Service',
      tableColumns: [
        {
          title: 'Reservation ID',
          data: 'reservation_id', // note: access nested data like this
        },
        {
          title: 'Client ID',
          data: 'client_id', // note: access nested data like this
        },
        {
          title: 'Housing Unit ID',
          data: 'housing_unit_id', // note: access nested data like this
        },
        {
          title: 'Match Date',
          data: 'match_date', // note: access nested data like this
        },
        {
          title: 'User ID',
          data: 'user_id', // note: access nested data like this
        },
        {
          title: 'Matched Status',
          data: 'matchedStatus', // note: access nested data like this
        },
      ],
      templates: {
        view: {
          name: 'housingMatchListView',
          data() {
            return {};
          },
          waitOn() {
            return Meteor.subscribe('housingMatch');
          },
        },
      },
    },
    globalHousehold: {
      icon: 'users',
      label: 'Global Household',
      tableColumns: [
        {
          title: 'Global Household ID',
          data: 'globalHouseholdId', // note: access nested data like this
        },
        {
          title: 'Head of HouseHold ID',
          data: 'headOfHouseholdId', // note: access nested data like this
        },
        {
          title: 'Date Created',
          data: 'dateCreated', // note: access nested data like this
        },
        {
          title: 'Date Updated',
          data: 'dateUpdated', // note: access nested data like this
        },
        {
          title: 'User Created',
          data: 'userCreate', // note: access nested data like this
        },
        {
          title: 'Updated User',
          data: 'userUpdate', // note: access nested data like this
        },
        {
          title: 'Active?',
          data: 'inactive',
          orderable: false,
          render(value) {
            /* eslint-disable */
            return value ? '' : '<i class="fa fa-check js-tooltip" data-toggle="tooltip" data-placement="right" title=""></i>';
            /* eslint-enable */
          },
        },
      ],
      templates: {
        view: {
          name: 'globalHouseholdListView',
          data() {
            return {};
          },
          waitOn() {
            return Meteor.subscribe('globalHousehold');
          },
        },
        edit: {
          name: 'globalHouseholdEditView',
          waitOn() {
            const _id = Router.current().params._id;
            return Meteor.subscribe('singleGlobalHousehold', _id);
          },
          data() {
            const _id = Router.current().params._id;
            return globalHousehold.findOne({ _id });
          },
        },
      },
    },
    users: {
      icon: 'user-md',
      label: 'Users',
      templates: {
        view: {
          name: 'AdminDashboardusersView',
          data() {
            return {
              admin_table: AdminTables.users,
            };
          },
        },
        edit: {
          name: 'AdminDashboardusersEdit',
        },
      },
      changeSelector(selector) {
        const selectorz = selector;
        const $or = selectorz.$or;
        if ($or) {
          selectorz.$or = _.map(
            $or, (exp) => {
              let expz = exp;
              const ref = expz.emails;
              if ((ref != null ? ref.$regex : void 0) != null) {
                expz = {
                  emails: {
                    $elemMatch: {
                      address: expz.emails,
                    },
                  },
                };
              }
              return expz;
            }
          );
        }
        return selectorz;
      },
      tableColumns: [
        {
          name: 'emails',
          label: 'Email',
          render(value) {
            // some users have no email addresses
            if (value && value.length) {
              return value[0].address;
            }
            return '';
          },
          searchable: true,
        },
        {
          name: 'emails',
          label: 'Mail',
          template: 'adminUsersMailBtn',
          width: '40px',
        },
        {
          name: 'createdAt',
          label: 'Joined',
        },
      ],
    },
  },
  googleMaps: {
    apiKey: 'AIzaSyC2dPMYEhEoqnUe8LQZK9SVemORszJ-NgE',
  },
  hmisAPIEndpoints: {
    apiBaseUrl: 'https://www.hmislynk.com',
    oauthBaseUrl: 'https://www.hmislynk.com/hmis-authorization-service/rest',
    authorize: '/authorize/',
    token: '/token/',
    revoke: '/revoke/',
    clientBaseUrl: 'https://www.hmislynk.com/hmis-clientapi/rest',
    clients: '/clients/',
    enrollments: '/clients/{{client_id}}/enrollments',
    searchClient: '/search/client',
    userServiceBaseUrl: 'https://www.hmislynk.com/hmis-user-service/rest',
    basicInfo: '/accounts/{{username}}/basicinfo',
    selfBasicInfo: '/accounts/self/basicinfo',
    housingInventoryBaseUrl: 'https://www.hmislynk.com/inventory-api/rest',
    housingUnits: '/housing-units',
    housingUnit: '/housing-units/{{housing_unit_uuid}}',
    globalHouseholdBaseUrl: 'https://www.hmislynk.com/global-household-api',
    globalHouseholds: '/global-households',
    globalHousehold: '/global-households/{{global_household_uuid}}',
    v2015: '/v2015',
    v2014: '',
  },
};
