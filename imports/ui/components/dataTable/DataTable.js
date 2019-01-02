import React, { Component } from 'react';
// import ReactTable from "react-table";
// import 'react-table/react-table.css';

class DataTable extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   value: 0,
    //   maskedValue: '0,00',
    // };
    // this.initialState = {
    //   value: 0,
    //   maskedValue: '0,00',
    // };
    this.perPage = this.perPage.bind(this);
    this.pagesControl = this.pagesControl.bind(this);
    this.search = this.search.bind(this);
    this.tableHeader = this.tableHeader.bind(this);
    this.tableContent = this.tableContent.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.setInitialValues = this.setInitialValues.bind(this);
  }

//   componentDidMount() {
//     this.setInitialValues();
//   }

//   componentDidUpdate(prevProps) {
//     const { defaultValue: prevGivenDefaultValue } = prevProps;
//     const { defaultValue: givenDefaultValue } = this.props;

//     if (givenDefaultValue !== prevGivenDefaultValue) {
//       this.setInitialValues();
//     }

//     const valueFromProps = parseFloat(this.props.value) || 0;
//     const valueFromState = parseFloat(this.state.value);

//     if (valueFromProps !== valueFromState) {
//     this.setState({ // eslint-disable-line
//       value: valueFromProps,
//       maskedValue: this.maskValue(valueFromProps),
//     });
//     }
//   }

//   setInitialValues() {
//     const { value: givenValue, defaultValue: givenDefaultValue } = this.props;

//     const value = givenValue || givenDefaultValue;
//     const maskedValue = this.maskValue(value);

//     this.setState({
//       value,
//       maskedValue,
//     });
//   }

  handleChange(event) {
    const { target } = event;
    const { value: inputValue = 0 } = target;
    const { onChange } = this.props;

    const value = this.unmaskValue(inputValue);
    // const maskedValue = this.maskValue(value);

    this.setState({
      value,
    //   maskedValue,
    });

    if (!onChange || typeof onChange !== 'function') {
      return false;
    }

    return onChange(event, value /* , maskedValue*/);
  }

  unmaskValue(maskedValue = '') {
    return parseInt(maskedValue.replace(/\D/g, '') || 0, 10) / 100;
  }

  perPage() {
    const perPageOptions = [3, 5, 10, 50, 100]; // filter more than max rounded up
    return (
      <label>Show&nbsp;
        <select
          name="DataTables_Table_0_length"
          aria-controls="DataTables_Table_0" className="form-control input-sm"
        >
          {perPageOptions.map((perPage) => <option value={perPage}>{perPage}</option>)}
        </select>
        &nbsp;entries
      </label>
    );
  }
  search() {
    return (
      <label>Search:
        <input
          type="search"
          className="form-control input-sm"
          placeholder=""
          aria-controls="DataTables_Table_0"
        />
      </label>
    );
  }
  pagesControl() {
    return (
      <ul className="pagination">
        <li className="paginate_button previous disabled" id="DataTables_Table_0_previous">
          <a
            href="#"
            aria-controls="DataTables_Table_0" data-dt-idx="0"
            tabIndex="0"
          >Previous</a>
        </li>
        <li className="paginate_button active">
          <a
            href="#"
            aria-controls="DataTables_Table_0" data-dt-idx="1"
            tabIndex="0"
          >1</a>
        </li>
        <li className="paginate_button next disabled" id="DataTables_Table_0_next">
          <a
            href="#"
            aria-controls="DataTables_Table_0" data-dt-idx="2"
            tabIndex="0"
          >Next</a>
        </li>
      </ul>
    );
  }
  tableHeader() {
    return (
      <thead>
        <tr role="row">
          <th
            className="sorting_asc"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="Reservation ID: activate to sort column descending"
            aria-sort="ascending" style="width: 274px;"
          >Reservation ID</th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="Client: activate to sort column ascending"
            style="width: 141px;"
          >Client</th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="Housing Unit ID: activate to sort column ascending" style="width: 287px;"
          >Housing Unit ID</th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="Match Date: activate to sort column ascending" style="width: 226px;"
          >Match Date</th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="User ID: activate to sort column ascending" style="width: 162px;"
          >User ID</th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="Match Status: activate to sort column ascending" style="width: 251px;"
          >Match Status</th>
          <th
            className="sorting"
            tabIndex="0"
            aria-controls="DataTables_Table_0"
            rowSpan="1"
            colSpan="1"
            aria-label="Ref: activate to sort column ascending" style="width: 103px;"
          >Ref</th>
        </tr>
      </thead>
    );
  }

  tableContentRow() {
    // const index =
    return (
      <tr role="row" className="odd">
        <td className="sorting_1">25dfd2f1-069a-4020-af8c-dc90bb2b7343</td>
        <td>
          <a href="/clients/6a4e17c2-be4b-4e0e-92f5-5d444b0631ee?schema=v2015">Fernando Martinez</a>
        </td>
        <td>
          <a href="/housingUnits/5f43d422-c601-4a0e-9de3-0577f98efd85/edit">RRH unit 1</a>
        </td>
        <td>2017-06-06</td>
        <td>–––</td>
        <td>Matched</td>
        <td>
          <span
            data-toggle="tooltip"
            title="2018-11-01 17:03:10.672 - Email sent to Referral Agency"
            className="js-tooltip label label-primary"
          >Agency Email</span>
        </td>
      </tr>
    );
  }

  tableContent() {
    return (
      <tbody>
        {this.tableContentRow()}
        <tr role="row" className="even">
          <td className="sorting_1">4f4a1a6c-035c-4aaf-8a56-2246a605399d</td>
          <td><a href="/clients/e65421a6-97ee-4668-88b3-5a56181ef7a6?schema=v2014">Mary Jones</a>
          </td>
          <td><a href="/housingUnits/5f43d422-c601-4a0e-9de3-0577f98efd85/edit">RRH unit 1</a>
          </td>
          <td>2017-05-22</td>
          <td>–––</td>
          <td>Matched</td>
          <td>
            <span
              data-toggle="tooltip"
              title="2017-05-22 05:52:05.399 - Client is surveyed"
              className="js-tooltip label label-primary"
            >Survey</span>
          </td>
        </tr>
        <tr role="row" className="odd">
          <td className="sorting_1">ce892a54-4919-45b7-a5c3-6998952943c5</td>
          <td><a href="/clients/629c9709-200a-47cd-8d7c-a41ccfe137b0?schema=v2014">Ryan Peterson</a>
          </td>
          <td>
            <a href="/housingUnits/b19c4c9e-6460-4368-a8fb-393ecad0b465/edit">
              Permanent Housing Unit 4
            </a>
          </td>
          <td>2017-05-22</td>
          <td>–––</td>
          <td>Matched</td>
          <td>
            <span
              data-toggle="tooltip"
              title="2017-05-22 05:57:27.746 - Client is surveyed"
              className="js-tooltip label label-primary"
            >Survey</span>
          </td>
        </tr>
        <tr role="row" className="even">
          <td className="sorting_1">dcbf385f-7a0c-4cbb-bc11-9af6d608a0f9</td>
          <td><a href="/clients/2575c804-010e-4b9e-9bd7-22ec94d6bfd0?schema=v2014">Mary Jones</a>
          </td>
          <td>
            <a href="/housingUnits/0c16e5ef-d4f7-46b1-9ae9-bb9f5bc99344/edit">
              Transitional housing unit 5
            </a>
          </td>
          <td>2017-05-22</td>
          <td>–––</td>
          <td>Matched</td>
          <td>
            <span
              data-toggle="tooltip" title="2017-05-22 05:42:14.135 - Client is surveyed"
              className="js-tooltip label label-primary"
            >Survey</span>
          </td>
        </tr>
      </tbody>
    );
  }

  render() {
    // const { name: inputName, className, style, disabled } = this.props;
    // const { maskedValue } = this.state;

    return (
      <div className="datatable_wrapper">
        <div
          id="DataTables_Table_0_wrapper"
          className="dataTables_wrapper form-inline dt-bootstrap no-footer"
        >
          <div className="box">
            <div className="box-header">
              <div className="box-toolbar">
                <div className="clearfix">
                  <div
                    className="dataTables_info" id="DataTables_Table_0_info" role="status"
                    aria-live="polite"
                  >Showing 1 to 4 of 4 entries
                  </div>
                </div>
                <div className="pull-left">
                  <div>
                    <div className="dataTables_length" id="DataTables_Table_0_length">
                      {this.perPage()}
                    </div>
                    <div id="DataTables_Table_0_filter" className="dataTables_filter">
                      {this.search()}
                    </div>
                  </div>
                </div>
                <div className="pull-right">
                  <div
                    className="dataTables_paginate paging_simple_numbers"
                    id="DataTables_Table_0_paginate"
                  >
                    {this.pagesControl()}
                  </div>
                </div>
              </div>
            </div>
            <div className="box-body table-responsive">
              <table
                className="table dataTable no-footer" id="DataTables_Table_0"
                aria-describedby="DataTables_Table_0_info" role="grid"
              >
                {this.tableHeader()}
                {this.tableContent()}
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataTable;
