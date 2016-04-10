/**
 * Created by Kavi on 4/8/16.
 */

clientInfo = new Meteor.Collection("clientInfo");

Schemas.clientInfo = new SimpleSchema(
    {
        //survey_id,survey_title,content_type,content,order
        //first_name,middle_name,last_name,suffix,ssn,dob,race,ethnicity,gender,veteran_status,disabling_conditions,residence_prior,entry_date,exit_date,destination,personal_id,relationship,loc,shelter
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
        veteran_status: {
            type: String,
            max: 256
        },
        disabling_conditions: {
            type: String,
            max: 256
        },
        residence_prior: {
            type: String,
            max: 256
        },
        entry_date: {
            type: Date
        },
        exit_date: {
            type: Date
        },
        destination: {
            type: String,
            max: 256
        },
        personal_id: {
            type: String,
            max: 256
        },
        housing_id: {
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
