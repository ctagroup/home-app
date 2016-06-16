/**
 * Created by Kavi on 4/8/16.
 */

clientInfo = new Meteor.Collection("clientInfo");

Schemas.clientInfo = new SimpleSchema(
    {
        //survey_id,survey_title,content_type,content,order
        //first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteranStatus,disablingConditions,residencePrior,entryDate,entryDate,destination,personalId,relationship,loc,shelter
        firstName: {
            type: String,
            max: 256
        },
        middleName: {
            type: String,
            max: 256
        },
        lastName: {
            type: String,
            max: 256
        },
        suffix: {
            type: String,
            max: 50
        },
        ssn: {
            type: Number
        },
        dob: {
            type: Date
        },
        race: {
            type: String,
            max: 256
        },
        ethnicity: {
            type: String,
            max: 256
        },
        gender: {
            type: String,
            max: 256
        },
        veteranStatus: {
            type: String,
            max: 256
        },
        disablingConditions: {
            type: String,
            max: 256
        },
        residencePrior: {
            type: String,
            max: 256
        },
        entryDate: {
            type: Date
        },
        entryDate: {
            type: Date
        },
        destination: {
            type: String,
            max: 256
        },
        personalId: {
            type: String,
            max: 256,
	        optional: true
        },
	    householdId: {
            type: String,
            max: 256
        },
        relationship: {
            type: String,
            max: 256
        },
        location: {
            type: String,
            max: 256
        },
        shelter: {
            type: String,
            max: 256
        }
    }
);

clientInfo.attachSchema( Schemas.clientInfo );
