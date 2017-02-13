'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../index');

var _testType = require('./testType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import chaiAsPromised from 'chai-as-promised';

// chai.use(chaiAsPromised);
/* eslint-env node, mocha */

var expect = _chai2.default.expect;

describe('JSON API', function () {
  it('should encode a model with all extended data in included', function () {
    var api = new _index.JSONApi({ schemata: _testType.TestType });

    var root = {
      type: 'tests',
      id: 1,
      name: 'potato',
      extended: {},
      children: [{ parent_id: 1, child_id: 2 }]
    };
    var extended = {
      children: [{
        type: 'tests',
        id: 2,
        name: 'frotato',
        extended: { cohort: 2013 },
        children: [{ parent_id: 2, child_id: 3 }]
      }, {
        type: 'tests',
        id: 3,
        name: 'rutabaga',
        extended: {}
      }]
    };

    expect(JSON.parse(JSON.stringify(api.encode({ root: root, extended: extended }, { domain: 'https://example.com', path: '/api' })))).to.deep.equal(JSON.parse(_fs2.default.readFileSync('src/test/jsonApiExample.json')));
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5qcyJdLCJuYW1lcyI6WyJleHBlY3QiLCJkZXNjcmliZSIsIml0IiwiYXBpIiwic2NoZW1hdGEiLCJyb290IiwidHlwZSIsImlkIiwibmFtZSIsImV4dGVuZGVkIiwiY2hpbGRyZW4iLCJwYXJlbnRfaWQiLCJjaGlsZF9pZCIsImNvaG9ydCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImVuY29kZSIsImRvbWFpbiIsInBhdGgiLCJ0byIsImRlZXAiLCJlcXVhbCIsInJlYWRGaWxlU3luYyJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUNBOzs7O0FBTUE7O0FBQ0E7Ozs7QUFOQTs7QUFFQTtBQU5BOztBQU9BLElBQU1BLFNBQVMsZUFBS0EsTUFBcEI7O0FBS0FDLFNBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCQyxLQUFHLDBEQUFILEVBQStELFlBQU07QUFDbkUsUUFBTUMsTUFBTSxtQkFBWSxFQUFFQyw0QkFBRixFQUFaLENBQVo7O0FBRUEsUUFBTUMsT0FBTztBQUNYQyxZQUFNLE9BREs7QUFFWEMsVUFBSSxDQUZPO0FBR1hDLFlBQU0sUUFISztBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLENBQUMsRUFBRUMsV0FBVyxDQUFiLEVBQWdCQyxVQUFVLENBQTFCLEVBQUQ7QUFMQyxLQUFiO0FBT0EsUUFBTUgsV0FBVztBQUNmQyxnQkFBVSxDQUNSO0FBQ0VKLGNBQU0sT0FEUjtBQUVFQyxZQUFJLENBRk47QUFHRUMsY0FBTSxTQUhSO0FBSUVDLGtCQUFVLEVBQUVJLFFBQVEsSUFBVixFQUpaO0FBS0VILGtCQUFVLENBQUMsRUFBRUMsV0FBVyxDQUFiLEVBQWdCQyxVQUFVLENBQTFCLEVBQUQ7QUFMWixPQURRLEVBUVI7QUFDRU4sY0FBTSxPQURSO0FBRUVDLFlBQUksQ0FGTjtBQUdFQyxjQUFNLFVBSFI7QUFJRUMsa0JBQVU7QUFKWixPQVJRO0FBREssS0FBakI7O0FBa0JBVCxXQUFPYyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZWIsSUFBSWMsTUFBSixDQUFXLEVBQUVaLFVBQUYsRUFBUUksa0JBQVIsRUFBWCxFQUErQixFQUFFUyxRQUFRLHFCQUFWLEVBQWlDQyxNQUFNLE1BQXZDLEVBQS9CLENBQWYsQ0FBWCxDQUFQLEVBQ0NDLEVBREQsQ0FDSUMsSUFESixDQUNTQyxLQURULENBQ2VSLEtBQUtDLEtBQUwsQ0FBVyxhQUFHUSxZQUFILENBQWdCLDhCQUFoQixDQUFYLENBRGY7QUFFRCxHQTlCRDtBQStCRCxDQWhDRCIsImZpbGUiOiJ0ZXN0L2pzb25BcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG5vZGUsIG1vY2hhICovXG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbi8vIGltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcblxuLy8gY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XG5cbmltcG9ydCB7IEpTT05BcGkgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBUZXN0VHlwZSB9IGZyb20gJy4vdGVzdFR5cGUnO1xuXG5kZXNjcmliZSgnSlNPTiBBUEknLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgZW5jb2RlIGEgbW9kZWwgd2l0aCBhbGwgZXh0ZW5kZWQgZGF0YSBpbiBpbmNsdWRlZCcsICgpID0+IHtcbiAgICBjb25zdCBhcGkgPSBuZXcgSlNPTkFwaSh7IHNjaGVtYXRhOiBUZXN0VHlwZSB9KTtcblxuICAgIGNvbnN0IHJvb3QgPSB7XG4gICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgaWQ6IDEsXG4gICAgICBuYW1lOiAncG90YXRvJyxcbiAgICAgIGV4dGVuZGVkOiB7fSxcbiAgICAgIGNoaWxkcmVuOiBbeyBwYXJlbnRfaWQ6IDEsIGNoaWxkX2lkOiAyIH1dLFxuICAgIH07XG4gICAgY29uc3QgZXh0ZW5kZWQgPSB7XG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgICBpZDogMixcbiAgICAgICAgICBuYW1lOiAnZnJvdGF0bycsXG4gICAgICAgICAgZXh0ZW5kZWQ6IHsgY29ob3J0OiAyMDEzIH0sXG4gICAgICAgICAgY2hpbGRyZW46IFt7IHBhcmVudF9pZDogMiwgY2hpbGRfaWQ6IDMgfV0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgIG5hbWU6ICdydXRhYmFnYScsXG4gICAgICAgICAgZXh0ZW5kZWQ6IHt9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuXG4gICAgZXhwZWN0KEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXBpLmVuY29kZSh7IHJvb3QsIGV4dGVuZGVkIH0sIHsgZG9tYWluOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsIHBhdGg6ICcvYXBpJyB9KSkpKVxuICAgIC50by5kZWVwLmVxdWFsKEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKCdzcmMvdGVzdC9qc29uQXBpRXhhbXBsZS5qc29uJykpKTtcbiAgfSk7XG59KTtcbiJdfQ==
