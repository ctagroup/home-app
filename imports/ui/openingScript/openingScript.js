import OpeningScript from '/imports/api/openingScript/openingScript';
import './openingScript.html';


Template.openingScript.helpers({
  getOpeningScriptSchema() {
    return OpeningScript.schema;
  },
  getOpeningScript() {
    return OpeningScript.data();
  },
});

AutoForm.addHooks('openingScriptForm', {
  onSubmit: function submit(insertDoc) {
    this.event.preventDefault();
    Meteor.call('openingScript.save', insertDoc, (err, res) => {
      this.done(err, res);
    });
    return false;
  },
  onSuccess() {
    Bert.alert('Opening script saved', 'success', 'growl-top-right');
  },
  onError(formType, err) {
    Bert.alert(err.reason || err.error || err.message, 'danger', 'growl-top-right');
  },
});

