import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <div className="tab-pane fade show" id="panel-create-enrollment" role="tabpanel">
        <div className="row">
          <div className="col-xs-12">
            <h3>Start enrollment</h3>
            <h4>for project: </h4>
            <div className="project-select">
              <div className="dropdown">
                <button
                  className="btn btn-default dropdown-toggle"
                  type="button"
                  id="dropdownMenuPS" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="true"
                >Select project
                  <span className="caret">
                  </span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuPS">
                  <li><a className="optionItem" href="#">Select project</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
