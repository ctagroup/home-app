import './panelRois.html';


Template.panelRois.helpers({
  getClientRois() {
    return Template.instance().clientRois.get();
  },
  newRoiPath() {
    return Router.path('roisNew', {}, {
      query: {
        dedupClientId: Template.instance().data.client.dedupClientId,
      },
    });
  },
});

Template.panelRois.onCreated(function onCreated() {
  this.clientRois = new ReactiveVar({
    loading: true,
  });
  this.autorun(() => {
    const dedupClientId = this.data.client.dedupClientId;
    Meteor.call('roiApi', 'getRoisForClient', dedupClientId, (error, data) => {
      this.clientRois.set({
        error,
        data,
      });
    });
  });
});
