import FeatureDecisions from '/imports/both/featureDecisions';
import { FilesAccessRoles } from '/imports/config/permissions';
import { ContentController, AppController } from './controllers';
import '/imports/ui/submissionUploader/tempFilesList';
import '/imports/ui/submissionUploader/tempFilesNew';

const featureDecisions = FeatureDecisions.createFromMeteorSettings();
if (featureDecisions.isSubmissionUploader()) {
  Router.route('tempFilesList', {
    path: '/tempFiles',
    template: Template.tempFilesList,
    controller: AppController,
    authorize: {
      allow() {
        return Roles.userIsInRole(Meteor.userId(), FilesAccessRoles);
      },
    },
    waitOn() {
      return Meteor.subscribe('tempFiles.all');
    },
    data() {
      return {
        title: 'Files',
        subtitle: 'List',
      };
    },
  });

  Router.route('tempFilesNew', {
    path: '/tempFiles/new',
    template: Template.tempFilesNew,
    // controller: AppController,
    controller: ContentController,
    // authorize: {
    //   allow() {
    //     return Roles.userIsInRole(Meteor.userId(), FilesAccessRoles);
    //   },
    // },
    data() {
      return {
        title: 'Files',
        subtitle: 'New',
      };
    },
  });
}
