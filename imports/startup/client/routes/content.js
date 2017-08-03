import { ContentController } from './controllers';

Router.route(
  '/', {
    name: 'root',
    template: 'home',
    controller: ContentController,
  }
);

Router.route(
  '/privacy', {
    name: 'privacy',
    template: 'privacy',
    controller: ContentController,
  }
);

Router.route(
  '/terms-of-use', {
    name: 'termsOfUse',
    template: 'termsOfUse',
    controller: ContentController,
  }
);
