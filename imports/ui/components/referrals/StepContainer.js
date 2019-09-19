import React, { useState } from 'react';
import Alert from '/imports/ui/alert';
import ClientMatchFiles from '/imports/ui/components/client/ClientMatchFiles';

const StepContainer = ({ dedupClientId, matchId, config, currentStepId,
  selectedStepId, selectStep, handleDataReload, permissions }) => {
  const [selectedOption, selectOption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getNextStep = (stepId) => {
    const stepIndex = config.steps.findIndex((step) => step.id === stepId);
    if (stepIndex === config.steps.length) return stepId;
    return config.steps[stepIndex + 1].id;
  };

  const goToNextStep = (outcome) => {
    setIsSubmitting(true);
    Meteor.call('matching.addMatchHistory', matchId, currentStepId, outcome || 'step completed',
      (err) => {
        setIsSubmitting(false);
        if (err) {
          Alert.error(err);
        } else {
          Alert.success('Updated history for current match');
          handleDataReload();
          selectStep(getNextStep(currentStepId));
        }
      });
  };
  const endReferral = (outcome) => {
    setIsSubmitting(true);
    Meteor.call('matching.endMatch', matchId, currentStepId, outcome || 'match completed',
      (err) => {
        setIsSubmitting(false);
        if (err) {
          Alert.error(err);
        } else {
          Alert.success('Client match ended');
          handleDataReload();
        }
      });
  };

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
  const canEnd = selectedStep.end || false;
  const canMoveToNextStep = !selectedStep.lastStep;

  const renderOptions = ({ options }) => {
    if (options.length < 4) {
      // radiobutton group
      return (
        <div>
          <h5>Step outcome:</h5>
          <div className="btn-group" role="group" aria-label="Basic example">
            {options.map((option, i) => (
              <button
                key={i}
                type="button"
                disabled={!permissions.canUpdateReferrals}
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
      <div className="row">
        <div className="col-md-6">
          {selectedStep.options && selectedStep.options.length && renderOptions(selectedStep)}
          <div style={{ padding: '20px 0' }}>
            {currentStepId === selectedStepId && canSkip && (
              <button
                className="btn btn-default"
                onClick={() => goToNextStep('skipped')}
                disabled={isSubmitting}
              >Skip this step</button>
            )}
            {currentStepId === selectedStepId ? (
              canMoveToNextStep && <button
                className="btn btn-primary"
                disabled={stepIncomplete || isSubmitting || !permissions.canUpdateReferrals}
                onClick={() => goToNextStep(selectedOption)}
              >Go to next step</button>
            ) : (
              <button className="btn btn-default" onClick={() => selectStep(currentStepId)}>
                Go to current step
              </button>
            )}
            {canEnd && (
              <button
                className="btn btn-primary"
                onClick={() => endReferral(selectedOption)}
                disabled={stepIncomplete || isSubmitting || !permissions.canUpdateReferrals}
              >
                End referral
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        {selectedStep.files &&
          <div className="col-md-6">
            <ClientMatchFiles
              dedupClientId={dedupClientId}
              matchId={matchId}
              step={selectedStepId}
              files={selectedStep.files}
              permissions={permissions}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default StepContainer;
