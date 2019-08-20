/* eslint-disable eqeqeq */
import React from 'react';
import PropTypes from 'prop-types';

const ReferralStepPicker = (props) => {
  const { selectStep, steps, isSubstep, selectedStepId, currentStepId, futureStepObj } = props;

  const substep = isSubstep && 'substep-btn' || '';
  return (
    <span>
      {steps.map((step) => {
        const futureStep = futureStepObj.data[step.id];
        return (
          <span className="css-tooltip-button-span">
            <a
              disabled={futureStep}
              className={
                `btn btn-primary btn-default btn-sm btn-arrow-right ${substep} ${
                  selectedStepId === step.id && 'btn-active' || ''} ${
                  currentStepId == step.id && 'btn-outlined' || ''
                }`}
              onClick={() => !futureStep && selectStep(step.id)}
            >
              {step.title}
            </a>
            <ReferralStepPicker
              key={`step-${step.id}`}
              futureStepObj={futureStepObj}
              selectedStepId={selectedStepId}
              selectStep={selectStep}
              steps={(step.steps || [])}
              isSubstep
            />
          </span>
        );
      }
      )}
    </span>
  );
};
ReferralStepPicker.propTypes = {
  selectStep: PropTypes.func,
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    title: PropTypes.string,
  })),
  isSubstep: PropTypes.oneOfType([
    PropTypes.boolean,
    PropTypes.string,
  ]),
  selectedStepId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
ReferralStepPicker.defaultProps = {
  isSubstep: false,
};

export default ReferralStepPicker;
