import { getRace, getGender, getEthnicity, getYesNo } from
'../../../imports/ui/clients/textHelpers.js';

export const getText = (text, code) => {
    const definition = code === undefined ? '?' : code;
    const intCode = parseInt(code, 10);
    switch (text) {
      case 'race': return getRace(intCode, definition);
      case 'ethnicity': return getEthnicity(intCode, definition);
      case 'gender': return getGender(intCode, definition);
      case 'veteranStatus':
      case 'disablingcondition': return getYesNo(intCode, definition);
      default: return definition;
    }
  }
