import React from 'react';
import Tabs from '../helpers/tabs';

export default class ClientTabs extends React.Component {
  render() {
    return (
      <ul className="nav nav-tabs nav-justified">
        {Tabs.map((tab) => (
            <li className={tab.cssClass}>
              <a className="nav-link" data-toggle="tab" href={tab.id} role="tab">{tab.text}</a>
            </li>
          ))} 
      </ul>
    );
  }
}
