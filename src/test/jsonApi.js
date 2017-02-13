/* eslint-env node, mocha */

import fs from 'fs';
import chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';

// chai.use(chaiAsPromised);
const expect = chai.expect;

import { JSONApi } from '../index';
import { TestType } from './testType';

describe('JSON API', () => {
  it('should encode a model with all extended data in included', () => {
    const api = new JSONApi({ schemata: TestType });

    const root = {
      type: 'tests',
      id: 1,
      name: 'potato',
      extended: {},
      children: [{ parent_id: 1, child_id: 2 }],
    };
    const extended = {
      children: [
        {
          type: 'tests',
          id: 2,
          name: 'frotato',
          extended: { cohort: 2013 },
          children: [{ parent_id: 2, child_id: 3 }],
        },
        {
          type: 'tests',
          id: 3,
          name: 'rutabaga',
          extended: {},
        },
      ],
    };

    expect(JSON.parse(JSON.stringify(api.encode({ root, extended }, { domain: 'https://example.com', path: '/api' }))))
    .to.deep.equal(JSON.parse(fs.readFileSync('src/test/jsonApiExample.json')));
  });
});
