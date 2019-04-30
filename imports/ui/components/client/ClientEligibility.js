import React, { useState } from 'react';

import DatePicker from 'react-datepicker';

const reasons = [
  { required: true, text: 'Housed by CARS (include agency/program)' },
  { required: false, text: 'Housed externally' },
  { required: false, text: 'Unreachable' },
  { required: false, text: 'Insufficient contact information' },
  { required: false, text: 'Client maxed out referral offers' },
  { required: false, text: 'Client no longer interested in services' },
  { required: true, text: 'Other (specify)' },
].map(({ text, required }) => ({
  id: text.replace(/\s+/g, '_').toLowerCase(),
  text,
  required,
}));

const reasonsHash = reasons.reduce((acc, reason) => ({ ...acc, [reason.id]: reason }), {});
const reasonsList = reasons;

function ClientEligibility(props) {
  const [removalDate, changeDate] = useState(new Date());
  const [removalRemarks, changeRemarks] = useState('');
  const [removalReason, changeReason] = useState('');

  let { eligibleClient } = props;
  const { helpers: { removeFromActiveList } } = props;
  if (!eligibleClient) eligibleClient = {};

  const addToActiveList = () => ({ removalDate, removalReason, removalRemarks });
    // console.log('implement this function (addToActiveList)',
    //   { removalDate, removalReason, removalRemarks });
  const removeFromActiveListHandler = () => {
    removeFromActiveList(reasonsHash[removalReason], removalDate, removalRemarks);
  };

  // console.log('eligibleClient', eligibleClient);
  if (eligibleClient && eligibleClient.error) return null;
  // return (<div className="row margin-top-35">{client.id}</div>);
  return (
    <div className="row margin-top-35">
      <div className="col-xs-12">
        {eligibleClient.ignoreMatchProcess &&
          <div className="form-group">
            <h3>Matching Eligibility Status</h3>
            <p><strong>Removal notes: </strong>{eligibleClient.remarks}</p>
          </div>
        }
        {eligibleClient.ignoreMatchProcess &&
          <input
            className="btn btn-warning addToHousingList"
            value="Add client to active list"
            type="button"
            onClick={addToActiveList}
          />
        }
        {!eligibleClient.ignoreMatchProcess &&
          <div>
            <DatePicker
              selected={removalDate}
              onChange={changeDate}
              placeholderText="MM/DD/YYYY"
            />
            <div className="form-group">
              <label htmlFor="removalReason">Choose a reason to delete: </label>
              <select
                className="removalReason form-control"
                name="removalReason"
                id="removalReason"
                onChange={(e) => changeReason(e.target.value)}
              >
                {reasonsList.map(({ id, text }) =>
                  (<option
                    value={id} selected={id === removalReason} key={`option-${id}`}
                  >{text}</option>))}
              </select>
            </div>
            {/** {#if showRemovalDetails} */}
            {/* if details required for selected option: */}
            {reasonsHash[removalReason] && reasonsHash[removalReason].required &&
              <div className="form-group">
                <label htmlFor="removalRemarks"> Additional notes </label>
                <input
                  id="removalRemarks"
                  className="form-control"
                  type="text"
                  name="removalRemarks"
                  placeholder="Removal notes"
                  onChange={(e) => changeRemarks(e.target.value)}
                />
              </div>}
            <input
              className="btn btn-danger removeFromHousingList"
              value="Remove client from active list"
              type="button"
              onClick={removeFromActiveListHandler}
            />
          </div>
        }
      </div>
    </div>
  );
}

export default ClientEligibility;
