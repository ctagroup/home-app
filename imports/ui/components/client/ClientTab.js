import React from 'react';

function ClientTab(props) {
  const isActive = (tab) => props.selectedTab === tab;
  const tabClasses = `tab-pane fade ${isActive(props.id) ? 'in show active' : 'no-show'}`;
  return (
    <div
      className={tabClasses}
      id={`panel-${props.id}`} role="tabpanel"
    >
      {props.children}
    </div>
  );
}

export default ClientTab;
