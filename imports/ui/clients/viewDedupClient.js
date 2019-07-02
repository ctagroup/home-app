import './viewDedupClient.html';
import ClientContainer from '/imports/ui/components/client/ClientContainer';

Template.viewDedupClient.helpers({
  ClientContainer() {
    return ClientContainer;
  },
});
