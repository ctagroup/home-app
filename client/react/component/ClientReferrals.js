import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <div className="tab-pane fade show" id="panel-referrals" role="tabpanel">
        <div className="row">
          <div className="col-xs-12">
            <h3>Referral Status</h3>
            <div className="row">
              <div className="col-xs-9 my-center-block">
                <div id="referral-timeline">
                  <div className="navigation">
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Client is surveyed"
                    >
                      <a
                        id="js-btn-step-0" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step0" data-toggle="tab"
                        data-step="0" aria-expanded="true"
                      >Survey</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="" data-original-title="Email sent to Referral Agency"
                    >
                      <a
                        id="js-btn-step-1" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step1" data-toggle="tab"
                        data-step="1" aria-expanded="true"
                      >Agency Email</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Client is contacted by Agency"
                    >
                      <a
                        id="js-btn-step-2" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step2" data-toggle="tab"
                        data-step="2" aria-expanded="true"
                      >Contact</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Agency scheduled appointment with Client"
                    >
                      <a
                        id="js-btn-step-3" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step3" data-toggle="tab"
                        data-step="3" aria-expanded="true"
                      >Appointment</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Client missed 1st appointment"
                    >
                      <a
                        id="js-btn-step-4" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step4" data-toggle="tab"
                        data-step="4" aria-expanded="true"
                      >Appointment Miss 1</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Client missed 2nd appointment"
                    >
                      <a
                        id="js-btn-step-5" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step5" data-toggle="tab"
                        data-step="5" aria-expanded="true"
                      >Appointment Miss 2</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Paperwork initiated by Agency"
                    >
                      <a
                        id="js-btn-step-6" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step6" data-toggle="tab"
                        data-step="6" aria-expanded="true"
                      >Paperwork</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Client accepted referral"
                    >
                      <a
                        id="js-btn-step-7" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step7" data-toggle="tab"
                        data-step="7" aria-expanded="true"
                      >Acceptance</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Move-in Preparation initiated by Agency"
                    >
                      <a
                        id="js-btn-step-8" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step8" data-toggle="tab"
                        data-step="8" aria-expanded="true"
                      >Move-in Prep</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Client moved in"
                    >
                      <a
                        id="js-btn-step-9" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step9" data-toggle="tab"
                        data-step="9" aria-expanded="true"
                      >Move-in</a>
                    </span>
                    <span
                      className="css-tooltip-button-span" data-toggle="tooltip" data-html="true"
                      title="Referral is rejected"
                    >
                      <a
                        id="js-btn-step-10" className="btn btn-default btn-sm btn-arrow-right
                        js-open-referral-status-modal js-tooltip" href="#step10" data-toggle="tab"
                        data-step="10" aria-expanded="true"
                      >Rejection</a>
                    </span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-default progress-bar-striped active"
                      role="progressbar" aria-valuenow="0" aria-valuemin="1"
                    ></div>
                  </div>
                  <div
                    className="modal fade modal-fullscreen" id="referralStatusUpdateCommentsModal"
                    tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title text-center">Update Referral Status</h1>
                        </div>
                        <form id="update-referral-status">
                          <div className="modal-body content">
                            <div className="row">
                              <div className="col-xs-12 col-sm-6 col-md-6 my-center-block">
                                <input
                                  type="hidden" name="referral-status-step"
                                  id="referral-status-step" value=""
                                />
                                <div id="referralStatusComments" className="js-summernote"></div>
                                <div className="note-editor note-frame panel panel-default">
                                  <div className="note-dropzone">
                                    <div className="note-dropzone-message"></div>
                                  </div>
                                  <div className="note-toolbar panel-heading">
                                    <div className="note-btn-group btn-group note-style">
                                      <div className="note-btn-group btn-group">
                                        <button
                                          type="button" className="note-btn btn btn-default
                                          btn-sm dropdown-toggle" data-toggle="dropdown" title=""
                                          data-original-title="Style"
                                        >
                                          <i className="note-icon-magic"></i>
                                          <span className="note-icon-caret"></span>
                                        </button>
                                        <div className="dropdown-menu dropdown-style">
                                          <li><a href="#" data-value="p"><p>p</p></a></li>
                                          <li>
                                            <a href="#" data-value="blockquote">
                                              <blockquote>blockquote</blockquote>
                                            </a>
                                          </li>
                                          <li><a href="#" data-value="pre"><pre>pre</pre></a></li>
                                          <li><a href="#" data-value="h1"><h1>h1</h1></a></li>
                                          <li><a href="#" data-value="h2"><h2>h2</h2></a></li>
                                          <li><a href="#" data-value="h3"><h3>h3</h3></a></li>
                                          <li><a href="#" data-value="h4"><h4>h4</h4></a></li>
                                          <li><a href="#" data-value="h5"><h5>h5</h5></a></li>
                                          <li><a href="#" data-value="h6"><h6>h6</h6></a></li>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="note-btn-group btn-group note-font">
                                      <button
                                        type="button"
                                        className="note-btn btn btn-default btn-sm note-btn-bold"
                                        title="" data-original-title="Bold (CTRL+B)"
                                      >
                                        <i className="note-icon-bold"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="note-btn btn btn-sm note-btn-underline"
                                        title="" data-original-title="Underline (CTRL+U)"
                                      >
                                        <i className="note-icon-underline"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="note-btn btn btn-default btn-sm"
                                        title="" data-original-title="Remove Font Style (CTRL+\)"
                                      >
                                        <i className="note-icon-eraser"></i>
                                      </button>
                                    </div>
                                    <div className="note-btn-group btn-group note-fontname">
                                      <div className="note-btn-group btn-group">
                                        <button
                                          type="button" className="note-btn btn btn-default
                                          btn-sm dropdown-toggle" data-toggle="dropdown"
                                          title="" data-original-title="Font Family"
                                        >
                                          <span className="note-current-fontname">Raleway</span>
                                          <span className="note-icon-caret"></span>
                                        </button>
                                        <div className="dropdown-menu note-check dropdown-fontname">
                                          <li>
                                            <a href="#" data-value="Arial" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Arial</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Arial Black" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Arial Black</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Comic Sans MS" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Comic Sans MS</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Courier New" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Courier New</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Helvetica" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Helvetica</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Impact" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Impact</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Raleway" className="checked">
                                              <i className="note-icon-check"></i>
                                              <span>Raleway</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Tahoma" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Tahoma</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Times New Roman" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Times New Roman</span>
                                            </a>
                                          </li>
                                          <li>
                                            <a href="#" data-value="Verdana" className="">
                                              <i className="note-icon-check"></i>
                                              <span>Verdana</span>
                                            </a>
                                          </li>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="note-btn-group btn-group note-color">
                                      <div className="note-btn-group btn-group note-color">
                                        <button
                                          type="button"
                                          className="note-btn btn btn-sm note-current-color-button"
                                          title="" data-original-title="Recent Color"
                                          data-backcolor="#FFFF00"
                                        >
                                          <i className="note-icon-font note-recent-color"></i>
                                        </button>
                                        <button
                                          type="button"
                                          className="note-btn btn btn-sm dropdown-toggle"
                                          data-toggle="dropdown"
                                          title=""
                                          data-original-title="More Color"
                                        >
                                          <span className="note-icon-caret"></span>
                                        </button>
                                        <div className="dropdown-menu">
                                          <li>
                                            <div className="btn-group">
                                              <div className="note-palette-title">
                                                Background Color
                                              </div>
                                              <div>
                                                <button
                                                  type="button"
                                                  className="note-color-reset btn btn-default"
                                                  data-event="backColor" data-value="inherit"
                                                >
                                                Transparent
                                                </button>
                                              </div>
                                              <div className="note-holder" data-event="backColor">
                                                <div className="note-color-palette">
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button"
                                                      className="note-color-btn"
                                                      data-event="backColor"
                                                      data-value="#000000" title=""
                                                      data-toggle="button"
                                                      tabIndex="-1" data-original-title="#000000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#424242"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#424242"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#636363"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#636363"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#9C9C94"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9C9C94"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#CEC6CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CEC6CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#EFEFEF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#EFEFEF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#F7F7F7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#F7F7F7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFFFFF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFFFFF"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FF0000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FF0000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FF9C00"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FF9C00"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFFF00"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFFF00"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#00FF00"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#00FF00"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#00FFFF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#00FFFF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#0000FF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#0000FF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#9C00FF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9C00FF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FF00FF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FF00FF"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#F7C6CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#F7C6CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFE7CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFE7CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFEFC6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFEFC6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#D6EFD6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#D6EFD6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#CEDEE7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CEDEE7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#CEE7F7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CEE7F7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#D6D6E7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#D6D6E7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#E7D6DE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E7D6DE"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#E79C9C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E79C9C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFC69C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFC69C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFE79C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFE79C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#B5D6A5"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#B5D6A5"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#A5C6CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#A5C6CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#9CC6EF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9CC6EF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#B5A5D6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#B5A5D6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#D6A5BD"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#D6A5BD"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#E76363"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E76363"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#F7AD6B"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#F7AD6B"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#FFD663"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFD663"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#94BD7B"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#94BD7B"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#73A5AD"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#73A5AD"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#6BADDE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#6BADDE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#8C7BC6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#8C7BC6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#C67BA5"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#C67BA5"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#CE0000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CE0000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#E79439"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E79439"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#EFC631"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#EFC631"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#6BA54A"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#6BA54A"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#4A7B8C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#4A7B8C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#3984C6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#3984C6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#634AA5"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#634AA5"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#A54A7B"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#A54A7B"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#9C0000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9C0000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#B56308"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#B56308"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#BD9400"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#BD9400"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#397B21"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#397B21"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#104A5A"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#104A5A"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#085294"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#085294"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#311873"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#311873"
                                                    ></button>
                                                    <button
                                                      type="button"className="note-color-btn"
                                                      data-event="backColor" data-value="#731842"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#731842"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#630000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#630000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#7B3900"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#7B3900"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#846300"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#846300"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#295218"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#295218"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#083139"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#083139"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#003163"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#003163"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#21104A"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#21104A"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="backColor" data-value="#4A1031"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#4A1031"
                                                    ></button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="btn-group">
                                              <div
                                                className="note-palette-title"
                                              >Foreground Color
                                              </div>
                                              <div>
                                                <button
                                                  type="button"
                                                  className="note-color-reset btn btn-default"
                                                  data-event="removeFormat" data-value="foreColor"
                                                >Reset to default</button>
                                              </div>
                                              <div className="note-holder" data-event="foreColor">
                                                <div className="note-color-palette">
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#000000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#000000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#424242"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#424242"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#636363"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#636363"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#9C9C94"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9C9C94"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#CEC6CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CEC6CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#EFEFEF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#EFEFEF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#F7F7F7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#F7F7F7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFFFFF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFFFFF"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FF0000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FF0000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FF9C00"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FF9C00"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFFF00"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFFF00"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#00FF00"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#00FF00"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#00FFFF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#00FFFF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#0000FF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#0000FF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#9C00FF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9C00FF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FF00FF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FF00FF"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#F7C6CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#F7C6CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFE7CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFE7CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFEFC6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFEFC6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#D6EFD6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#D6EFD6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#CEDEE7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CEDEE7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#CEE7F7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CEE7F7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#D6D6E7"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#D6D6E7"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#E7D6DE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E7D6DE"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#E79C9C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E79C9C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFC69C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFC69C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFE79C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFE79C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#B5D6A5"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#B5D6A5"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#A5C6CE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#A5C6CE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#9CC6EF"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9CC6EF"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#B5A5D6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#B5A5D6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#D6A5BD"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#D6A5BD"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#E76363"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E76363"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#F7AD6B"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#F7AD6B"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#FFD663"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#FFD663"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#94BD7B"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#94BD7B"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#73A5AD"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#73A5AD"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#6BADDE"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#6BADDE"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#8C7BC6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#8C7BC6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#C67BA5"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#C67BA5"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#CE0000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#CE0000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#E79439"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#E79439"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#EFC631"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#EFC631"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#6BA54A"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#6BA54A"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#4A7B8C"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#4A7B8C"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#3984C6"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#3984C6"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#634AA5"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#634AA5"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#A54A7B"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#A54A7B"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#9C0000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#9C0000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#B56308"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#B56308"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#BD9400"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#BD9400"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#397B21"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#397B21"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#104A5A"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#104A5A"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#085294"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#085294"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#311873"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#311873"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#731842"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#731842"
                                                    ></button>
                                                  </div>
                                                  <div className="note-color-row">
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#630000"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#630000"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#7B3900"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#7B3900"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#846300"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#846300"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#295218"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#295218"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#083139"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#083139"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#003163"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#003163"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#21104A"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#21104A"
                                                    ></button>
                                                    <button
                                                      type="button" className="note-color-btn"
                                                      data-event="foreColor" data-value="#4A1031"
                                                      title="" data-toggle="button" tabIndex="-1"
                                                      data-original-title="#4A1031"
                                                    ></button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="note-btn-group btn-group note-para">
                                      <button
                                        type="button" className="note-btn btn btn-default btn-sm"
                                        title=""
                                        data-original-title="Unordered list (CTRL+SHIFT+NUM7)"
                                      ><i className="note-icon-unorderedlist"></i></button>
                                      <button
                                        type="button" className="note-btn btn btn-default btn-sm"
                                        title=""
                                        data-original-title="Ordered list (CTRL+SHIFT+NUM8)"
                                      ><i className="note-icon-orderedlist"></i></button>
                                      <div className="note-btn-group btn-group">
                                        <button
                                          type="button"
                                          className="note-btn btn btn-sm dropdown-toggle"
                                          data-toggle="dropdown" title=""
                                          data-original-title="Paragraph"
                                        >
                                          <i className="note-icon-align-left"></i>
                                          <span className="note-icon-caret"></span>
                                        </button>
                                        <div className="dropdown-menu">
                                          <div className="note-btn-group btn-group note-align">
                                            <button
                                              type="button"
                                              className="note-btn btn btn-default btn-sm"
                                              title=""
                                              data-original-title="Align left (CTRL+SHIFT+L)"
                                            ><i className="note-icon-align-left"></i></button>
                                            <button
                                              type="button"
                                              className="note-btn btn btn-default btn-sm"
                                              title=""
                                              data-original-title="Align center (CTRL+SHIFT+E)"
                                            ><i className="note-icon-align-center"></i></button>
                                            <button
                                              type="button"
                                              className="note-btn btn btn-default btn-sm"
                                              title=""
                                              data-original-title="Align right (CTRL+SHIFT+R)"
                                            ><i className="note-icon-align-right"></i></button>
                                            <button
                                              type="button"
                                              className="note-btn btn btn-default btn-sm"
                                              title=""
                                              data-original-title="Justify full (CTRL+SHIFT+J)"
                                            ><i className="note-icon-align-justify"></i></button>
                                          </div>
                                          <div className="note-btn-group btn-group note-list">
                                            <button
                                              type="button"
                                              className="note-btn btn btn-default btn-sm"
                                              title=""
                                              data-original-title="Outdent (CTRL+[)"
                                            ><i className="note-icon-align-outdent"></i></button>
                                            <button
                                              type="button"
                                              className="note-btn btn btn-default btn-sm"
                                              title="" data-original-title="Indent (CTRL+])"
                                            ><i className="note-icon-align-indent"></i></button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="note-btn-group btn-group note-table">
                                      <div className="note-btn-group btn-group">
                                        <button
                                          type="button"
                                          className="note-btn btn btn-sm dropdown-toggle"
                                          data-toggle="dropdown" title=""
                                          data-original-title="Table"
                                        >
                                          <i className="note-icon-table"></i>
                                          <span className="note-icon-caret"></span>
                                        </button>
                                        <div className="dropdown-menu note-table">
                                          <div className="note-dimension-picker">
                                            <div
                                              className="note-dimension-picker-mousecatcher"
                                              data-event="insertTable" data-value="1x1"
                                            >
                                            </div>
                                            <div className="note-dimension-picker-highlighted">
                                            </div>
                                            <div className="note-dimension-picker-unhighlighted">
                                            </div>
                                          </div>
                                          <div className="note-dimension-display">1 x 1</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="note-btn-group btn-group note-insert">
                                      <button
                                        type="button"
                                        className="note-btn btn btn-default btn-sm"
                                        title="" data-original-title="Link"
                                      ><i className="note-icon-link"></i></button>
                                      <button
                                        type="button"
                                        className="note-btn btn btn-default btn-sm"
                                        title="" data-original-title="Picture"
                                      ><i className="note-icon-picture"></i></button>
                                      <button
                                        type="button" className="note-btn btn btn-default btn-sm"
                                        title="" data-original-title="Video"
                                      ><i className="note-icon-video"></i></button>
                                    </div>
                                    <div className="note-btn-group btn-group note-view">
                                      <button
                                        type="button"
                                        className="note-btn btn btn-default btn-sm btn-fullscreen"
                                        title="" data-original-title="Full Screen"
                                      ><i className="note-icon-arrows-alt"></i></button>
                                      <button
                                        type="button"
                                        className="note-btn btn btn-default btn-sm btn-codeview"
                                        title="" data-original-title="Code View"
                                      ><i className="note-icon-code"></i></button>
                                      <button
                                        type="button" className="note-btn btn btn-default btn-sm"
                                        title="" data-original-title="Help"
                                      ><i className="note-icon-question"></i></button>
                                    </div>
                                  </div>
                                  <div className="note-editing-area">
                                    <div className="note-handle">
                                      <div className="note-control-selection">
                                        <div className="note-control-selection-bg"></div>
                                        <div className="note-control-holder note-control-nw"></div>
                                        <div className="note-control-holder note-control-ne"></div>
                                        <div className="note-control-holder note-control-sw"></div>
                                        <div className="note-control-sizing note-control-se"></div>
                                        <div className="note-control-selection-info"></div>
                                      </div>
                                    </div>
                                    <textarea className="note-codable"></textarea>
                                    <div
                                      className="note-editable panel-body" contentEditable="true"
                                    >
                                      <p>
                                        <br />
                                      </p>
                                    </div>
                                  </div>
                                  <div className="note-statusbar">
                                    <div className="note-resizebar">
                                      <div className="note-icon-bar"></div>
                                      <div className="note-icon-bar"></div>
                                      <div className="note-icon-bar"></div>
                                    </div>
                                  </div>
                                  <div
                                    className="modal link-dialog" aria-hidden="false" tabIndex="-1"
                                  >
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <button
                                            type="button" className="close" data-dismiss="modal"
                                            aria-label="Close"
                                          ><span aria-hidden="true">×</span></button>
                                          <h4 className="modal-title">Insert Link</h4>
                                        </div>
                                        <div className="modal-body">
                                          <div className="form-group">
                                            <label>Text to display</label>
                                            <input
                                              className="note-link-text form-control" type="text"
                                            />
                                          </div>
                                          <div className="form-group">
                                            <label>To what URL should this link go?</label>
                                            <input
                                              className="note-link-url form-control"
                                              type="text" value="http://"
                                            />
                                          </div>
                                          <div className="checkbox">
                                            <label>
                                              <input
                                                type="checkbox" checked=""
                                              /> Open in new window
                                            </label>
                                          </div>
                                        </div>
                                        <div className="modal-footer">
                                          <button
                                            href="#"
                                            className="btn btn-primary note-link-btn disabled"
                                            disabled=""
                                          >Insert Link</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal" aria-hidden="false" tabIndex="-1">
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <button
                                            type="button" className="close" data-dismiss="modal"
                                            aria-label="Close"
                                          ><span aria-hidden="true">×</span></button>
                                          <h4 className="modal-title">Insert Image</h4>
                                        </div>
                                        <div className="modal-body">
                                          <div
                                            className="form-group note-group-select-from-files"
                                          >
                                            <label>Select from files</label>
                                            <input
                                              className="note-image-input form-control"
                                              type="file"
                                              name="files" multiple="multiple"
                                            />
                                          </div>
                                          <div className="form-group">
                                            <label>Image URL</label>
                                            <input
                                              className="note-image-url form-control col-md-12"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div className="modal-footer">
                                          <button
                                            href="#"
                                            className="btn btn-primary note-image-btn disabled"
                                            disabled=""
                                          >Insert Image</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal" aria-hidden="false" tabIndex="-1">
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <button
                                            type="button" className="close" data-dismiss="modal"
                                            aria-label="Close"
                                          ><span aria-hidden="true">×</span></button>
                                          <h4 className="modal-title">Insert Video</h4>
                                        </div>
                                        <div className="modal-body">
                                          <div className="form-group row-fluid">
                                            <label>Video URL?
                                              <small
                                                className="text-muted"
                                              >
                                                (YouTube, Vimeo, Vine, Instagram,
                                                DailyMotion or Youku)
                                              </small>
                                            </label>
                                            <input
                                              className="note-video-url form-control span12"
                                              type="text"
                                            />
                                          </div>
                                        </div>
                                        <div className="modal-footer">
                                          <button
                                            href="#"
                                            className="btn btn-primary note-video-btn disabled"
                                            disabled=""
                                          >Insert Video</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal" aria-hidden="false" tabIndex="-1">
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <button
                                            type="button" className="close" data-dismiss="modal"
                                            aria-label="Close"
                                          ><span aria-hidden="true">×</span></button>
                                          <h4 className="modal-title">Help</h4>
                                        </div>
                                        <div className="modal-body">
                                          <div className="help-list-item"></div>
                                          <label><kbd>ENTER</kbd></label>
                                          <span>Insert Paragraph</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+Z</kbd></label>
                                          <span>Undoes the last command</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+Y</kbd></label>
                                          <span>Redoes the last command</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>TAB</kbd></label>
                                          <span>Tab</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>SHIFT+TAB</kbd></label>
                                          <span>Untab</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+B</kbd></label>
                                          <span>Set a bold style</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+I</kbd></label>
                                          <span>Set a italic style</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+U</kbd></label>
                                          <span>Set a underline style</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+S</kbd></label>
                                          <span>Set a strikethrough style</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+BACKSLASH</kbd></label>
                                          <span>Clean a style</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+L</kbd></label>
                                          <span>Set left align</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+E</kbd></label>
                                          <span>Set center align</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+R</kbd></label>
                                          <span>Set right align</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+J</kbd></label>
                                          <span>Set full align</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+NUM7</kbd></label>
                                          <span>Toggle unordered list</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+SHIFT+NUM8</kbd></label>
                                          <span>Toggle ordered list</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+LEFTBRACKET</kbd></label>
                                          <span>Outdent on current paragraph</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+RIGHTBRACKET</kbd></label>
                                          <span>Indent on current paragraph</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM0</kbd></label>
                                          <span>
                                            Change current blocks format as a paragraph(P tag)
                                          </span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM1</kbd></label>
                                          <span>Change current blocks format as H1</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM2</kbd></label>
                                          <span>Change current blocks format as H2</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM3</kbd></label>
                                          <span>Change current blocks format as H3</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM4</kbd></label>
                                          <span>Change current blocks format as H4</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM5</kbd></label>
                                          <span>Change current blocks format as H5</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+NUM6</kbd></label>
                                          <span>Change current blocks format as H6</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+ENTER</kbd></label>
                                          <span>Insert horizontal rule</span>
                                          <div className="help-list-item"></div>
                                          <label><kbd>CTRL+K</kbd></label>
                                          <span>Show Link Dialog</span>
                                        </div>
                                        <div className="modal-footer">
                                          <p className="text-center"></p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row margin-top-20">
                              <div className="col-xs-12 col-sm-6 col-md-6 my-center-block">
                                <label className="control-label">Recipients:</label>
                                <input
                                  type="email" className="form-control" id="recipients"
                                  size="80"
                                  title="Comma separated email addresses."
                                  placeholder="Comma separated email addresses." multiple=""
                                />
                              </div>
                            </div>
                            <div className="row margin-top-35">
                              <div className="col-xs-7 col-md-6 col-lg-4 my-center-block">
                                <div className="row">
                                  <div className="col-xs-6">
                                    <input
                                      type="submit"
                                      className="btn btn-lg btn-block js-update-referral-status"
                                      value="Submit"
                                    />
                                  </div>
                                  <div className="col-xs-6">
                                    <input
                                      type="button"
                                      className="btn btn-block js-close-referral-status-modal"
                                      value="Cancel"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="modal-footer"></div>
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
