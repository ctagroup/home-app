import './react.html';
import { renderRoutes } from './routes.js';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
