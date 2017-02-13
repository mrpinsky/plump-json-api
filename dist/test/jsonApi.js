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
  var api = new _index.JSONApi({ schemata: _testType.TestType });
  var sample = _fs2.default.readFileSync('src/test/jsonApiSample.json');

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

  it('should encode a model with all extended data in included', function () {
    expect(JSON.parse(JSON.stringify(api.encode({ root: root, extended: extended }, { domain: 'https://example.com', path: '/api' })))).to.deep.equal(JSON.parse(sample));
  });

  it('should parse a returned document into component model data', function () {
    expect(api.parse(JSON.parse(sample))).to.deep.equal({
      root: root,
      extended: extended.children
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5qcyJdLCJuYW1lcyI6WyJleHBlY3QiLCJkZXNjcmliZSIsImFwaSIsInNjaGVtYXRhIiwic2FtcGxlIiwicmVhZEZpbGVTeW5jIiwicm9vdCIsInR5cGUiLCJpZCIsIm5hbWUiLCJleHRlbmRlZCIsImNoaWxkcmVuIiwicGFyZW50X2lkIiwiY2hpbGRfaWQiLCJjb2hvcnQiLCJpdCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImVuY29kZSIsImRvbWFpbiIsInBhdGgiLCJ0byIsImRlZXAiLCJlcXVhbCJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUNBOzs7O0FBTUE7O0FBQ0E7Ozs7QUFOQTs7QUFFQTtBQU5BOztBQU9BLElBQU1BLFNBQVMsZUFBS0EsTUFBcEI7O0FBS0FDLFNBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCLE1BQU1DLE1BQU0sbUJBQVksRUFBRUMsNEJBQUYsRUFBWixDQUFaO0FBQ0EsTUFBTUMsU0FBUyxhQUFHQyxZQUFILENBQWdCLDZCQUFoQixDQUFmOztBQUVBLE1BQU1DLE9BQU87QUFDWEMsVUFBTSxPQURLO0FBRVhDLFFBQUksQ0FGTztBQUdYQyxVQUFNLFFBSEs7QUFJWEMsY0FBVSxFQUpDO0FBS1hDLGNBQVUsQ0FBQyxFQUFFQyxXQUFXLENBQWIsRUFBZ0JDLFVBQVUsQ0FBMUIsRUFBRDtBQUxDLEdBQWI7QUFPQSxNQUFNSCxXQUFXO0FBQ2ZDLGNBQVUsQ0FDUjtBQUNFSixZQUFNLE9BRFI7QUFFRUMsVUFBSSxDQUZOO0FBR0VDLFlBQU0sU0FIUjtBQUlFQyxnQkFBVSxFQUFFSSxRQUFRLElBQVYsRUFKWjtBQUtFSCxnQkFBVSxDQUFDLEVBQUVDLFdBQVcsQ0FBYixFQUFnQkMsVUFBVSxDQUExQixFQUFEO0FBTFosS0FEUSxFQVFSO0FBQ0VOLFlBQU0sT0FEUjtBQUVFQyxVQUFJLENBRk47QUFHRUMsWUFBTSxVQUhSO0FBSUVDLGdCQUFVO0FBSlosS0FSUTtBQURLLEdBQWpCOztBQWtCQUssS0FBRywwREFBSCxFQUErRCxZQUFNO0FBQ25FZixXQUFPZ0IsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVoQixJQUFJaUIsTUFBSixDQUFXLEVBQUViLFVBQUYsRUFBUUksa0JBQVIsRUFBWCxFQUErQixFQUFFVSxRQUFRLHFCQUFWLEVBQWlDQyxNQUFNLE1BQXZDLEVBQS9CLENBQWYsQ0FBWCxDQUFQLEVBQ0NDLEVBREQsQ0FDSUMsSUFESixDQUNTQyxLQURULENBQ2VSLEtBQUtDLEtBQUwsQ0FBV2IsTUFBWCxDQURmO0FBRUQsR0FIRDs7QUFLQVcsS0FBRyw0REFBSCxFQUFpRSxZQUFNO0FBQ3JFZixXQUFPRSxJQUFJZSxLQUFKLENBQVVELEtBQUtDLEtBQUwsQ0FBV2IsTUFBWCxDQUFWLENBQVAsRUFBc0NrQixFQUF0QyxDQUF5Q0MsSUFBekMsQ0FBOENDLEtBQTlDLENBQW9EO0FBQ2xEbEIsWUFBTUEsSUFENEM7QUFFbERJLGdCQUFVQSxTQUFTQztBQUYrQixLQUFwRDtBQUlELEdBTEQ7QUFNRCxDQXhDRCIsImZpbGUiOiJ0ZXN0L2pzb25BcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG5vZGUsIG1vY2hhICovXG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbi8vIGltcG9ydCBjaGFpQXNQcm9taXNlZCBmcm9tICdjaGFpLWFzLXByb21pc2VkJztcblxuLy8gY2hhaS51c2UoY2hhaUFzUHJvbWlzZWQpO1xuY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XG5cbmltcG9ydCB7IEpTT05BcGkgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBUZXN0VHlwZSB9IGZyb20gJy4vdGVzdFR5cGUnO1xuXG5kZXNjcmliZSgnSlNPTiBBUEknLCAoKSA9PiB7XG4gIGNvbnN0IGFwaSA9IG5ldyBKU09OQXBpKHsgc2NoZW1hdGE6IFRlc3RUeXBlIH0pO1xuICBjb25zdCBzYW1wbGUgPSBmcy5yZWFkRmlsZVN5bmMoJ3NyYy90ZXN0L2pzb25BcGlTYW1wbGUuanNvbicpO1xuXG4gIGNvbnN0IHJvb3QgPSB7XG4gICAgdHlwZTogJ3Rlc3RzJyxcbiAgICBpZDogMSxcbiAgICBuYW1lOiAncG90YXRvJyxcbiAgICBleHRlbmRlZDoge30sXG4gICAgY2hpbGRyZW46IFt7IHBhcmVudF9pZDogMSwgY2hpbGRfaWQ6IDIgfV0sXG4gIH07XG4gIGNvbnN0IGV4dGVuZGVkID0ge1xuICAgIGNoaWxkcmVuOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgIGlkOiAyLFxuICAgICAgICBuYW1lOiAnZnJvdGF0bycsXG4gICAgICAgIGV4dGVuZGVkOiB7IGNvaG9ydDogMjAxMyB9LFxuICAgICAgICBjaGlsZHJlbjogW3sgcGFyZW50X2lkOiAyLCBjaGlsZF9pZDogMyB9XSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgIGlkOiAzLFxuICAgICAgICBuYW1lOiAncnV0YWJhZ2EnLFxuICAgICAgICBleHRlbmRlZDoge30sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgaXQoJ3Nob3VsZCBlbmNvZGUgYSBtb2RlbCB3aXRoIGFsbCBleHRlbmRlZCBkYXRhIGluIGluY2x1ZGVkJywgKCkgPT4ge1xuICAgIGV4cGVjdChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFwaS5lbmNvZGUoeyByb290LCBleHRlbmRlZCB9LCB7IGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLCBwYXRoOiAnL2FwaScgfSkpKSlcbiAgICAudG8uZGVlcC5lcXVhbChKU09OLnBhcnNlKHNhbXBsZSkpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHBhcnNlIGEgcmV0dXJuZWQgZG9jdW1lbnQgaW50byBjb21wb25lbnQgbW9kZWwgZGF0YScsICgpID0+IHtcbiAgICBleHBlY3QoYXBpLnBhcnNlKEpTT04ucGFyc2Uoc2FtcGxlKSkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgcm9vdDogcm9vdCxcbiAgICAgIGV4dGVuZGVkOiBleHRlbmRlZC5jaGlsZHJlbixcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
