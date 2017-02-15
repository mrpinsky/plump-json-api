/* eslint-env node, mocha */

import fs from 'fs';
import chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';

// chai.use(chaiAsPromised);
const expect = chai.expect;

import { JSONApi } from '../index';
import { TestType } from './testType';
import { sample } from './jsonApiSample';

describe('JSON API', () => {
  const api = new JSONApi({ schemata: TestType });
  const apiOpts = { domain: 'https://example.com', path: '/api' };

  const one = {
    type: 'tests',
    id: 1,
    name: 'potato',
    extended: {},
    children: [{ parent_id: 1, child_id: 2 }],
  };
  const two = {
    type: 'tests',
    id: 2,
    name: 'frotato',
    extended: { cohort: 2013 },
    children: [{ parent_id: 2, child_id: 3 }],
  };
  const three = {
    type: 'tests',
    id: 3,
    name: 'rutabaga',
    extended: {},
  };

  describe('Encoding', () => {
    it('should encode a model with no children', () => {
      expect(JSON.parse(JSON.stringify(api.encode({ root: three, extended: {} }, apiOpts))))
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
        extended: { children: [two, three] },
      }, apiOpts))))
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
      })).to.deep.equal(three);
    });

    it('should parse a returned document with included data', () => {
      expect(api.parse(sample)).to.deep.equal({
        root: root,
        extended: [two, three],
      });
    });
  });
});
