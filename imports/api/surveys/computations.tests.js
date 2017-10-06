/* eslint prefer-arrow-callback: "off", func-names: "off" */
import { chai } from 'meteor/practicalmeteor:chai';
import {
  applyResults,
  computeFormState,
  evaluateCondition,
  evaluateOperand,
  evaluateRule,
  evaluateRules,
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

    it('getValueByPath with dots in name', function () {
      const formState = {
        values: {
          'foo.bar': 1,
        },
      };
      chai.assert.equal(getValueByPath(formState, 'values.foo.bar'), 1);
      chai.assert.equal(getValueByPath(formState, 'values.foo.baz'), 'values.foo.baz');
    });

    it('getValueByPath with dots in name', function () {
      const formState = {
        values: {
          'foo.bar': 1,
        },
      };
      chai.assert.equal(getValueByPath(formState, 'values.foo.bar'), 1);
      chai.assert.equal(getValueByPath(formState, 'values.foo.baz'), 'values.foo.baz');
    });

    it('getValueByPath - array', function () {
      const formState = {
        values: {
          'foo.bar': [10, 20, 30],
        },
      };
      chai.assert.deepEqual(getValueByPath(formState, 'values.foo.bar'), [10, 20, 30]);
    });

    it('getValueByPath - array elements', function () {
      const formState = {
        values: {
          'foo.bar': [10, 20, 30],
        },
      };
      chai.assert.equal(getValueByPath(formState, 'values.foo.bar.0'), 10);
      chai.assert.equal(getValueByPath(formState, 'values.foo.bar.1'), 20);
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

    it('non existing variables, values, props', function () {
      const formState = {
        variables: {},
        values: {},
        props: {},
      };
      chai.assert.equal(evaluateOperand('variables.foo', formState), undefined);
      chai.assert.equal(evaluateOperand('values.foo', formState), undefined);
      chai.assert.equal(evaluateOperand('props.foo', formState), undefined);
    });

    it('variables - array', function () {
      const formState = {
        variables: {
          arr: [5, 3, 10],
        },
      };
      chai.assert.deepEqual(evaluateOperand('variables.arr', formState), [5, 3, 10]);
    });

    it('min function - 0 elements', function () {
      const formState = {
        variables: {
        },
      };
      chai.assert.equal(evaluateOperand('variables.foo:min', formState), undefined);
    });
    it('min function - 1 element', function () {
      const formState = {
        variables: {
          foo: 1,
        },
      };
      chai.assert.equal(evaluateOperand('variables.foo:min', formState), 1);
    });
    it('min function - 2 elements', function () {
      const formState = {
        variables: {
          foo: [3, 2, 4],
        },
      };
      chai.assert.equal(evaluateOperand('variables.foo:min', formState), 2);
    });
    it('min function - undefined elements', function () {
      const formState = {
        variables: {
          foo: [undefined, 5, 8, 7, undefined, 6],
        },
      };
      chai.assert.equal(evaluateOperand('variables.foo:min', formState), 5);
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

    it('evaluate with success #2', function () {
      const formState = {
        values: {
          'foo-bar': 70,
        },
      };
      const rule = {
        any: [
          ['==', 'values.foo-bar', 70],
        ],
        then: [['set', 'baz', 2]],
      };
      const result = evaluateRule(rule, formState);
      chai.assert.deepEqual(result, [['set', 'baz', 2]]);
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

    it('should be false: first is false', function () {
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

    it('shoul be false: first is true, second is false', function () {
      const rule = {
        // family score: single parent with pregnancy
        id: 'singePregnancy',
        all: [
          ['==', 'props.parent2.skip', 1],
          ['==', 'values.currentPregnancy', 'y'],
        ],
        then: [['set', 'foo', 3]],
      };
      const formState = {
        props: {
          'parent2.skip': 1,
        },
        values: {},
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

  describe('custom rules', function () {
    it('rule chaining', function () {
      const item = {
        id: 'test',
        rules: [
          {
            any: [['==', 'variables.foo', 1]],
            then: [['set', 'bar', 1]],
          },
          {
            any: [['==', 'variables.bar', 1]],
            then: [['set', 'baz', 1]],
          },
        ],
      };
      const formState = {
        variables: {
          foo: 1,
          bar: 0,
          baz: 0,
        },
      };
      const result = evaluateRules(item, formState);
      chai.assert.equal(result.variables.baz, 1);
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

