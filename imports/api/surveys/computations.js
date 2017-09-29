function castType(v) {
  const result = parseFloat(v);
  if (!isNaN(result)) {
    return result;
  }
  return v;
}

export function getValueByPath(obj, str) {
  // see also: https://lodash.com/docs/4.17.4#get
  try {
    return str.split('.').reduce((o, i) => o[i], obj);
  } catch (e) {
    return undefined;
  }
}

export function applyReducers(value, args = []) {
  let result = value;
  while (args.length > 0) {
    const reducer = args.shift();
    switch (reducer) {
      case 'min':
        result = Math.min(result);
        break;
      default:
        console.warn('Unknown reducer', reducer);
        break;
    }
  }
  return result;
}

export function evaluateCondition(operator, operand1, operand2) {
  const value1 = castType(operand1);
  const value2 = castType(operand2);
  switch (operator) {
    case '==':
      return value1 == value2; // eslint-disable-line eqeqeq
    case '!=':
      return value1 != value2; // eslint-disable-line eqeqeq
    case '<':
      return value1 < value2;
    case '>':
      return value1 > value2;
    case '<=':
      return value1 <= value2;
    case '>=':
      return value1 >= value2;
    default:
      console.warn('Unknown operator', operator);
      return undefined;
  }
}

export function evaluateOperand(operand, formState = {}) {
  let args;
  if (typeof(operand.split) === 'function') {
    args = operand.split(':');
  } else {
    args = [operand];
  }

  const value = getValueByPath(formState, args.shift());
  if (value !== undefined) {
    return applyReducers(castType(value), args);
  }
  return applyReducers(castType(operand), args);
}

export function evaluateRule(rule = {}, formState) {
  if (rule.always) {
    return rule.always;
  } else if (rule.any && rule.any.length > 0) {
    for (let i = 0; i < rule.any.length; i++) {
      const operator = rule.any[i][0];
      const operand1 = evaluateOperand(rule.any[i][1], formState);
      const operand2 = evaluateOperand(rule.any[i][2], formState);
      if (evaluateCondition(operator, operand1, operand2) === true) {
        return rule.then;
      }
    }
  } else if (rule.all && rule.all.length > 0) {
    for (let i = 0; i < rule.all.length; i++) {
      let result = true;
      const operator = rule.all[i][0];
      const operand1 = evaluateOperand(rule.all[i][1], formState);
      const operand2 = evaluateOperand(rule.all[i][2], formState);
      if (evaluateCondition(operator, operand1, operand2) === false) {
        result = false;
        break;
      }
      if (result) {
        return rule.then;
      }
    }
  }
  return false;
}


function evaluateRules(rules = [], formState) {
  let allResults = [];
  for (let i = 0; i < rules.length; i++) {
    const results = evaluateRule(rules[i], formState);
    // console.log('r', i, results);
    if (results) {
      allResults = allResults.concat(results);
    }
  }
  // console.log('r-all', allResults);
  return allResults;
}

export function applyResults(results, formState, currentId) {
  results.forEach((result) => {
    let args;
    if (typeof(result) === 'string') {
      args = [result];
    } else {
      args = result.slice(0);
    }
    const action = args.shift();
    let current;
    let value;
    switch (action) {
      case 'show':
        Object.assign(formState.props, { [`${currentId}.hidden`]: false });
        break;
      case 'hide':
        Object.assign(formState.props, { [`${currentId}.hidden`]: true });
        break;
      case 'set':
        value = evaluateOperand(args[1], formState);
        Object.assign(formState.variables, { [args[0]]: value });
        break;
      case 'add':
        current = formState.variables[args[0]] || 0;
        value = evaluateOperand(args[1], formState);
        Object.assign(formState.variables, { [args[0]]: current + value });
        break;
      default:
        console.warn(`unknown action in ${currentId}`, action, args);
        break;
    }
  });
  return formState;
}

function computeItemState(currentItem, formState) {
  const newState = Object.assign({}, formState);
  const items = currentItem.items || [];
  items.forEach((item) => {
    Object.assign(newState, computeItemState(item, newState));
  });
  const results = evaluateRules(currentItem.rules, newState);
  return applyResults(results, newState, currentItem.id);
}


export function computeFormState(definition, values, props, otherData) {
  const formState = Object.assign({
    variables: Object.assign({}, definition.variables),
    values,
    props,
  }, otherData);
  return computeItemState(definition, formState);
}
