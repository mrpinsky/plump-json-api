'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _jsonApi = require('../jsonApi');

var _testType = require('./testType');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import chaiAsPromised from 'chai-as-promised';

// chai.use(chaiAsPromised);
/* eslint-env node, mocha */

var expect = _chai2.default.expect;

describe('JSON API', function () {
  it('should encode a model with all extended data in included', function () {
    var api = new _jsonApi.JSONApi({ schemata: _testType.TestType });

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5qcyJdLCJuYW1lcyI6WyJleHBlY3QiLCJkZXNjcmliZSIsIml0IiwiYXBpIiwic2NoZW1hdGEiLCJyb290IiwidHlwZSIsImlkIiwibmFtZSIsImV4dGVuZGVkIiwiY2hpbGRyZW4iLCJwYXJlbnRfaWQiLCJjaGlsZF9pZCIsImNvaG9ydCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImVuY29kZSIsImRvbWFpbiIsInBhdGgiLCJ0byIsImRlZXAiLCJlcXVhbCIsInJlYWRGaWxlU3luYyJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUNBOzs7O0FBTUE7O0FBQ0E7Ozs7QUFOQTs7QUFFQTtBQU5BOztBQU9BLElBQU1BLFNBQVMsZUFBS0EsTUFBcEI7O0FBS0FDLFNBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCQyxLQUFHLDBEQUFILEVBQStELFlBQU07QUFDbkUsUUFBTUMsTUFBTSxxQkFBWSxFQUFFQyw0QkFBRixFQUFaLENBQVo7O0FBRUEsUUFBTUMsT0FBTztBQUNYQyxZQUFNLE9BREs7QUFFWEMsVUFBSSxDQUZPO0FBR1hDLFlBQU0sUUFISztBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLENBQUMsRUFBRUMsV0FBVyxDQUFiLEVBQWdCQyxVQUFVLENBQTFCLEVBQUQ7QUFMQyxLQUFiO0FBT0EsUUFBTUgsV0FBVztBQUNmQyxnQkFBVSxDQUNSO0FBQ0VKLGNBQU0sT0FEUjtBQUVFQyxZQUFJLENBRk47QUFHRUMsY0FBTSxTQUhSO0FBSUVDLGtCQUFVLEVBQUVJLFFBQVEsSUFBVixFQUpaO0FBS0VILGtCQUFVLENBQUMsRUFBRUMsV0FBVyxDQUFiLEVBQWdCQyxVQUFVLENBQTFCLEVBQUQ7QUFMWixPQURRLEVBUVI7QUFDRU4sY0FBTSxPQURSO0FBRUVDLFlBQUksQ0FGTjtBQUdFQyxjQUFNLFVBSFI7QUFJRUMsa0JBQVU7QUFKWixPQVJRO0FBREssS0FBakI7O0FBa0JBVCxXQUFPYyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZWIsSUFBSWMsTUFBSixDQUFXLEVBQUVaLFVBQUYsRUFBUUksa0JBQVIsRUFBWCxFQUErQixFQUFFUyxRQUFRLHFCQUFWLEVBQWlDQyxNQUFNLE1BQXZDLEVBQS9CLENBQWYsQ0FBWCxDQUFQLEVBQ0NDLEVBREQsQ0FDSUMsSUFESixDQUNTQyxLQURULENBQ2VSLEtBQUtDLEtBQUwsQ0FBVyxhQUFHUSxZQUFILENBQWdCLDhCQUFoQixDQUFYLENBRGY7QUFFRCxHQTlCRDtBQStCRCxDQWhDRCIsImZpbGUiOiJ0ZXN0L2pzb25BcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG5vZGUsIG1vY2hhICovXG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbi8vIGltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcblxuLy8gY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XG5cbmltcG9ydCB7IEpTT05BcGkgfSBmcm9tICcuLi9qc29uQXBpJztcbmltcG9ydCB7IFRlc3RUeXBlIH0gZnJvbSAnLi90ZXN0VHlwZSc7XG5cbmRlc2NyaWJlKCdKU09OIEFQSScsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBlbmNvZGUgYSBtb2RlbCB3aXRoIGFsbCBleHRlbmRlZCBkYXRhIGluIGluY2x1ZGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwaSA9IG5ldyBKU09OQXBpKHsgc2NoZW1hdGE6IFRlc3RUeXBlIH0pO1xuXG4gICAgY29uc3Qgcm9vdCA9IHtcbiAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICBpZDogMSxcbiAgICAgIG5hbWU6ICdwb3RhdG8nLFxuICAgICAgZXh0ZW5kZWQ6IHt9LFxuICAgICAgY2hpbGRyZW46IFt7IHBhcmVudF9pZDogMSwgY2hpbGRfaWQ6IDIgfV0sXG4gICAgfTtcbiAgICBjb25zdCBleHRlbmRlZCA9IHtcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICAgIGlkOiAyLFxuICAgICAgICAgIG5hbWU6ICdmcm90YXRvJyxcbiAgICAgICAgICBleHRlbmRlZDogeyBjb2hvcnQ6IDIwMTMgfSxcbiAgICAgICAgICBjaGlsZHJlbjogW3sgcGFyZW50X2lkOiAyLCBjaGlsZF9pZDogMyB9XSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgbmFtZTogJ3J1dGFiYWdhJyxcbiAgICAgICAgICBleHRlbmRlZDoge30sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG5cbiAgICBleHBlY3QoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcGkuZW5jb2RlKHsgcm9vdCwgZXh0ZW5kZWQgfSwgeyBkb21haW46ICdodHRwczovL2V4YW1wbGUuY29tJywgcGF0aDogJy9hcGknIH0pKSkpXG4gICAgLnRvLmRlZXAuZXF1YWwoSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoJ3NyYy90ZXN0L2pzb25BcGlFeGFtcGxlLmpzb24nKSkpO1xuICB9KTtcbn0pO1xuIl19
