export function handleItemTransform(mode, model) {
  console.log('mm', model);
  const transformed = {
    ...model,
    rules: (model.rules || []).map(r => {
      if (!r.type) {
        return r;
      }
      const conditions = r.any || r.all;
      const actions = r.always || r.then;
      return {
        [r.type]: conditions,
        always: r.type === 'always' ? actions : undefined,
        then: r.type !== 'always' ? actions : undefined,
      };
    }),
  };

  if (model.category === 'choice' && model.options === undefined) {
    transformed.options = [];
  }

  return transformed;
}

export function handleFormTransform(mode, model) {
  const variables = model.variables.reduce((obj, v) => {
    if (v.name) {
      return Object.assign({}, obj, { [v.name]: v.value });
    }
    return obj;
  }, {});

  return {
    ...model,
    variables,
  };
}
