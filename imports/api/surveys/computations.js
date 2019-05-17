import moment from 'moment';

let firedRules = []; // eslint-disable-line

function filterFloat(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}

export function castType(v) {
  if (Array.isArray(v)) {
    return v;
  }

  if (moment(v, 'YYYY-MM-DD', true).isValid() || moment(v, 'MM/DD/YYYY', true).isValid()) {
    return v;
  }

  const result = filterFloat(v);
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

export function parseReducer(expr) {
  if (expr[expr.length - 1] === ')') {
    const parts = expr.split('(');
    return {
      name: parts[0],
      args: parts[1].slice(0, -1).split(',').map(x => castType(x.trim())),
    };
  }
  return {
    name: expr,
    args: [],
  };
}

export function applyReducers(initialValue, reducers = []) {
  return reducers.reduce((value, reducer) => {
    const { name, args } = parseReducer(reducer);
    let arr;
    let m;
    let result;
    switch (name) {
      case 'min':
        arr = Array.isArray(value) ? value : [value];
        arr = arr.filter(x => !isNaN(parseFloat(x)))
          .map(x => parseFloat(x));
        result = Math.min(...arr);
        if (isNaN(result) || arr.length === 0) {
          return undefined;
        }
        return result;
      case 'max':
        arr = Array.isArray(value) ? value : [value];
        arr = arr.filter(x => !isNaN(parseFloat(x)))
          .map(x => parseFloat(x));
        result = Math.max(...arr);
        if (isNaN(result) || arr.length === 0) {
          return undefined;
        }
        return result;
      case 'date':
        if (value instanceof moment) {
          return value.format('MM/DD/YYYY');
        }
        if (typeof value === 'number') {
          return moment(value).format('MM/DD/YYYY');
        }
        return value;
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
      case 'digits':
        return `${value}`.replace(/[^0-9]/g, '');
      case 'last':
        return `${value}`.slice(-args[0]);
      case 'now':
        return moment();
      case 'addDays':
        if (value instanceof moment) {
          return value.add(args[0], 'days');
        }
        return value;
      default:
        console.warn('Unknown reducer', reducer); // eslint-disable-line no-console
        return value;
    }
  }, initialValue);
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
        Object.assign(formState.variables, { [`${currentId}.hidden`]: false });
        break;
      case 'hide':
        Object.assign(formState.variables, { [`${currentId}.hidden`]: true });
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
      case 'rset':
        value = evaluateOperand(args[1], formState);
        Object.assign(formState.values, { [args[0]]: value });
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
          current += parseFloat(value) || 0;
        }
        Object.assign(formState.variables, { [args[0]]: current });
        break;
      case 'rows':
        rows = parseInt(evaluateOperand(args[0], formState), 10);
        Object.assign(formState.props, { [`${currentId}.rows`]: isNaN(rows) ? undefined : rows });
        break;
      case 'email':
        formState.emails.push({
          template: args[0],
          recipient: evaluateOperand(args[1], formState),
          ccRecipient: evaluateOperand(args[2], formState),
          bccRecipient: evaluateOperand(args[3], formState),
        });
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
  const initialFormState = Object.assign({
    variables: Object.assign({}, definition.variables),
    values,
    props,
    emails: [],
  }, otherData);
  const newState = computeItemState(definition, initialFormState);
  // console.log('computed', newState, firedRules, formState);
  return newState;
}

export function evaluatePostSubmitRules(definition, formState) {
  return evaluateRules({ rules: definition.onSubmit }, formState);
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

export function itemsToArray(definition) {
  const items = [];
  iterateItems(definition, (item) => { items.push(item); return undefined; });
  return items;
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

export function parseText(text, formState) {
  const regex = /{{([^}]+)}}/g;
  const translations = {};
  let out = text;
  while (true) {
    const m = regex.exec(text);
    if (m === null) {
      break;
    }
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex, data) => {
      if (groupIndex === 0) {
        translations[match] = data[1];
      }
    });
  }
  Object.keys(translations).forEach(t => {
    const value = evaluateOperand(translations[t], formState, 'n/a');
    out = out.split(t).join(`${value}`);
  });
  return out;
}

export function prepareEmails(definition, formState) {
  const emailsToSend = formState.emails || [];

  if (!definition.emails) return [];

  return emailsToSend
    .map(email => {
      const template = definition.emails.find(e => e.id === email.template);

      if (!template) {
        return null;
      }

      return {
        ...email,
        title: parseText(template.title, formState),
        body: parseText(template.body, formState),
      };
    })
    .filter(email => email !== null);
}

export function getQuestionItemOptions(item) {
  const options = item.options || {};
  if (Array.isArray(options)) {
    return options.filter(o => !!o).reduce((all, o) => {
      if (typeof o === 'string') {
        const label = o.split('|').pop();
        const value = o.split('|').shift();
        return {
          ...all,
          [value]: label,
        };
      }
      return {
        ...all,
      };
    }, {});
  }
  return options;
}
