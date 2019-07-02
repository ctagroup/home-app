import React from 'react';

function ClientTabSelector(props) {
  const generateTab = (data) => {
    const isActive = (tabId) => (props.selectedTab === tabId ? 'active' : '');
    const linkClasses = `nav-link ${isActive(data.id)}`;
    const href = `#${data.id}`;
    return (
      <li className="nav-item" key={`nav-${data.id}`}>
        <a
          className={linkClasses}
          data-toggle="tab"
          href={href}
          role="tab"
          onClick={() => props.selectTab(data.id)}
        >
          {data.title}
        </a>
      </li>
    );
  };

  return (
    <ul className="nav nav-tabs nav-justified">
      {props.tabs.map(generateTab)}
    </ul>);
}

export default ClientTabSelector;
