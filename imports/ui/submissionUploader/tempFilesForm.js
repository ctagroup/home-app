import Alert from '/imports/ui/alert';

AutoForm.addHooks('tempFilesForm', {
  before: {
    method: CfsAutoForm.Hooks.beforeInsert,
  },
  after: {
    method: CfsAutoForm.Hooks.afterInsert,
  },
  onSuccess() {
    Alert.success('File uploaded');
    const query = {
      // clientId: this.insertDoc.clientId,
      // schema: this.insertDoc.clientSchema,
    };
    // return Router.go('tempFilesList', {}, { query });
    return Router.go('tempFilesNew', {}, { query });
  },
  onError(formType, err) {
    Alert.error(err);
  },
});
