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

const reasonsHash = reasons.reduce((acc, reason) => (
  {
    ...acc,
    [reason.id]: reason,
  }
), {});

Template.clientDeleteReason.helpers({
  reasonsList() {
    return reasons;
  },
});

Template.clientDeleteReason.events({
  'click .removeFromHousingList'(evt, tmpl) {
    const clientId = tmpl.data.client._id;
    const remarks = $('#removalRemarks').val();
    const reasonId = $('#removalReason').val();

    if (remarks.trim().length === 0 && reasonsHash[reasonId].required) {
      Bert.alert('Remarks are required', 'danger', 'growl-top-right');
      $('#removalRemarks').focus();
      return;
    }
    const reason = reasonsHash[reasonId];
    let removeReasons = reason.text;
    if (reason.required) removeReasons = `${removeReasons} | ${remarks}`;
    Meteor.call('ignoreMatchProcess', clientId, true, removeReasons, (err, res) => {
      if (err) {
        Bert.alert(err.reason || err.error, 'danger', 'growl-top-right');
      } else {
        Bert.alert('Client removed for the matching process', 'success', 'growl-top-right');
        // We simulate update in client-side collection
        // Sadly, this cannot be done in meteor call (isSimulation)
        Clients._collection.update(clientId, { $set: { // eslint-disable-line
          'eligibleClient.ignoreMatchProcess': res.ignoreMatchProcess,
          'eligibleClient.remarks': res.remarks,
        } });
      }
    });
  },
});

Template.clientDeleteReason.onRendered(() => {
  $('.removalReason').select2({
    placeholder: 'Select reason',
    allowClear: true,
    // theme: 'classic',
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
