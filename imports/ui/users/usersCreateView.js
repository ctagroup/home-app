import './hmisProfile.js';
import './userCreateForm.js';
import './usersCreateView.html';

Template.usersCreateView.events(
  {
    'submit #create-user': (evt) => {
      evt.preventDefault();
      // TODO: create new users
    },
  }
);
