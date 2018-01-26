import Alert from '/imports/ui/alert';


AutoForm.addHooks('filesForm', {
  before: {
    method: CfsAutoForm.Hooks.beforeInsert,
  },
  after: {
    method: CfsAutoForm.Hooks.afterInsert,
  },
  onSuccess() {
    Alert.success('File uploaded');
    const query = {
      clientId: this.insertDoc.clientId,
      schema: this.insertDoc.clientSchema,
    };
    return Router.go('filesList', {}, { query });
  },
  onError(formType, err) {
    Alert.error(err);
  },
});
