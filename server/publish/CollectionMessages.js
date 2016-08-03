/**
 * Created by kavyagautam on 5/18/16.
 */

/*
Meteor.startup(() => {

  const messageData = [
    {
      name: 'Joe Lipper',
      content: 'Wow building a chat app with Meteor is so easy!',
      timestamp: Date.now(),
    },
    {
      name: 'Mike Jewett',
      content: 'Yeah wow! What a great framework. I cant wait to keep building this thing out!',
      timestamp: Date.now(),
    },
    {
      name: 'Joe Lipper',
      content: 'Hang in there -- we have only scratched the surface on this thing.',
      timestamp: Date.now(),
    },
  ];

  if (messages.find().count() === 0) {
    for (let i = 0; i < messageData.length; i ++) {
      messages.insert(
        {
          name: messageData[i].name,
          content: messageData[i].content,
        }
      );
    }
  }
}
);

*/

Meteor.startup(() => {
  messages.allow({
    insert() {
      return true;
    },
    update() {
      return true;
    },
    remove() {
      return false;
    },
  }
  );
}
);


Meteor.publish('messages', () => {
  if (typeof messages === 'undefined') {
    return null;
  }

  return messages.find({});
}
);

/*
Meteor.publish('onlineuser', () => {
  return Meteor.onlineuser.find({ 'status.online': true }, { username: 1 });
}
);
*/
