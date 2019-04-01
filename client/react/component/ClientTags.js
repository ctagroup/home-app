import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <div className="tab-pane fade show" id="panel-client-tags" role="tabpanel">
        <div className="row">
          <div className="col-xs-12">
            <h3>Tags</h3>
            <div className="client-tags-list-wrapper">
              <div className="tag-list-wrapper">
                <div className="tag-filter">
                  Active tags by date:
                  <div>
                    <div className="react-datepicker-wrapper">
                      <div className="react-datepicker__input-container">
                        <input type="text" className="form-control" value="" />
                      </div>
                    </div>
                  </div>
                  <strong>none</strong>
                </div>
                <br />
                <h4>Tags History</h4>
                <div className="form form-inline" ><a>Add new tag</a></div>
                <div className="tag-list">
                  <div>
                    <div className="ReactTable -highlight">
                      <div className="rt-table" role="grid">
                        <div className="rt-thead -header">
                          <div className="rt-tr" role="row">
                            <div
                              className="rt-th  -cursor-pointer" role="columnheader" tabIndex="-1"
                            >
                              <div className="">Tag Name</div>
                            </div>
                            <div
                              className="rt-th  -cursor-pointer" role="columnheader" tabIndex="-1"
                            >
                              <div className="">Operation</div>
                            </div>
                            <div
                              className="rt-th  -cursor-pointer" role="columnheader" tabIndex="-1"
                            >
                              <div className="">Applied On</div>
                            </div>
                            <div
                              className="rt-th  -cursor-pointer" role="columnheader" tabIndex="-1"
                            >
                              <div className="">Delete</div>
                            </div>
                          </div>
                        </div>
                        <div className="rt-tbody">
                          <div className="rt-tr-group" role="rowgroup">
                            <div className="rt-tr -padRow -odd" role="row">
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                            </div>
                          </div>
                          <div className="rt-tr-group" role="rowgroup">
                            <div className="rt-tr -padRow -even" role="row">
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                            </div>
                          </div>
                          <div className="rt-tr-group" role="rowgroup">
                            <div className="rt-tr -padRow -odd" role="row">
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                            </div>
                          </div>
                          <div className="rt-tr-group" role="rowgroup">
                            <div className="rt-tr -padRow -even" role="row">
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                            </div>
                          </div>
                          <div className="rt-tr-group" role="rowgroup">
                            <div className="rt-tr -padRow -odd" role="row">
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                              <div className="rt-td" role="gridcell"><span>&nbsp;</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pagination-bottom">
                        <div className="-pagination">
                          <div className="-previous">
                            <button type="button" disabled="" className="-btn">Previous</button>
                          </div>
                          <div className="-center">
                            <span className="-pageInfo">
                              Page
                              <div className="-pageJump">
                                <input aria-label="jump to page" type="number" value="1" />
                              </div>
                              of
                              <span className="-totalPages">1</span>
                            </span>
                            <span className="select-wrap -pageSizeOptions">
                              <select aria-label="rows per page">
                                <option value="5">5 rows</option>
                                <option value="10">10 rows</option>
                                <option value="20">20 rows</option>
                                <option value="25">25 rows</option>
                                <option value="50">50 rows</option>
                                <option value="100">100 rows</option>
                              </select>
                            </span>
                          </div>
                          <div className="-next">
                            <button type="button" disabled="" className="-btn">Next</button>
                          </div>
                        </div>
                      </div>
                      <div className="rt-noData">No rows found</div>
                      <div className="-loading">
                        <div className="-loading-inner">Loading...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
