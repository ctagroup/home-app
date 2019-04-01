import React from 'react';
export default class ClientProfile extends React.Component {
  render() {
    return (
      <div className="tab-pane fade show" id="panel-services" role="tabpanel">
        <div className="row margin-top-35">
          <div className="col-xs-12">
            <h3>Add Services</h3>
            <form className="form-horizontal" role="form">
              <div className="form-group row">
                <div className="col-md-2">
                  <label>select Project</label>
                  <select
                    name="className" className="service_project form-control" id="service_project"
                  >
                    <option value="">Select Project</option>
                    <option value="9e7cf401-6daf-415e-a4bd-67deda221803">New project 2018b
                    </option>
                    <option value="243ec5bd-e781-4478-88ed-0549f85c048c">TEST v2017 10092018
                    </option>
                    <option value="43262c8c-39ac-4224-8679-e9858451831b">test v2017</option>
                    <option value="00dacc25-8ce2-4895-854b-e484ae77c27a">Emergency Shelter
                    Enrollment TEST</option>
                    <option value="0fd731b3-cb8e-422f-a11c-a376fc1af9d0">Transitional Housing
                    Enrollment TEST</option>
                    <option value="5c6ce2c6-14c4-4558-8918-462fc196e0e2">Provider A</option>
                    <option value="7f640d01-db92-4d43-9475-12aabfae9d00">Provider B</option>
                    <option value="b1609549-9421-4164-abec-d02535684ed9">Provider C</option>
                    <option value="5fb98754-7546-42da-9bbc-1078aa763f28">Provider D</option>
                    <option value="038195b9-da65-44a1-b42b-102217a398b0">Provider E</option>
                    <option value="0fd07a45-23a2-4366-82a8-01f48e718396">HOME Demo</option>
                    <option value="398b3646-3468-400c-9dac-36dfda193847">HEALing Communities
                    Health Center</option>
                    <option value="4dbaabac-bf4f-4988-bb14-7e659bb7978c">Chris180 at Promise
                    Center</option>
                    <option value="6f35ea09-50cf-4cfc-a973-8222384bb09d">My Sisters House</option>
                    <option value="7df76b4a-b3dd-42b9-9069-859f3e8ccbe4">ProjectName_1459515376900
                    </option>
                    <option value="1b90b45f-3cfa-45a4-b775-a32bcfd56fd3">ProjectName_1459515376900
                    </option>
                    <option value="17bc369f-c9be-4ec5-8471-0c55ade8efc7">test project</option>
                    <option value="1ec1fb47-6122-4f61-a596-bf7e1f75f921">ProjectName_1459515376900
                    </option>
                    <option value="558e05a6-6cd4-4ed6-8b59-b911c360d1a3">ProjectName_1459515376900
                    </option>
                    <option value="486f72c0-26a2-404f-885e-de60c6e1b0fb">test project</option>
                    <option value="db8c7696-a063-48cc-9227-3f3df3ee3c04">ProjectName_1459515376900
                    </option>
                    <option value="066c95d3-c97c-40b9-b8c1-bf12cafdfca4">ProjectName_1459515376900
                    </option>
                    <option value="d46f8b44-3a4a-4266-8de8-eae2ed0c1563">ProjectName_1459515376900
                    </option>
                    <option value="53da6103-0155-4ebf-8452-13efe5d48209">ProjectName_1459515376900
                    </option>
                    <option value="84807d4a-a1f8-4816-9010-7590e147d6d7">ProjectName_1459515376900
                    </option>
                    <option value="53b8c2d7-e17f-4444-a720-24770ea6b3a6">ProjectName_1459515376900
                    </option>
                    <option value="9f29f656-6307-43da-93c6-256906aa5ae0">ProjectName_1459515376900
                    </option>
                    <option value="e8d4365a-34f1-49f5-8f86-e6ec3a415a1d">test_1234</option>
                    <option value="8f2b38f9-fb2b-46d6-a850-4586bd20ff86">HUD project 1</option>
                    <option value="40b8ee8d-402b-483e-b8cf-007925cb2559">HUD project 1</option>
                    <option value="f324bd14-7d2b-4c74-95b6-cb4d456ad2f5">HUD project 1</option>
                    <option value="b8adfc49-078e-40ec-a130-cb705c99d65b">New project 2018</option>
                    <option value="b7c34c34-c848-46d4-9cf4-620c005c4922">test 2017</option>
                    <option value="ad25d6ab-7bb5-4304-bb93-0d345f625557">RRH 2</option>
                    <option value="eee67008-fab2-4255-9b35-6847182d0187">example1</option>
                    <option value="e6acee72-1942-41e9-8cd2-72f1bb24c615">ProjectName_1459515376900
                    </option>
                    <option value="9eea0641-65a3-4158-a4a2-06c21717daa0">ProjectName_1459515376900
                    </option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label>select Service</label>
                  <select name="className" className="service_type form-control" id="service_type">
                    <option value="">Select Service</option>
                    <option value="Basic Needs">Basic Needs</option>
                    <option value="Case Management">Case Management</option>
                    <option value="Diversion">Diversion</option>
                    <option value="Employment">Employment</option>
                    <option value="Financial Assistance">Financial Assistance</option>
                    <option value="Housing Vouchers">Housing/Vouchers</option>
                    <option value="Mailboxes">Mailboxes</option>
                    <option value="Transportation">Transportation</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label>Service Date</label>
                  <div className="input-group js-datepicker">
                    <span className="input-group-addon">
                      <i className="fa fa-calendar"></i>
                    </span>
                    <input
                      id="serviceDate" className="serviceDate form-control" type="text"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <label>Service Qty</label>
                  <div className="input-group">
                    <input id="serviceQty" className="serviceQty form-control" type="text" />
                  </div>
                </div>
                <div className="col-md-2">
                  <label>Cost Currency</label>
                  <div className="input-group">
                    <input
                      id="servicecostcurrency" className="servicecostcurrency form-control"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="row form-group">
                <div className="col-md-10">
                  <label>Description</label>
                  <div className="input-group">
                    <textarea className="serviceDescription form-control"></textarea>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="submit" value="Add service" id="service_submit"
                    className="btn btn-primary service_submit"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="row margin-top-35">
        </div>
      </div>
		);
  }
}
