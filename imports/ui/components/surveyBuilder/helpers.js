export function handleItemTransform(mode, model) {
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
  return transformed;
}

export function handleFormTransform(mode, model) {
  const variables = model.variables.reduce((v, obj) =>
    v.name ? Object.assign({}, obj, { [v.name]: v.value }) : obj,
    {}
  );
  // TODO: finish it

  console.log(model.variables, 'zz', variables);

  return model;
  /*
  return {
    ...model,
    variables,
  };
  */
}
