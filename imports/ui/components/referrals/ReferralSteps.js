import React, { useState, useEffect } from 'react';
import ReferralNotes from '/imports/ui/components/referrals/ReferralNotes';
import StepPicker from './StepPicker';
import StepContainer from './StepContainer';
import config from './config';


const StepProgress = ({ stepNumber, steps }) => (
  <div className="progress">
    <div
      className="progress-bar progress-bar-primary progress-bar-striped active"
      role="progressbar"
      style={{ width: `${100 * stepNumber / steps}%` }}
    >
      {stepNumber} / {steps}
    </div>
  </div>
);

const ReferralSteps = ({ dedupClientId, lastStepId, referral, handleDataReload, permissions }) => {
  const lastStepIndex = config.steps.findIndex(step => step.id == lastStepId); // eslint-disable-line eqeqeq, max-len
  let currentStepId;
  try {
    currentStepId = config.steps[lastStepIndex + 1].id;
  } catch (err) {
    currentStepId = config.steps[0].id;
  }

  const [selectedStepId, selectStep] = useState(currentStepId);

  useEffect(() => {
    if (lastStepId === currentStepId) selectStep(currentStepId);
  });

  const getFutureSteps = (allSteps, out) =>
    allSteps.reduce(({ isFuture, data }, step) => {
      const justSet = currentStepId == step.id; // eslint-disable-line eqeqeq
      const stepData = { isFuture: isFuture || justSet, data: { ...data, [step.id]: isFuture } };
      if (step.steps && step.steps.length) {
        return getFutureSteps(step.steps, stepData);
      }
      return stepData;
    }, out);

  const futureStepObj = getFutureSteps(config.steps, { isFuture: false, data: {} });

  const stepsNumbers = Object.keys(futureStepObj.data);
  const passedSteps = stepsNumbers.filter(step => !futureStepObj.data[step]).length;

  return (
    <React.Fragment>
      <div id="referral-timeline" className="col-xs-9 my-center-block">
        <div className="navigation">
          <StepPicker
            selectStep={selectStep}
            steps={config.steps}
            selectedStepId={selectedStepId}
            currentStepId={currentStepId}
            matchId={referral.id}
            futureStepObj={futureStepObj}
          />
          <StepProgress steps={stepsNumbers.length} stepNumber={passedSteps} />
        </div>
        <StepContainer
          dedupClientId={dedupClientId}
          config={config}
          currentStepId={currentStepId}
          selectStep={selectStep}
          selectedStepId={selectedStepId}
          matchId={referral.id}
          handleDataReload={handleDataReload}
          permissions={permissions}
        />
      </div>
      <ReferralNotes
        dedupClientId={dedupClientId}
        matchId={referral.id}
        step={selectedStepId}
        notes={referral.notes}
        config={config}
        handleDataReload={handleDataReload}
        permissions={permissions}
      />
    </React.Fragment>
  );
};

export default ReferralSteps;
