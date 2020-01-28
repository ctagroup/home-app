import React, { useState, useEffect } from 'react';

import DatePicker from 'react-datepicker';

import PastReferralsList from '/imports/ui/components/referrals/PastReferralsList';

function isMatchCompleted(match) {
  // for now lets assume that completed match has end date set
  return !!match.endDate;
}

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
  const { client: { dedupClientId } } = props;
  const [removalDate, changeDate] = useState(new Date());
  const [removalRemarks, changeRemarks] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [removalReason, changeReason] = useState(reasons[0].id);
  // const [lastDataFetch, setLastDataFetch] = useState(new Date());
  const [clientMatches, setClientMatches] = useState([]);

  // function updateClientMatches() {
  //   setLastDataFetch(new Date());
  // }
  let { eligibleClient } = props;
  const { helpers: { removeFromActiveList } } = props;
  if (!eligibleClient) eligibleClient = {};

  const addToActiveList = () => ({ removalDate, removalReason, removalRemarks });
    // console.log('implement this function (addToActiveList)',
    //   { removalDate, removalReason, removalRemarks });
  const removeFromActiveListHandler = () => {
    removeFromActiveList(reasonsHash[removalReason], removalDate, removalRemarks);
  };

  useEffect(() => {
    if (loaded) return;
    Meteor.call('matchApi', 'getClientMatches', dedupClientId, (err, res) => {
      if (err) {
        setClientMatches([]);
        console.error('Failed to load client matches', err);
      } else {
        setClientMatches(res);
        // console.log('new data', res);
      }
      setLoaded(true);
    });
  }, [loaded]);
  // , [lastDataFetch]);

  // console.log('eligibleClient', eligibleClient);
  if (eligibleClient && eligibleClient.error) return null;
  // return (<div className="row margin-top-35">{client.id}</div>);

  const pastReferrals = clientMatches.filter(isMatchCompleted);
  return (
    <div className="row margin-top-35">
      <div className="col-xs-12">
        {eligibleClient.ignoreMatchProcess &&
          <div className="form-group">
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
                defaultValue={removalReason}
              >
                {/** selected={id === removalReason} */}
                {reasonsList.map(({ id, text }) =>
                  (<option
                    value={id}
                    key={`option-${id}`}
                  >{text}</option>))}
              </select>
            </div>
            {/** {#if showRemovalDetails} */}
            {/* if details required for selected option: */}
            {/* {reasonsHash[removalReason] && reasonsHash[removalReason].required && */}
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
            </div>
            {/* } */}
            <input
              className="btn btn-danger removeFromHousingList"
              value="Remove client from active list"
              type="button"
              onClick={removeFromActiveListHandler}
            />
          </div>
        }
        <h3>Past Referrals</h3>
        <PastReferralsList referrals={pastReferrals} />

      </div>
    </div>
  );
}

export default ClientEligibility;
