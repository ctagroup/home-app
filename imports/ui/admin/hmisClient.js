import './hmisClient.html';
import { HmisClientPage } from '/imports/ui/components/pages/HmisClientPage';


Template.hmisClient.helpers({
  component() {
    return HmisClientPage;
  },
});
