export function castType(v) {
  if (Array.isArray(v)) {
    return v;
  }
  const result = parseFloat(v);
  if (!isNaN(result)) {
    return result;
  }

  if (typeof(v) === 'string') {
    if (v.startsWith('variables.') || v.startsWith('values.') || v.startsWith('props.')) {
      return undefined;
    }
  }
  return v;
}

export function getValueByPath(obj, str) {
  // see also: https://lodash.com/docs/4.17.4#get
  try {
    let parts = [];
    const result = str.split('.').reduce((o, i) => {
      parts.push(i);
      const key = parts.join('.');
      if (o[key] !== undefined) {
        parts = [];
        return o[key];
      }
      return o;
    }, obj);
    return parts.length === 0 ? result : str;
  } catch (e) {
    return undefined;
  }
}

export function applyReducers(value, args = []) {
  let result = value;
  let arr;
  while (args.length > 0) {
    const reducer = args.shift();
    switch (reducer) {
      case 'min':
        arr = Array.isArray(value) ? value : [value];
        arr = arr.filter(x => !isNaN(parseFloat(x)))
          .map(x => parseFloat(x));
        result = Math.min(...arr);
        if (isNaN(result) || arr.length === 0) {
          result = undefined;
        }
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
    case 'isset':
      return !!value1;
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
      console.log('>=', value1, value2);
      return value1 >= value2;
    default:
      console.warn('Unknown operator', operator);
      return undefined;
  }
}

export function evaluateOperand(operand, formState = {}) {
  let args;
  if (typeof(operand) === 'string') {
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

export function evaluateRule(rule, formState) {
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
    let result = true;
    for (let i = 0; i < rule.all.length; i++) {
      const operator = rule.all[i][0];
      const operand1 = evaluateOperand(rule.all[i][1], formState);
      const operand2 = evaluateOperand(rule.all[i][2], formState);
      if (evaluateCondition(operator, operand1, operand2) === false) {
        result = false;
        break;
      }
    }
    if (result) {
      return rule.then;
    }
  }
  return false;
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
    let rows;
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
        if (typeof(value) !== 'number') {
          break;
        }
        Object.assign(formState.variables, { [args[0]]: current + value });
        break;
      case 'rows':
        rows = parseInt(evaluateOperand(args[0], formState), 10);
        Object.assign(formState.props, { [`${currentId}.rows`]: isNaN(rows) ? undefined : rows });
        break;
      default:
        console.warn(`unknown action in ${currentId}`, action, args);
        break;
    }
  });
  return formState;
}

export function evaluateRules(currentItem = {}, formState) {
  return (currentItem.rules || []).reduce((state, rule) => {
    const results = evaluateRule(rule, state);
    if (results) {
      console.log('rule fired', currentItem.id, rule, '', results);
      return applyResults(results, state, currentItem.id);
    }
    return state;
  }, formState);
}

function computeItemState(currentItem, formState) {
  const newState = Object.assign({}, formState);
  const items = currentItem.items || [];
  items.forEach((item) => {
    Object.assign(newState, computeItemState(item, newState));
  });
  return evaluateRules(currentItem, newState);
}

export function computeFormState(definition, values, props, otherData) {
  console.log('computing form state');
  const formState = Object.assign({
    variables: Object.assign({}, definition.variables),
    values,
    props,
  }, otherData);
  return computeItemState(definition, formState);
}
