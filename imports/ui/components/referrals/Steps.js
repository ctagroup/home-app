import React, { useState } from 'react';

import StepPicker from './StepPicker';
import StepContainer from './StepContainer';


import config from './config';
const currentStepId = 2;
const matchId = 2;


const StepProgress = ({ stepNumber, steps }) => (
  <div className="progress">
    <div
      className="progress-bar progress-bar-primary progress-bar-striped active"
      role="progressbar"
      aria-valuenow="1"
      aria-valuemin="1"
      style={{ width: `${100 * stepNumber / steps}%` }}
    >
      {stepNumber} / {steps}
    </div>
  </div>
);

const ReferralSteps = (props) => {
  console.log('ActiveSteps props', props);

  const [selectedStepId, selectStep] = useState(currentStepId);

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
    <div id="referral-timeline" className="col-xs-9 my-center-block">
      <div className="navigation">
        <StepPicker
          selectStep={selectStep}
          steps={config.steps}
          selectedStepId={selectedStepId}
          currentStepId={currentStepId}
          matchId={matchId}
          futureStepObj={futureStepObj}
        />
        <StepProgress steps={stepsNumbers.length} stepNumber={passedSteps} />
      </div>
      <StepContainer
        config={config}
        currentStepId={currentStepId}
        selectStep={selectStep}
        selectedStepId={selectedStepId}
        matchId={matchId}
      />
    </div>
  );
};

// ActiveSteps.propTypes = {

// };


export default ReferralSteps;
