import moment from 'moment';

let firedRules = []; // eslint-disable-line

export function castType(v) {
  if (Array.isArray(v)) {
    return v;
  }

  if (moment(v, 'YYYY-MM-DD', true).isValid() || moment(v, 'MM/DD/YYYY', true).isValid()) {
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

export function getValueByPath(obj, str, defaultValue) {
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
    if (parts.length === 0) {
      return result;
    }
    return defaultValue || str;
  } catch (e) {
    return undefined;
  }
}

export function applyReducers(value, args = []) {
  let result = value;
  let arr;
  let m;
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
      case 'max':
        arr = Array.isArray(value) ? value : [value];
        arr = arr.filter(x => !isNaN(parseFloat(x)))
          .map(x => parseFloat(x));
        result = Math.max(...arr);
        if (isNaN(result) || arr.length === 0) {
          result = undefined;
        }
        break;
      case 'date':
        if (typeof value !== 'number') {
          return value;
        }
        return moment(value).format('MM/DD/YYYY');
      case 'age':
        if (!value) return '';
        if (typeof value === 'number') {
          m = moment(value);
        } else {
          m = moment(value, ['MM/DD/YYYY', 'YYYY-MM-DD'], true);
        }
        if (!m.isValid()) {
          return 'n/a';
        }
        return moment().diff(m, 'years');
      default:
        console.warn('Unknown reducer', reducer); // eslint-disable-line no-console
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
      return value1 >= value2;
    default:
      console.warn('Unknown operator', operator); // eslint-disable-line no-console
      return undefined;
  }
}

export function evaluateOperand(operand, formState = {}, defaultValue = undefined) {
  let args;
  if (typeof(operand) === 'string') {
    args = operand.split(':');
  } else {
    args = [operand];
  }
  const value = getValueByPath(formState, args.shift(), defaultValue);
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
      case 'vset':
        value = evaluateOperand(args[1], formState);
        Object.assign(formState.variables, { [args[0]]: value });
        break;
      case 'pset':
        value = evaluateOperand(args[1], formState);
        Object.assign(formState.props, { [args[0]]: value });
        break;
      case 'add':
        current = formState.variables[args[0]] || 0;
        value = evaluateOperand(args[1], formState);
        if (typeof(value) !== 'number') {
          break;
        }
        Object.assign(formState.variables, { [args[0]]: current + value });
        break;
      case 'sum':
        current = 0;
        for (let i = 0; i < args.length; i++) {
          value = evaluateOperand(args[i], formState);
          if (typeof(value) === 'number') {
            current += value;
          }
        }
        Object.assign(formState.variables, { [args[0]]: current });
        break;
      case 'rows':
        rows = parseInt(evaluateOperand(args[0], formState), 10);
        Object.assign(formState.props, { [`${currentId}.rows`]: isNaN(rows) ? undefined : rows });
        break;
      default:
        console.warn(`unknown action in ${currentId}`, action, args); // eslint-disable-line no-console, max-len
        break;
    }
  });
  return formState;
}

export function evaluateRules(currentItem = {}, formState) {
  return (currentItem.rules || []).reduce((state, rule) => {
    const results = evaluateRule(rule, state);
    if (results) {
      firedRules.push({
        id: currentItem.id,
        rule,
        results,
      });
      return applyResults(results, state, currentItem.id);
    }
    return state;
  }, formState);
}

export function cleanItemValues(item, formState, force = false) {
  let newState = Object.assign({}, formState);
  let rows;
  switch (item.type) {
    case 'grid':
      if (typeof(formState.props[`${item.id}.rows`]) === 'number') {
        rows = formState.props[`${item.id}.rows`];
      }
      if (force) {
        rows = 0;
      }
      (item.columns || []).forEach(column => {
        const values = formState.values[column.id];
        if (values && values.length > 0 && rows >= 0) {
          values.splice(rows);
        }
      });
      break;
    default:
      if (force || !!formState.props[`${item.id}.skip`]) {
        delete newState.values[item.id];
        newState = (item.items || []).reduce(
          (state, it) => cleanItemValues(it, state, true),
          newState
        );
      }
      break;
  }
  return newState;
}


export function computeItemState(currentItem, formState) {
  let newState;
  newState = Object.assign({}, formState);
  newState = cleanItemValues(currentItem, newState);
  const items = currentItem.items || [];
  items.forEach((item) => {
    Object.assign(newState, computeItemState(item, newState));
  });
  return evaluateRules(currentItem, newState);
}

export function computeFormState(definition, values, props, otherData) {
  // firedRules = [];
  const formState = Object.assign({
    variables: Object.assign({}, definition.variables),
    values,
    props,
  }, otherData);
  const newState = computeItemState(definition, formState);
  // console.log('computed', newState, firedRules);
  return newState;
}

export function getScoringVariables(formState, scorePrefix = 'score.') {
  const variables = formState.variables;
  return Object.keys(variables)
    .filter(name => name.indexOf(scorePrefix) === 0)
    .map(name => ({
      name,
      value: variables[name],
    }));
}

//
// return any value to stop iteration
export function iterateItems(definition, callback) {
  // TODO: add tests
  const result1 = callback(definition);
  if (result1 !== undefined) {
    return result1;
  }

  const items = definition.items || [];
  for (let i = 0; i < items.length; i++) {
    const result2 = iterateItems(items[i], callback);
    if (result2 !== undefined) {
      return result2;
    }
  }
  return undefined;
}

export function findItem(itemId, definition) {
  // TODO: add tests
  if (definition.id === itemId) {
    return definition;
  }
  const items = definition.items || [];
  for (let i = 0; i < items.length; i++) {
    const result = findItem(itemId, items[i]);
    if (result) {
      return result;
    }
  }
  return null;
}

export function findItemParent(itemId, definition) {
  let parent;
  iterateItems(definition, (item) => {
    const { items } = item;
    const childIds = (items || []).map(child => child.id);
    if (childIds.includes(itemId)) {
      parent = item;
    }
  });
  return parent;
}

