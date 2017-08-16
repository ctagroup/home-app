import { Mongo } from 'meteor/mongo';


import QuestionSchema from './questionSchema';

const Questions = new Mongo.Collection('questions');
Questions.attachSchema(QuestionSchema);

export default Questions;
