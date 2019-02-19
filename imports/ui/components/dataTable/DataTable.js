import React, { Component } from 'react';

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.perPage = this.perPage.bind(this);
  }
  
  handleChange(event) {
    const { target } = event;
    const { value: inputValue = 0 } = target;
    const { onChange } = this.props;

    const value = this.unmaskValue(inputValue);

    this.setState({
      value,
    });

    if (!onChange || typeof onChange !== 'function') {
      return false;
    }

    return onChange(event, value);
  }

  unmaskValue(maskedValue = '') {
    return parseInt(maskedValue.replace(/\D/g, '') || 0, 10) / 100;
  }

  perPage() {
    return (
      <label>Show&nbsp;
        <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" class="form-control input-sm">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        &nbsp;entries
      </label>
    )
  }
  search() {
    return (
      <label>Search:
        <input type="search" class="form-control input-sm" placeholder="" aria-controls="DataTables_Table_0"/>
      </label>
    )
  }
  pagesControl() {
    return (
      <ul class="pagination">
        <li class="paginate_button previous disabled" id="DataTables_Table_0_previous"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="0" tabindex="0">Previous</a></li>
        <li class="paginate_button active"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="1" tabindex="0">1</a></li>
        <li class="paginate_button next disabled" id="DataTables_Table_0_next"><a href="#" aria-controls="DataTables_Table_0" data-dt-idx="2" tabindex="0">Next</a></li>
      </ul>
    )
  }
  tableHeader() {
    return (
      <thead>
        <tr role="row">
          <th class="sorting_asc" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Reservation ID: activate to sort column descending" aria-sort="ascending" style="width: 274px;">Reservation ID</th>
          <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Client: activate to sort column ascending" style="width: 141px;">Client</th>
          <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Housing Unit ID: activate to sort column ascending" style="width: 287px;">Housing Unit ID</th>
          <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Match Date: activate to sort column ascending" style="width: 226px;">Match Date</th>
          <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="User ID: activate to sort column ascending" style="width: 162px;">User ID</th>
          <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Match Status: activate to sort column ascending" style="width: 251px;">Match Status</th>
          <th class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Ref: activate to sort column ascending" style="width: 103px;">Ref</th>
        </tr>
      </thead>
    )
  }

  render() {
    const { name: inputName, className, style, disabled } = this.props;
    const { maskedValue } = this.state;

    return (
      <div class="datatable_wrapper">
        <div id="DataTables_Table_0_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div class="box">
            <div class="box-header">
              <div class="box-toolbar">
                <div class="clearfix">
                  <div class="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">Showing 1 to 4 of 4 entries
                  </div>
                </div>
                <div class="pull-left">
                  <div>
                    <div class="dataTables_length" id="DataTables_Table_0_length">
                      {this.perPage()}
                    </div>
                    <div id="DataTables_Table_0_filter" class="dataTables_filter">
                      {this.search()}
                    </div>
                  </div>
                </div>
                <div class="pull-right">
                  <div class="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                      {this.pagesControl()}
                    </div>
                  </div>
                </div>
                </div>
                  <div class="box-body table-responsive">
                    <table class="table dataTable no-footer" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info" role="grid">
                      {this.tableHeader()}
                      <tbody>
                        <tr role="row" class="odd"><td class="sorting_1">25dfd2f1-069a-4020-af8c-dc90bb2b7343</td>
                          <td><a href="/clients/6a4e17c2-be4b-4e0e-92f5-5d444b0631ee?schema=v2015">Fernando Martinez</a></td>
                          <td><a href="/housingUnits/5f43d422-c601-4a0e-9de3-0577f98efd85/edit">RRH unit 1</a></td>
                          <td>2017-06-06</td>
                          <td>–––</td>
                          <td>Matched</td>
                          <td><span data-toggle="tooltip" title="2018-11-01 17:03:10.672 - Email sent to Referral Agency" class="js-tooltip label label-primary">Agency Email</span></td>
                        </tr>
                        <tr role="row" class="even">
                          <td class="sorting_1">4f4a1a6c-035c-4aaf-8a56-2246a605399d</td>
                          <td><a href="/clients/e65421a6-97ee-4668-88b3-5a56181ef7a6?schema=v2014">Mary Jones</a></td>
                          <td><a href="/housingUnits/5f43d422-c601-4a0e-9de3-0577f98efd85/edit">RRH unit 1</a></td>
                          <td>2017-05-22</td>
                          <td>–––</td>
                          <td>Matched</td>
                          <td><span data-toggle="tooltip" title="2017-05-22 05:52:05.399 - Client is surveyed" class="js-tooltip label label-primary">Survey</span></td>
                        </tr>
                        <tr role="row" class="odd">
                          <td class="sorting_1">ce892a54-4919-45b7-a5c3-6998952943c5</td>
                          <td><a href="/clients/629c9709-200a-47cd-8d7c-a41ccfe137b0?schema=v2014">Ryan Peterson</a></td>
                          <td><a href="/housingUnits/b19c4c9e-6460-4368-a8fb-393ecad0b465/edit">Permanent Housing Unit 4</a></td>
                          <td>2017-05-22</td>
                          <td>–––</td>
                          <td>Matched</td>
                          <td><span data-toggle="tooltip" title="2017-05-22 05:57:27.746 - Client is surveyed" class="js-tooltip label label-primary">Survey</span></td>
                        </tr>
                        <tr role="row" class="even">
                        <td class="sorting_1">dcbf385f-7a0c-4cbb-bc11-9af6d608a0f9</td>
                        <td><a href="/clients/2575c804-010e-4b9e-9bd7-22ec94d6bfd0?schema=v2014">Mary Jones</a></td>
                        <td><a href="/housingUnits/0c16e5ef-d4f7-46b1-9ae9-bb9f5bc99344/edit">Transitional housing unit 5</a></td>
                        <td>2017-05-22</td>
                        <td>–––</td>
                        <td>Matched</td>
                        <td><span data-toggle="tooltip" title="2017-05-22 05:42:14.135 - Client is surveyed" class="js-tooltip label label-primary">Survey</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default DataTable;
