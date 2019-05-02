import React, { Component } from 'react';
// import React, { Component, useState } from 'react';
// import DataTable from '/imports/ui/components/dataTable/DataTable';
// import { removeClientTagButton } from '/imports/ui/dataTable/helpers.js';
import ClientLayout from './ClientLayout';

class ClientContainer extends Component {
  // constructor() {
  //   super();
  //   this.state = { name: '', score: 0 };
  //   this.handleChange = this.handleChange.bind(this);
  //   this.addTagHandler = this.addTagHandler.bind(this);
  // }

  // addTagHandler() {
  //   this.props.newTagHandler(this.state.name, this.state.score);
  // }

  // handleChange(key, event) {
  //   const input = event.target.value;
  //   this.setState({ [key]: input });
  // }

  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    // const { maskedValue } = this.state;
    // const { client } = this.props;

    return (
      <div>
        <ClientLayout {...this.props} />
      </div>
    );
  }
}

export default ClientContainer;
