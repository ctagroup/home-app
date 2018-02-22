import { AppController, ContentController } from './controllers';
import '/imports/ui/content/home';
import '/imports/ui/content/privacy';
import '/imports/ui/content/termsOfUse';
import '/imports/ui/content/reporting';

Router.route(
  '/', {
    name: 'root',
    template: Template.Home,
    controller: ContentController,
  }
);

Router.route(
  '/privacy', {
    name: 'privacy',
    template: Template.Privacy,
    controller: ContentController,
  }
);

Router.route(
  '/terms-of-use', {
    name: 'termsOfUse',
    template: Template.TermsOfUse,
    controller: ContentController,
  }
);

Router.route(
  '/reporting', {
    name: 'reporting',
    template: Template.Reporting,
    controller: AppController,
    data() {
      return {
        title: 'Reporting',
      };
    },
  }
);
