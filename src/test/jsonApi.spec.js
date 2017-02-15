/* eslint-env node, mocha */

import chai from 'chai';
const expect = chai.expect;

import { JSONApi } from '../index';
import { TestType } from './testType';
import { jsonApiSample as sample } from './jsonApiSample.js';

const api = new JSONApi({ schemata: TestType, baseURL: 'https://example.com/api' });
const one = {
  type: 'tests',
  id: 1,
  name: 'potato',
  extended: {},
  children: [{ id: 2 }],
};
const two = {
  type: 'tests',
  id: 2,
  name: 'frotato',
  extended: { cohort: 2013 },
  children: [{ id: 3 }],
};
const three = {
  type: 'tests',
  id: 3,
  name: 'rutabaga',
  extended: {},
};

describe('JSON API', () => {
  describe('Encoding', () => {
    it('should encode a model with no children', () => {
      expect(JSON.parse(JSON.stringify(api.encode({ root: three, extended: [] }))))
      .to.deep.equal({
        data: {
          type: 'tests',
          id: 3,
          attributes: { name: 'rutabaga', extended: {} },
          relationships: {},
          links: { self: 'https://example.com/api/tests/3' },
        },
        included: [],
      });
    });

    it('should encode a model with children', () => {
      expect(JSON.parse(JSON.stringify(api.encode({
        root: one,
        extended: [two, three],
      }))))
      .to.deep.equal(sample);
    });
  });

  describe('Parsing', () => {
    it('should parse a returned document with no included data', () => {
      expect(api.parse({
        data: {
          type: 'tests',
          id: 3,
          attributes: { name: 'rutabaga', extended: {} },
          relationships: {},
          links: { self: 'https://example.com/api/tests/3' },
        },
        included: [],
      })).to.deep.equal({ root: three, extended: [] });
    });

    it('should parse a returned document with included data', () => {
      expect(api.parse(sample)).to.deep.equal({
        root: one,
        extended: [two, three],
      });
    });
  });
});
