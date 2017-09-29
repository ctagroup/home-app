/* eslint prefer-arrow-callback: "off", func-names: "off" */
import { chai } from 'meteor/practicalmeteor:chai';
import {
  applyResults,
  computeFormState,
  evaluateCondition,
  evaluateOperand,
  evaluateRule,
  getValueByPath,
} from './computations';

describe('survey computations', function () {
  describe('custom', function () {
    it('getValueByPath if exists', function () {
      const formState = {
        values: {
          foo: 1,
        },
      };
      chai.assert.equal(getValueByPath(formState, 'values.foo'), 1);
    });

    it('evaluate ALWAYS rule', function () {
      const rule = {
        always: [['foo'], ['bar']],
      };

      const result = evaluateRule(rule, {});
      chai.assert.deepEqual(result, [['foo'], ['bar']]);
    });
  });

  describe('evaluateOperand', function () {
    it('const type casting', function () {
      chai.assert.equal(evaluateOperand('123'), 123);
      chai.assert.equal(evaluateOperand('0005'), 5);
    });
    it('variables', function () {
      const formState = {
        variables: {
          foo: 1,
          bar: 'baz',
        },
        values: {
          baz: 8,
        },
      };
      chai.assert.equal(evaluateOperand('variables.foo', formState), 1);
      chai.assert.equal(evaluateOperand('variables.bar', formState), 'baz');
      chai.assert.equal(evaluateOperand('values.baz', formState), 8);
    });
    it('min function', function () {
      const formState = {
        variables: {
          foo: 10,
          arr: [5, 2, 1],
        },
      };
      chai.assert.equal(evaluateOperand('variables.foo:min', formState), 10);
    });
  });

  describe('ANY rule', function () {
    it('evaluate with success', function () {
      const formState = {
        values: {
          foo: 1,
        },
      };
      const rule = {
        any: [
          ['==', 'values.foo', 0],
          ['==', 'values.foo', 1],
        ],
        then: [['set', 'bar', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, [['set', 'bar', 2]]);
    });

    it('evaluate with failure', function () {
      const formState = {
        values: {
          foo: 2,
        },
      };
      const rule = {
        any: [
          ['==', 'values.foo', 1],
        ],
        then: [['set', 'bar', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, false);
    });
    it('evaluate empty as failure', function () {
      const formState = { };
      const rule = {
        any: [],
        then: [['set', 'bar', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, false);
    });
  });

  describe('ALL rule', function () {
    it('evaluate with success', function () {
      const formState = {
        values: {
          foo: 10,
        },
      };
      const rule = {
        all: [
          ['>', 'values.foo', 0],
          ['<', 'values.foo', 20],
        ],
        then: [['set', 'bar', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, [['set', 'bar', 2]]);
    });

    it('evaluate with failure', function () {
      const formState = {
        values: {
          foo: 2,
        },
      };
      const rule = {
        all: [
          ['==', 'values.foo', 1],
          ['==', 'values.foo', 2],
        ],
        then: [['set', 'bar', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, false);
    });

    it('evaluate empty as failure', function () {
      const formState = { };
      const rule = {
        all: [],
        then: [['set', 'bar', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, false);
    });
  });

  describe('conditions', function () {
    it('==', function () {
      chai.assert.isTrue(evaluateCondition('==', 10, 10));
      chai.assert.isFalse(evaluateCondition('==', 1, 2));
    });
    it('!=', function () {
      chai.assert.isTrue(evaluateCondition('!=', 1, 2));
      chai.assert.isFalse(evaluateCondition('!=', 10, 10));
    });
    it('>', function () {
      chai.assert.isTrue(evaluateCondition('>', 2, 1));
      chai.assert.isFalse(evaluateCondition('>', 1, 1));
    });
    it('>=', function () {
      chai.assert.isTrue(evaluateCondition('>=', 2, 1));
      chai.assert.isTrue(evaluateCondition('>=', 1, 1));
    });
    it('<', function () {
      chai.assert.isTrue(evaluateCondition('<', 1, 2));
      chai.assert.isFalse(evaluateCondition('<', 1, 1));
    });
  });

  describe('applyResults', function () {
    it('will show current item', function () {
      const formState = {
        props: {},
      };
      const newState = applyResults([['show']], formState, 'item1');
      chai.assert.equal(newState.props['item1.hidden'], false);
    });
    it('will hide current item', function () {
      const formState = {
        props: {},
      };
      const newState = applyResults([['hide']], formState, 'item1');
      chai.assert.equal(newState.props['item1.hidden'], true);
    });
    it('will set variable to const', function () {
      const formState = {
        variables: {},
      };
      const newState = applyResults([['set', 'foo', 1]], formState);
      chai.assert.equal(newState.variables.foo, 1);
    });
    it('will set variable to another variable', function () {
      const formState = {
        variables: {
          foo: 1,
        },
      };
      const newState = applyResults([['set', 'bar', 'variables.foo']], formState);
      chai.assert.equal(newState.variables.bar, 1);
    });
    it('will set variable equal to some value', function () {
      const formState = {
        variables: {},
        values: {
          foo: 1,
        },
      };
      const newState = applyResults([['set', 'bar', 'values.foo']], formState);
      chai.assert.equal(newState.variables.bar, 1);
    });
    it('will increase variable', function () {
      const formState = {
        variables: {
          foo: 10,
        },
      };
      const newState = applyResults([['add', 'foo', 1]], formState);
      chai.assert.equal(newState.variables.foo, 11);
    });
    it('will increase undefined variable', function () {
      const formState = {
        variables: {},
      };
      const newState = applyResults([['add', 'foo', 1]], formState);
      chai.assert.equal(newState.variables.foo, 1);
    });
  });

  describe('computeFormState', function () {
    it('will compute simple case', function () {
      const definition = {
        id: 'case1',
        items: [],
        rules: [{ always: [['set', 'form1', 1]] }],
      };
      const values = { name: 'John' };
      const props = {};

      const newState = computeFormState(definition, values, props);
      chai.assert.deepEqual(newState, {
        variables: {
          form1: 1,
        },
        values: { name: 'John' },
        props: {},
      });
    });

    it('will compute nested case', function () {
      const definition = {
        id: 'form1',
        items: [
          {
            id: 'section1',
            type: 'section',
            items: [
              {
                id: 'item1',
                type: 'question',
                category: 'text',
                title: 'First Name',
                rules: [{ always: [['set', 'question1', 1]] }],
              },
            ],
            rules: [{ always: [['set', 'section1', 2]] }],
          },
        ],
        rules: [{ always: [['set', 'form1', 3]] }],
      };
      const values = { name: 'John' };
      const props = {};

      const newState = computeFormState(definition, values, props);
      chai.assert.deepEqual(newState, {
        variables: {
          question1: 1,
          section1: 2,
          form1: 3,
        },
        values: {
          name: 'John',
        },
        props: {},
      });
    });
  });

  it('will apply rules in correct order', function () {
    const definition = {
      id: 'form1',
      items: [
        {
          id: 'section1',
          type: 'section',
          items: [
            {
              id: 'item1',
              type: 'question',
              category: 'text',
              title: 'First Name',
              rules: [{ always: [['set', 'foo', 1]] }],
            },
          ],
          rules: [{ always: [['set', 'foo', 2]] }],
        },
      ],
      rules: [{ always: [['set', 'foo', 3]] }],
    };
    const values = { name: 'John' };
    const props = {};

    const newState = computeFormState(definition, values, props);
    chai.assert.deepEqual(newState.variables.foo, 3);
  });

  it('will apply each rule only once', function () {
    const definition = {
      id: 'form1',
      items: [
        {
          id: 'section1',
          type: 'section',
          items: [
            {
              id: 'item1',
              type: 'question',
              category: 'text',
              title: 'First Name',
              rules: [{ always: [['add', 'foo', 1]] }],
            },
          ],
          rules: [{ always: [['add', 'foo', 1]] }],
        },
      ],
      rules: [{ always: [['add', 'foo', 1]] }],
    };
    const values = { name: 'John' };
    const props = {};

    const newState = computeFormState(definition, values, props);
    chai.assert.deepEqual(newState.variables.foo, 3);
  });
});

