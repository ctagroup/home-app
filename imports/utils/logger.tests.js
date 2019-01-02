/* eslint prefer-arrow-callback: "off", func-names: "off" */
import chai from 'chai';
import { sanitize } from './logger';

describe('logger', function () {
  describe('sanitize', function () {
    it('sanitizes object', function () {
      const obj = {
        name: 'foo',
        password: 'bar',
      };
      const sanitized = {
        name: 'foo',
        password: '*****',
      };
      chai.assert.deepEqual(sanitize(obj), sanitized);
    });

    it('sanitizes nested object', function () {
      const obj = {
        name: 'foo',
        foo: {
          password: 'bar',
        },
      };
      const sanitized = {
        name: 'foo',
        foo: {
          password: '*****',
        },
      };
      chai.assert.deepEqual(sanitize(obj), sanitized);
    });

    it('sanitizes nested array of object', function () {
      const obj = {
        name: 'foo',
        foo: [{ password: 'bar' }, { password: 'baz' }],
      };
      const sanitized = {
        name: 'foo',
        foo: [{ password: '*****' }, { password: '*****' }],
      };
      chai.assert.deepEqual(sanitize(obj), sanitized);
    });
  });
});
