/**
 * Created by kavyagautam on 5/18/16.
 */

Meteor.startup(() => {
  const messageData = [
    {
      name: 'Joe Lipper',
      content: 'Wow building a chat app with Meteor is so easy!',
    }, {
      name: 'Mike Jewett',
      content: 'Yeah wow! What a great framework. I can\'t wait to keep building this thing out!',
    }, {
      name: 'Joe Lipper',
      content: 'Hang in there -- we\'ve only scratched the surface on this thing.',
    },
  ];

  if (Messages.find().count() === 0) {
    for (let i = 0; i < messageData.length; i ++) {
      Messages.insert(
        {
          name: messageData[i].name,
          content: messageData[i].content,
        }
      );
    }
  }
});

Meteor.publish('messages', () => {
  if (typeof Messages === 'undefined') {
    return null;
  }

  return Messages.find({});
});
