import './roisForm';
import './roisNew.html';


Template.roisNew.events({
  'click button': (event) => {
    console.log('new button', this, event);
    event.preventDefault();
  },
});
