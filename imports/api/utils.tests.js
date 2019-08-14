/* eslint prefer-arrow-callback: "off", func-names: "off" */
import { chai } from 'meteor/practicalmeteor:chai';
import { escapeKeys } from './utils';

describe('utils', function () {
  describe('escapeKeys', function () {
    it('works for flat object', function () {
      const obj = {
        'first.name': 'John',
      };
      const escaped = {
        'first::name': 'John',
      };
      chai.assert.deepEqual(escapeKeys(obj), escaped);
    });

    it('works for flat array', function () {
      const obj = [{
        'first.name': 'John',
      }];
      const escaped = [{
        'first::name': 'John',
      }];
      chai.assert.deepEqual(escapeKeys(obj), escaped);
    });

    it('does nothing for simple types', function () {
      chai.assert.deepEqual(escapeKeys(1), 1);
      chai.assert.deepEqual(escapeKeys(1.5), 1.5);
      chai.assert.deepEqual(escapeKeys('abc'), 'abc');
      chai.assert.deepEqual(escapeKeys(true), true);
      chai.assert.deepEqual(escapeKeys(null), null);
      chai.assert.deepEqual(escapeKeys(undefined), undefined);
    });

    it('does nothing for array of simple types', function () {
      const arr = [1, 2.0, 'string', true, null, undefined];
      const escaped = [...arr];
      chai.assert.deepEqual(escapeKeys(arr), escaped);
    });

    it('works recursively', function () {
      const obj = {
        'first.name': 'John',
        'contacts.list': [1, 2, 3, { 'last.name': 'Doe' }],
      };
      const escaped = {
        'first::name': 'John',
        'contacts::list': [1, 2, 3, { 'last::name': 'Doe' }],
      };
      chai.assert.deepEqual(escapeKeys(obj), escaped);
    });
  });
});
