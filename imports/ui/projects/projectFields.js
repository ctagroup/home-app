import './projectFields.html';

export function formSchema() {
  const definition = {
    projectName: {
      type: String,
    },
    projectCommonName: {
      type: String,
      optional: true,
    },
  };
  return new SimpleSchema(definition);
}
