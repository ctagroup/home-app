export const RuleConditionDefinitionSchema = new SimpleSchema({});

export const RuleActionDefinitionSchema = new SimpleSchema({});

export const RuleDefinitionSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['always', 'any', 'all'],
  },
  always: {
    type: Array,
    optional: true,
  },
  'always.$': {
    type: [String],
    optional: true,
  },
  any: {
    type: Array,
    optional: true,
  },
  'any.$': {
    type: [String],
    optional: true,
  },
  all: {
    type: Array,
    optional: true,
  },
  'all.$': {
    type: [String],
    optional: true,
  },
  then: {
    type: Array,
    optional: true,
  },
  'then.$': {
    type: [String],
    optional: true,
  },
});

export const GridColumnDefinitionSchema = new SimpleSchema({
  id: {
    type: String,
  },
  title: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: ['question'],
  },
  category: {
    type: String,
    allowedValues: ['date', 'number', 'text'],
  },
});

export const ItemDefinitionSchema = new SimpleSchema({
  id: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: ['section', 'question', 'score', 'text', 'grid'],
  },
  rules: {
    type: [RuleDefinitionSchema],
    optional: true,
  },
});

export const GridDefinitionSchema = new SimpleSchema([
  ItemDefinitionSchema,
  {
    title: {
      type: String,
      optional: true,
    },
    text: {
      type: String,
      optional: true,
    },
    hmisId: {
      type: String,
      optional: true,
    },
    rows: {
      type: Number,
    },
    columns: {
      type: [GridColumnDefinitionSchema],
    },
  },
]);

export const QuestionDefinitionSchema = new SimpleSchema([
  ItemDefinitionSchema,
  {
    hmisId: {
      type: String,
      optional: true,
    },
    title: {
      type: String,
      optional: true,
    },
    text: {
      type: String,
      optional: true,
    },
    mask: {
      type: String,
      optional: true,
    },
    category: {
      type: String,
      allowedValues: ['choice', 'text', 'number', 'date', 'grid', 'location'],
    },
    options: {
      type: [String],
      optional: true,
    },
    refusable: {
      type: Boolean,
      optional: true,
    },
    other: {
      type: Boolean,
      optional: true,
    },
    otherValue: {
      type: String,
      optional: true,
    },
    address: {
      type: [String],
      optional: true,
    },
    autoLocation: {
      type: Boolean,
      optional: true,
    },
  },
]);

export const TextDefinitionSchema = new SimpleSchema([
  ItemDefinitionSchema,
  {
    title: {
      type: String,
      optional: true,
    },
    text: {
      type: String,
      optional: true,
    },
  },
]);

export const ScoreDefinitionSchema = new SimpleSchema([
  ItemDefinitionSchema,
  {
    score: {
      type: String,
    },
    text: {
      type: String,
      optional: true,
    },
  },
]);

export const SectionDefinitionSchema = new SimpleSchema([
  ItemDefinitionSchema,
  {
    title: {
      type: String,
      optional: true,
    },
    skip: {
      type: String,
      optional: true,
    },
    items: {
      type: [Object],
      optional: true,
    },
  },
]);
