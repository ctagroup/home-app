export const getRace = (code, definition) => {
  switch (code) {
    case 1:
    case '1': return 'American Indian or Alaska Native';
    case 2:
    case '2': return 'Asian';
    case 3:
    case '3': return 'Black or African American';
    case 4:
    case '4': return 'Native Hawaiian or Other Pacific Islander';
    case 5:
    case '5': return 'White';
    default: return definition;
  }
};

export const getGender = (code, definition) => {
  switch (code) {
    case 0:
    case '0': return 'Female';
    case 1:
    case '1': return 'Male';
    case 2:
    case '2': return 'Transgender male to female';
    case 3:
    case '3': return 'Transgender female to male';
    case 4:
    case '4': return 'Other';
    default: return definition;
  }
};

export const getEthnicity = (code, definition) => {
  switch (code) {
    case 0:
    case '0': return 'Non-Hispanic/Non-Latino';
    case 1:
    case '1': return 'Hispanic/Latino';
    default: return definition;
  }
};

export const getYesNo = (code, definition) => {
  switch (code) {
    case 0:
    case '0': return 'No';
    case 1:
    case '1': return 'Yes';
    default: return definition;
  }
};
