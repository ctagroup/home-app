export function handleModelTransform(mode, model) {
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
