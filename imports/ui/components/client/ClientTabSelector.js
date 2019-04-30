import React from 'react';

function ClientTabSelector(props) {
  const generateTab = (data) => {
    const isActive = (tab) => (props.selectedTab === tab ? 'active' : '');
    const linkClasses = `nav-link ${isActive(data.id)}`;
    const href = `#panel-${data.id}`;
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
