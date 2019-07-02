export const getRace = (code, definition) => {
  switch (code) {
    case 1: return 'American Indian or Alaska Native';
    case 2: return 'Asian';
    case 3: return 'Black or African American';
    case 4: return 'Native Hawaiian or Other Pacific Islander';
    case 5: return 'White';
    default: return definition;
  }
};

export const getGender = (code, definition) => {
  switch (code) {
    case 0: return 'Female';
    case 1: return 'Male';
    case 2: return 'Transgender male to female';
    case 3: return 'Transgender female to male';
    case 4: return 'Other';
    default: return definition;
  }
};

export const getEthnicity = (code, definition) => {
  switch (code) {
    case 0: return 'Non-Hispanic/Non-Latino';
    case 1: return 'Hispanic/Latino';
    default: return definition;
  }
};

export const getYesNo = (code, definition) => {
  switch (code) {
    case 0: return 'No';
    case 1: return 'Yes';
    default: return definition;
  }
};

export function getText(text, code) {
  const defaultValue = code === undefined ? '?' : code;
  const intCode = parseInt(code, 10);
  switch (text) {
    case 'race': return getRace(intCode, defaultValue);
    case 'ethnicity': return getEthnicity(intCode, defaultValue);
    case 'gender': return getGender(intCode, defaultValue);
    case 'veteranStatus':
    case 'disablingcondition': return getYesNo(intCode, defaultValue);
    default: return defaultValue;
  }
}

