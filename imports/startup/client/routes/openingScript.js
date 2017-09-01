import { AppController } from './controllers';
import '/imports/ui/openingScript/openingScript';

Router.route(
  'openingScript', {
    path: '/openingScript',
    template: Template.openingScript,
    controller: AppController,
    data() {
      return {
        title: 'Opening script',
      };
    },
  }
);
