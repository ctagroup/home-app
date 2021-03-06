import { ReactiveVar } from 'meteor/reactive-var';
import { Clients } from '/imports/api/clients/clients';

import './clientDeleteReason.html';

const reasons = [
  { required: true, text: 'Housed by CARS (include agency/program)' },
  { required: false, text: 'Housed externally' },
  { required: false, text: 'Unreachable' },
  { required: false, text: 'Insufficient contact information' },
  { required: false, text: 'Client maxed out referral offers' },
  { required: false, text: 'Client no longer interested in services' },
  { required: true, text: 'Other (specify)' },
].map(({ text, required }) => ({
  id: text.replace(/\s+/g, '_').toLowerCase(),
  text,
  required,
}));

const reasonsHash = reasons.reduce((acc, reason) => ({ ...acc, [reason.id]: reason }), {});

Template.clientDeleteReason.onCreated(function clientDeleteReasonOnCreated() {
  this.removalDetails = new ReactiveVar(reasons[0].required);
});

Template.clientDeleteReason.helpers({
  showRemovalDetails() {
    if (Template.instance()) return Template.instance().removalDetails.get();
    return false;
  },
  reasonsList() {
    return reasons;
  },
});

Template.clientDeleteReason.events({
  'change #removalReason'(event, tmpl) {
    const reasonId = event.target.value;
    tmpl.removalDetails.set(reasonsHash[reasonId].required);
  },
  'click .removeFromHousingList'(evt, tmpl) {
    const client = tmpl.data.client;
    // drop not found:
    const clientVersions = client.clientVersions
      .filter(({ clientId, schema }) => {
        const data = client[`eligibleClient::${schema}::${clientId}`];
        return data && !data.error;
      });
    const clientIds = clientVersions.map(({ clientId }) => clientId);

    const remarks = $('#removalRemarks').val();
    const date = $('#removalDate').val();
    const reasonId = $('#removalReason').val();

    if (reasonsHash[reasonId].required && remarks.trim().length === 0) {
      Bert.alert('Remarks are required', 'danger', 'growl-top-right');
      $('#removalRemarks').focus();
      return;
    }
    if (date.trim().length === 0) {
      Bert.alert('Removal Date required', 'danger', 'growl-top-right');
      $('#removalDate').focus();
      return;
    }
    const reason = reasonsHash[reasonId];
    let removeReasons = reason.text;
    if (reason.required) removeReasons = `${removeReasons} | ${remarks}`;
    removeReasons = `${removeReasons} | ${date}`;

    // Optimistic UI approach:
    const changes = clientVersions.reduce((acc, { clientId, schema }) => ({
      ...acc,
      [`eligibleClient::${schema}::${clientId}.ignoreMatchProcess`]: true,
      [`eligibleClient::${schema}::${clientId}.remarks`]: removeReasons,
    }), {});

    Meteor.call('ignoreMatchProcess', clientIds, true, removeReasons, (err) => {
      if (err) {
        Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Client removed for the matching process', 'success', 'growl-top-right');
        // We simulate update in client-side collection
        // Sadly, this cannot be done in meteor call (isSimulation)
        Clients._collection.update(client._id, { $set: changes }); // eslint-disable-line
      }
    });
  },
});

Template.clientDeleteReason.onRendered(() => {
  $('.js-datepicker').datetimepicker({
    format: 'MM-DD-YYYY',
  });
  $('.removalReason').select2({
    placeholder: 'Select reason',
    allowClear: true,
    theme: 'classic',
    width: '100%',
    // tags: true,
    // createTag: (params) => {
    //   const term = $.trim(params.term);

    //   if (term === '') return null;

    //   return {
    //     id: term.replace(/\s+/g, '_').toLowerCase(),
    //     text: term,
    //     newTag: true, // add additional parameters
    //   };
    // },
  });
});
