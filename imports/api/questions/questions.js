import { Mongo } from 'meteor/mongo';

const Questions = new Mongo.Collection('questions');

const categoryOptions = [
  { value: 'choice', label: 'Choice' },
  { value: 'date', label: 'Date' },
  { value: 'grid', label: 'Grid' },
  { value: 'number', label: 'Number' },
  { value: 'text', label: 'Text' },
];

const GridColumnSchema = new SimpleSchema({
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: ['question'],
    autoform: {
      type: 'hidden',
    },
  },
  category: {
    type: String,
    allowedValues: categoryOptions.map(o => o.value),
    autoform: {
      options: categoryOptions,
    },
  },
});

SimpleSchema.messages({
  questionCategoryisRequired: 'Provide question category',
});

Questions.schema = new SimpleSchema({
  title: {
    type: String,
    autoform: {
      rows: 2,
    },
  },
  text: {
    type: String,
    label: 'Additional description',
    autoform: {
      rows: 5,
    },
    optional: true,
  },
  category: {
    type: String,
    allowedValues: categoryOptions.map(o => o.value),
    autoform: {
      options: categoryOptions,
    },
  },
  refusable: {
    type: Boolean,
  },
  options: {
    type: [String],
    optional: true,
  },
  other: {
    type: String,
    label: 'Other (leave empty if other value is not allowed)',
    optional: true,
  },
  columns: {
    type: [GridColumnSchema],
    label: 'Grid columns',
    optional: true,
  },
  public: {
    type: Boolean,
    label: 'Show this question in the Question Bank',
  },
  questionCategory: {
    type: String,
    optional: true,
  },
  questionSubcategory: {
    type: String,
    optional: true,
    custom() {
      if (!this.field('questionCategory').isSet) {
        return 'questionCategoryisRequired';
      }
      return undefined;
    },
  },
  version: {
    type: Number,
    optional: true,
    autoValue() {
      return 2;
    },
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    optional: true,
    autoValue() {
      let val;
      if (this.isInsert) {
        val = new Date();
      } else if (this.isUpsert) {
        val = { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
      return val;
    },
  },
  updatedAt: {
    type: Date,
    label: 'Updated At',
    optional: true,
    autoValue() {
      let val;
      if (this.isUpdate) {
        val = new Date();
      }
      return val;
    },
  },

});

Questions.attachSchema(Questions.schema);

export default Questions;
