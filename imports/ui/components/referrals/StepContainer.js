import React, { useState } from 'react';

import ClientMatchNotes from '/imports/ui/components/client/ClientMatchNotes';

const ReferralStepContainer = (props) => {
  const [selectedOption, selectOption] = useState(false);
  const goToNextStep = () => null;
  const endReferral = () => null;

  const { matchId, config, currentStepId, selectedStepId, selectStep } = props;
  const flattenSteps = (steps, out = {}, parentId = false) => steps.reduce((acc, step) => {
    const extendedStep = parentId && { ...step, parentId } || step;
    // eslint-disable-next-line no-param-reassign
    acc[step.id] = extendedStep;
    // eslint-disable-next-line no-param-reassign
    if (step.steps && step.steps.length) acc = flattenSteps(step.steps, acc, step.id);
    return acc;
  }, out);
  const flattenedSteps = flattenSteps(config.steps);
  const selectedStep = flattenedSteps[selectedStepId];
  const stepIncomplete = selectedStep.options && selectedStep.options.length && !selectedOption;
  const canSkip = selectedStep.skip || false;
  const canEnd = selectStep.end || false;
  // console.log('flatten', flattenedSteps, Object.keys(flattenedSteps));

  // config currentStep selectedStepId
  // const { title, notes, skip, steps } = props;
  // const renderStepsList = () => {

  // };

  const renderOptions = ({ options }) => {
    if (options.length < 4) {
      // radiobutton group
      return (
        <div>
          <h5>Step outcome:</h5>
          <div className="btn-group" role="group" aria-label="Basic example">
            {options.map((option) => (
              <button
                type="button"
                className={`btn ${selectedOption === option && 'btn-primary' || 'btn-secondary'}`}
                onClick={() => selectOption(option)}
              >{option}</button>
            ))}
          </div>
        </div>
      );
    }
    return null; // select dropdown
  };

  return (
    <div>
      <h4>{selectedStep.title}</h4>
      <ClientMatchNotes matchId={matchId} step={selectedStepId} />

      {selectedStep.options && selectedStep.options.length && renderOptions(selectedStep)}
      <div style={{ padding: '20px 0' }}>
        {currentStepId === selectedStepId && canSkip && (
          <button className="btn btn-default">Skip this step</button>
        )}
        {currentStepId === selectedStepId ? (
          <button
            className="btn btn-primary"
            disabled={stepIncomplete}
            onClick={goToNextStep}
          >Go to next step</button>
        ) : (
          <button className="btn btn-primary" onClick={() => selectStep(currentStepId)}>
            Go to current step
          </button>
        )}
        {canEnd && (
          <button className="btn btn-primary" onClick={endReferral}>
            End referral
          </button>
        )}
      </div>
    </div>
  );
};

export default ReferralStepContainer;
