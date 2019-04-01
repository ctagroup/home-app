import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ClientItem from './component/ClientItem.js';

export const renderRoutes = () => (
  <Router>
    <Route path="/clientr/:clientId" component={ClientItem} />
  </Router>
);
