/**
 * Created by udit on 22/06/16.
 */

/**
 * Created by udit on 08/02/16.
 */
Meteor.publish(
  'homeRoles', () => {
    if (typeof homeRoles === 'undefined') {
      return [];
    }
    return homeRoles.find({});
  }
);

Meteor.publish(
  'rolePermissions', () => {
    if (typeof rolePermissions === 'undefined') {
      return [];
    }
    return rolePermissions.find({});
  }
);

Meteor.publish(
  'options', () => {
    if (typeof options === 'undefined') {
      return [];
    }
    return options.find({});
  }
);

Meteor.publish(
  'surveys', () => {
    if (typeof surveys === 'undefined') {
      return [];
    }
    return surveys.find({});
  }
);

Meteor.publish(
  'questions', () => {
    if (typeof questions === 'undefined') {
      return [];
    }
    return questions.find({});
  }
);

Meteor.publish(
  'surveyQuestionsMaster', () => {
    if (typeof surveyQuestionsMaster === 'undefined') {
      return [];
    }
    return surveyQuestionsMaster.find({});
  }
);

Meteor.publish(
  'users', () => {
    if (typeof users === 'undefined') {
      return [];
    }
    return users.find({});
  }
);
Meteor.publish(
  'clientInfo', () => {
    if (typeof clientInfo === 'undefined') {
      return [];
    }
    return clientInfo.find({});
  }
);

Meteor.publish(
  'responses', () => {
    if (typeof responses === 'undefined') {
      return [];
    }
    return responses.find({});
  }
);
