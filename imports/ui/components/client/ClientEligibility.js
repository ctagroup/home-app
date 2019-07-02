import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useGlobalStore } from '/imports/ui/components/store';

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
  const [removalDate, setDate] = useState(new Date());
  const [removalReason, setReason] = useState(reasons[0].id);
  const [removalRemarks, setRemarks] = useState('');
  const [, actions] = useGlobalStore();

  const eligibleClient = props.eligibleClient || {};
  if (!eligibleClient || eligibleClient.error) return null;
  const { dedupClientId } = eligibleClient;

  const addToActiveList = () => {
    actions.addToActiveList({
      dedupClientId,
      removalDate,
      removalReason,
      removalRemarks,
    });
  };

  const removeFromActiveList = () => {
    actions.removeFromActiveList({
      dedupClientId,
      removalDate,
      removalReason,
      removalRemarks,
    });
  };

  function renderEligibilityStatus() {
    if (!eligibleClient.ignoreMatchProcess) return null;
    return (
      <div className="form-group">
        <h3>Matching Eligibility Status</h3>
        <p><strong>Removal notes: </strong>{eligibleClient.remarks}</p>
      </div>
    );
  }

  function renderAddToActiveListForm() {
    return (
      <div>
        <p><strong>Add to active list</strong></p>
        <input
          className="btn btn-warning"
          value="Add client to active list"
          type="button"
          onClick={addToActiveList}
        />
      </div>
    );
  }

  function renderRemoveFromActiveListForm() {
    return (
      <div>
        <p><strong>Remove from active list</strong></p>
        <label>Removal date: </label>
        <DatePicker
          selected={removalDate}
          defaultValue={removalDate}
          onChange={setDate}
          placeholderText="MM/DD/YYYY"
        />
        <div className="form-group">
          <label htmlFor="removalReason">Choose a reason to delete: </label>
          <select
            className="form-control"
            value={removalReason || ''}
            onChange={(e) => setReason(e.target.value)}
          >
            {reasonsList.map(({ id, text }) =>
              (<option
                value={id}
                key={`option-${id}`}
              >{text}</option>))}
          </select>
        </div>
        {reasonsHash[removalReason] && reasonsHash[removalReason].required &&
          <div className="form-group">
            <label htmlFor="removalRemarks"> Additional notes </label>
            <input
              className="form-control"
              type="text"
              name="removalRemarks"
              placeholder="Removal notes"
              value={removalRemarks || ''}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        }
        <input
          className="btn btn-danger"
          value="Remove client from active list"
          type="button"
          onClick={removeFromActiveList}
        />
      </div>
    );
  }


  return (
    <div className="info-container">
      <div className="row">
        <div className="col-xs-12">
        {renderEligibilityStatus()}
        {eligibleClient.ignoreMatchProcess ?
          renderAddToActiveListForm() : renderRemoveFromActiveListForm()
        }
        </div>
      </div>
    </div>
  );
}

export default ClientEligibility;
