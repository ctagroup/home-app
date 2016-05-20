/**
 * Created by Kavi on 5/19/16.
 */
responses = new Meteor.Collection( 'responses' );

Schemas.responses = new SimpleSchema( {
    surveyID:{
        type: String,
        max: 256
    },
    clientID:{
        type: String,
        max: 256
    },
    userID: {
        type: String,
        max: 256
    },
    responseStatus: {
        type: String,
        max: 256
    }
} );

responses.attachSchema( Schemas.responses );
