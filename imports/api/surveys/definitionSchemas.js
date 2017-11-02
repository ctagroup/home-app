export const RuleConditionDefinitionSchema = new SimpleSchema({
});

export const RuleDefinitionSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['always', 'any', 'all'],
  },
  conditions: {
    type: [String],
    minCount: 3,
    maxCount: 3,
    optional: true,
  },

  always: {
    type: [String],
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  any: {
    type: [String],
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  all: {
    type: [String],
    minCount: 3,
    maxCount: 3,
    optional: true,
  },
  then: {
    type: [String],
    minCount: 3,
    maxCount: 3,
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
    allowedValues: ['question', 'score', 'section', 'text'],
  },
  rules: {
    type: [RuleDefinitionSchema],
    optional: true,
  },
});

export const GridDefinitionSchema = new SimpleSchema([ItemDefinitionSchema, {
  rows: {
    type: Number,
  },
  columns: {
    type: [GridColumnDefinitionSchema],
  },
}]);

export const QuestionDefinitionSchema = new SimpleSchema([ItemDefinitionSchema, {
  title: {
    type: String,
    optional: true,
  },
  text: {
    type: String,
    optional: true,
  },
  category: {
    type: String,
    allowedValues: ['choice', 'date', 'number', 'text'],
  },
  options: {
    type: [String],
    optional: true,
  },
  refusable: {
    type: Boolean,
  },
  other: {
    type: Boolean,
    optional: true,
  },
  otherValue: {
    type: String,
    optional: true,
  },
}]);

export const TextDefinitionSchema = new SimpleSchema([ItemDefinitionSchema, {
  title: {
    type: String,
    optional: true,
  },
  text: {
    type: String,
    optional: true,
  },
}]);

export const ScoreDefinitionSchema = new SimpleSchema([ItemDefinitionSchema, {
  score: {
    type: String,
  },
  text: {
    type: String,
    optional: true,
  },
}]);

export const SectionDefinitionSchema = new SimpleSchema([ItemDefinitionSchema, {
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
}]);
