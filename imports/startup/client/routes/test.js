import { AppController } from './controllers';


// Router.route('testRoute', {
//   path: '/test',
//   template: 'dataTable',
//   controller: AppController,
// });

Router.route(
  '/test', {
    name: 'testRoute',
    template: Template.dataTable,
    controller: AppController,
  }
);
