export function getValueByPath(obj, str) {
  // see also: https://lodash.com/docs/4.17.4#get
  try {
    return str.split('.').reduce((o, i) => o[i], obj) || '';
  } catch (e) {
    return undefined;
  }
}

function evaluateCondition(operator, operand1, operand2) {
  switch (operator) {
    case '==':
      return operand1 == operand2; // eslint-disable-line eqeqeq
    case '!=':
      return operand1 != operand2; // eslint-disable-line eqeqeq
    case '<':
      return operand1 < operand2;
    case '>':
      return operand1 > operand2;
    case '<=':
      return operand1 <= operand2;
    case '>=':
      return operand1 >= operand2;
    default:
      console.warn('Unknown operator', operator);
      return undefined;
  }
}


function evaluateRule(rule = {}, formState) {
  const operand1 = getValueByPath(formState, rule.value);
  // console.log('evr', rule, operand1);

  if (rule.always) {
    return rule.always;
  } else if (rule.any) {
    for (let i = 0; i < rule.any.length; i++) {
      const operator = rule.any[i][0];
      const operand2 = rule.any[i][1];
      if (evaluateCondition(operator, operand1, operand2) === true) {
        return rule.then;
      }
    }
  } else if (rule.all) {
    for (let i = 0; i < rule.all.length; i++) {
      let result = true;
      const operator = rule.all[i][0];
      const operand2 = rule.all[i][1];
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

function applyResults(id, results, formState) {
  results.forEach((result) => {
    let args;
    if (typeof(result) === 'string') {
      args = [result];
    } else {
      args = result.slice(0);
    }
    const action = args.shift();
    switch (action) {
      case 'show':
        Object.assign(formState.variables, { [`${id}.disabled`]: false });
        break;
      case 'hide':
        Object.assign(formState.variables, { [`${id}.disabled`]: true });
        break;
      case 'set':
        Object.assign(formState.variables, { [args[0]]: args[1] });
        break;
      case 'add':
        Object.assign(formState.variables, { [args[0]]: formState.variables[args[0]] + args[1] });
        break;
      default:
        console.warn('unknown action', id, action, args);
        break;
    }
  });
  return formState;
}


export function computeFormState(definition, values, otherData) {
  // console.log(definition, values, otherData);
  const formState = Object.assign({
    values,
    variables: Object.assign({}, definition.variables),
  }, otherData);
  // console.log('** recomputing form', definition, formState);

  const sections = definition.sections || [];
  sections.forEach((section) => {
    const items = section.items || [];
    items.forEach((item) => {
      const results = evaluateRules(item.rules, formState);
      console.log('applying results for', item.id, results);
      applyResults(item.id, results, formState);
    });
  });

  console.log('** recomputing done', formState);
  return formState;
}
