import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Meteor.settings.s3config.key;
AWS.config.secretAccessKey = Meteor.settings.s3config.secret;
// AWS.config.region = Meteor.settings.s3config.region;

const s3 = new AWS.S3({
  params: { Bucket: Meteor.settings.s3config.bucket },
});


s3.listObjects({ Delimiter: '/' }, (err, data) => {
  console.log(err, data);
});


Meteor.methods({
  's3bucket.upload.photo'(clientId, data) {
    s3.upload({
      Key: `consent signatures/${clientId}/photo`,
      Body: data,
      ACL: 'public-read',
    }, (err, res) => {
      console.log(err, res);

    });
  },
  's3bucket.get'(url) {

  }

});

/*
const client = s3.createClient({
  s3options: {
    accessKeyId: Meteor.settings.s3config.key,
    secretAccessKey: Meteor.settings.s3config.secret,
    // region: "",
  },
});

export default client;
*/


