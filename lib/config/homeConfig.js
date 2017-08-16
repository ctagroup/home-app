import moment from 'moment';
/**
 * Created by udit on 13/12/15.
 */

import { PendingClients } from '/imports/api/pendingClients/pendingClients';
import { Clients } from '/imports/api/clients/clients';
import EligibleClients from '/imports/api/eligibleClients/eligibleClients';
import { ProjectsCache } from '/imports/both/cached-subscriptions';

HomeConfig = {
  name: 'H O M E',
  adminEmails: [
    'desaiuditd@gmail.com',
    'mparihar@scu.edu',
    'javier@ctagroup.org',
    'bob@ctagroup.org',
    'emma@ctagroup.org',
    'pgandhi@scu.edu',
    'fernando.c@toptal.com',
  ],
  defaultHomeRoles: [
    'Developer',
    'System Admin',
    'Admin',
    'Program Manager',
    'Case Manager',
    'Surveyor',
    'External Surveyor',
  ],
  defaultPermissions: [
    'Developer',
    'System Admin',
    'Admin',
    'Program Manager',
    'Case Manager',
    'Surveyor',
    'External Surveyor',
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
    'External Surveyor': [
      'External Surveyor',
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
  documentEditButton(path) {
    return {
      data: '_id',
      title: 'Edit',
      createdCell(node, cellData/* , rowData */) {
        $(node).html(Blaze.toHTMLWithData(Template.AppEditBtn, { path, data: { _id: cellData } }));
      },
      width: '45px',
      orderable: false,
    };
  },

  appEditButton: {
    data: '_id',
    title: 'Edit',
    createdCell(node, cellData/* , rowData */) {
      $(node).html(Blaze.toHTMLWithData(Template.AppEditBtn, { _id: cellData }));
    },
    width: '45px',
    orderable: false,
  },
  appDelButton: {
    data: '_id',
    title: 'Delete',
    createdCell(node, cellData/* , rowData */) {
      $(node).html(Blaze.toHTMLWithData(Template.AppDeleteBtn, { _id: cellData }));
    },
    width: '45px',
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
      collectionObject: PendingClients,
      icon: 'user',
      label: 'Clients',
      widgetLabel: 'Pending Clients',
      userRoles: ['Developer', 'System Admin', 'Case Manager', 'Surveyor', 'External Surveyor'],
    },
    eligibleClients: {
      collectionObject: EligibleClients,
      icon: 'user-plus',
      label: 'Active List',
      userRoles: ['Developer', 'System Admin'],
    },
    housingMatch: {
      icon: 'bed',
      label: 'Housing Match',
      userRoles: ['Developer', 'System Admin'],
    },
    questions: {
      icon: 'question',
      label: 'Questions',
      showEditColumn: false,
      userRoles: ['Developer', 'System Admin'],
    },
    surveys: {
      icon: 'file-text',
      label: 'Surveys',
      showEditColumn: false,
      userRoles: ['Developer', 'System Admin'],
      tableColumns: [
        {
          name: 'title',
          label: 'Title',
          render(value, type, doc) {
            const obj = surveys.findOne({ _id: doc._id });

            const path = Router.path(
              `adminDashboard${Session.get('admin_collection_name')}Edit`,
              { _id: obj._id }
            );

            let val = value;

            if (obj.active) {
              /* eslint-disable */
              val = `<input type="hidden" id="newsurveyID" value="${obj._id}" /><a href="${path}">${value}</a>`;
              /* eslint-enable */
            }

            return val;
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
      icon: 'comment-o',
      label: 'Responses',
      showEditColumn: false,
      showDelColumn: false,
      userRoles: ['Developer', 'System Admin', 'Case Manager', 'Surveyor', 'External Surveyor'],
      tableColumns: [
        {
          data: 'surveyID',
          title: 'Survey',
          render(value, type, doc) {
            const survey = surveys.findOne({ _id: value });
            const url = Router.path('adminDashboardresponsesEdit', { _id: doc._id });
            let title = value;
            if (survey) {
              title = survey.title;
            }
            return `<a href="${url}">${title}</a>`;
          },
        },
        {
          data: 'clientID',
          title: 'Client',
          render(value, type, doc) {
            const response = doc;
            const client = response.clientDetails;

            if (client) {
              let displayName = `${client.firstName} ${client.middleName} ${client.lastName}`;
              displayName = displayName.trim();

              if (!displayName) {
                displayName = response.clientID;
              }

              let url = Router.path(
                'viewClient',
                { _id: response.clientID }
              );
              if (response.isHMISClient && response.clientSchema) {
                url = Router.path(
                  'viewClient',
                  { _id: response.clientID },
                  { query: `isHMISClient=true&schema=${response.clientSchema}` }
                );
              }
              return `<a href="${url}">${displayName}</a>`;
            }

            return response.clientID;
          },
        },
        {
          data: 'timestamp',
          title: 'Date Updated',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
        },
        {
          data: 'responsestatus',
          title: 'Status',
          searchable: false,
          render(value, type, doc) {
            let val = '';
            const responseDetails = doc;
            const subId = responseDetails.submissionId;
            switch (value) {
              case 'Completed':
                if (subId) {
                  val = '<span class="text-success">' +
                    '<i class="fa fa-check"></i> ' +
                    'Submitted' +
                    '</span>' +
                    '<br>' +
                    `<a id="${doc._id}" href="#" class="btn UploadResponses">` +
                    '(Re-Upload to HMIS)</a>';
                } else {
                  if (responseDetails.isHMISClient && responseDetails.clientSchema) {
                    val =
                    `<a href="#" id="${doc._id}" class="btn UploadResponses">Upload to HMIS</a>`;
                  } else {
                    val = '<span class="text-warning">Upload client first</span>';
                  }
                }
                break;
              case 'Paused':
                val = '<span class="text-muted"><i class="fa fa-pause"></i> Paused</span>';
                break;
              case 'Uploading':
                val = '<i class="fa fa-spinner fa-pulse"></i>';
                break;
              default:
                val = value;
                break;
            }

            return val;
          },
        },
      ],
      templates: {
        view: {
          name: 'responsesListView',
          waitOn() {
            const query = Router.current().params.query;
            const clientID = query ? query.clientID : null;
            return Meteor.subscribe('responses', clientID);
          },
          data() {
            return {};
          },
        },
        new: {
          name: 'createResponse',
          waitOn() {
            if (this.params.query && this.params.query.schema) {
              const _id = this.params.query.client_id;
              return Meteor.subscribe('client', _id, this.params.query.schema);
            }

            const _id = this.params.query.client_id;
            return Meteor.subscribe('pendingClients.one', _id);
          },
          data() {
            const client = PendingClients.findOne({ _id: this.params.query.client_id }) ||
              Clients.findOne(this.params.query.client_id);
            if (client && this.params.query && this.params.query.schema) {
              client.isHMISClient = true;
            }
            const survey = surveys.findOne({ _id: this.params.query.survey_id });
            return { client, survey };
          },
        },
        edit: {
          name: 'editResponse',
          waitOn() {
            return Meteor.subscribe('singleResponse', this.params._id);
          },
          data() {
            const response = responses.findOne({ _id: this.params._id });
            let data = {};
            if (response) {
              const client = response.clientDetails;
              const survey = surveys.findOne({ _id: response.surveyID });
              data = { client, survey, response };
            }
            return data;
          },
        },
      },
    },
    housingUnits: {
      icon: 'home',
      label: 'Housing Units',
      userRoles: ['Developer', 'System Admin', 'Program Manager'],
    },
    globalHouseholds: {
      icon: 'users',
      label: 'Households',
      userRoles: ['Developer', 'System Admin', 'Case Manager', 'Surveyor'],
    },
    users: {
      icon: 'user-md',
      label: 'Users',
      userRoles: ['Developer', 'System Admin'],
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
          waitOn() {
            return [
              // Meteor.subscribe('projectGroups'),
              Meteor.subscribe('userProfiles'),
              Meteor.subscribe('hmisRoles'),
              ProjectsCache.subscribe('projects'),
              Meteor.subscribe('singleHMISUser', Router.current().params._id),
            ];
          },
          data() {
            const hmisUsers = singleHMISUser.find({}).fetch();

            if (hmisUsers.length > 0) {
              const user = hmisUsers[0];
              if (Roles.userIsInRole(Meteor.user(), ['Developer', 'System Admin'])) {
                user.editFormDisabled = '';
              } else {
                user.editFormDisabled = 'disabled';
              }
              return user;
            }

            return false;
          },
        },
        new: {
          name: 'AdminDashboardusersNew',
          waitOn() {
            return [
              // Meteor.subscribe('projectGroups'),
              Meteor.subscribe('userProfiles'),
              Meteor.subscribe('hmisRoles'),
            ];
          },
        },
      },
      changeSelector(selector) {
        const selectorz = selector;
        const $or = selectorz.$or;
        if ($or) {
          selectorz.$or = _.map(
            $or, (exp) => {
              let expz = exp;
              if (expz && expz.emails && expz.$regex) {
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
          name: 'services.HMIS.name',
          label: 'Name',
          render(value) {
            // some users have no name set
            if (value && value.length) {
              return value.trim();
            }
            return '';
          },
        },
        {
          name: 'emails[0].address',
          label: 'Email',
          render(value) {
            // some users have no email addresses
            if (value && value.length) {
              return value.toLowerCase();
            }
            return '';
          },
        },
        {
          name: 'emails',
          label: 'Mail',
          template: 'adminUsersMailBtn',
          width: '40px',
          searchable: false,
          orderable: false,
        },
        {
          name: 'createdAt',
          label: 'Joined',
          render(value) {
            return moment(value).format('MM/DD/YYYY');
          },
          searchable: false,
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
    enrollmentExits: '/clients/{{client_id}}/enrollments/{{enrollmentId}}/exits',
    searchClient: '/search/client',
    projects: '/projects/',
    userServiceBaseUrl: 'https://www.hmislynk.com/hmis-user-service/rest',
    accounts: '/accounts',
    account: '/accounts/{{accountId}}',
    basicInfo: '/accounts/{{username}}/basicinfo',
    selfBasicInfo: '/accounts/self/basicinfo',
    accountRoles: '/accounts/{{accountId}}/roles',
    accountRole: '/accounts/{{accountId}}/roles/{{roleId}}',
    selfPasswordChanges: '/accounts/self/passwordchanges',
    projectGroups: '/projectgroups',
    userProfiles: '/profiles',
    roles: '/roles',
    housingInventoryBaseUrl: 'https://www.hmislynk.com/inventory-api/rest',
    housingUnits: '/housing-units',
    housingUnit: '/housing-units/{{housing_unit_uuid}}',
    globalHouseholdBaseUrl: 'https://www.hmislynk.com/global-household-api',
    globalHouseholds: '/global-households',
    globalHousehold: '/global-households/{{global_household_uuid}}',
    globalHouseholdMembers: '/global-households/{{global_household_uuid}}/members',
    globalHouseholdMember: '/global-households/{{global_household_uuid}}/members/{{membership_id}}',
    globalHouseholdForClient: '/members',
    v2015: '/v2015',
    v2014: '/v2014',
    surveyServiceBaseUrl: 'https://www.hmislynk.com/survey-api/rest',
    responses: '/clients/{{clientid}}/surveys/{{surveyid}}/responses',
    response: '/clients/{{clientid}}/surveys/{{surveyid}}/responses/{{responseid}}',
    sectionScores: '/clients/{{client_id}}/surveys/{{survey_id}}/scores',
    sectionScore: '/clients/{{client_id}}/surveys/{{survey_id}}/sections/{{section_id}}/scores',
    surveyServiceQuestions: '/questiongroups/{{questiongroupid}}/questions',
    surveyServiceQuestion: '/questiongroups/{{questiongroupid}}/questions/{{questionid}}',
    pickListGroups: '/picklistgroups',
    pickListGroup: '/picklistgroups/{{picklistgroupid}}',
    pickListValues: '/picklistgroups/{{picklistgroupid}}/picklistvalues',
    pickListValue: '/picklistgroups/{{picklistgroupid}}/picklistvalues/{{picklistvalueid}}',
    surveys: '/surveys',
    survey: '/surveys/{{surveyid}}',
    surveySections: '/surveys/{{surveyid}}/surveysections',
    surveySection: '/surveys/{{surveyid}}/surveysections/{{sectionid}}',
    surveyQuestions: '/surveys/{{surveyid}}/surveysections/{{sectionid}}/questions',
    surveyQuestion: '/surveys/{{surveyid}}/surveysections/{{sectionid}}/questions/{{questionid}}',
    houseMatchingBaseUrl: 'https://www.hmislynk.com/house-matching-api',
    matches: '/matches',
    match: '/matches/client/{{clientId}}',
    status: '/matches/client/{{clientId}}/status',
    scores: '/scores',
    eligibleClients: '/eligibleclients',
    eligibleClient: '/eligibleclients/{{clientId}}',
    clientScore: '/scores/client/{{clientId}}',
  },
};
