'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../index');

var _testType = require('./testType');

var _jsonApiSample = require('./jsonApiSample');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import chaiAsPromised from 'chai-as-promised';

// chai.use(chaiAsPromised);
/* eslint-env node, mocha */

var expect = _chai2.default.expect;

describe('JSON API', function () {
  var api = new _index.JSONApi({ schemata: _testType.TestType });
  var apiOpts = { domain: 'https://example.com', path: '/api' };

  var one = {
    type: 'tests',
    id: 1,
    name: 'potato',
    extended: {},
    children: [{ parent_id: 1, child_id: 2 }]
  };
  var two = {
    type: 'tests',
    id: 2,
    name: 'frotato',
    extended: { cohort: 2013 },
    children: [{ parent_id: 2, child_id: 3 }]
  };
  var three = {
    type: 'tests',
    id: 3,
    name: 'rutabaga',
    extended: {}
  };

  describe('Encoding', function () {
    it('should encode a model with no children', function () {
      expect(JSON.parse(JSON.stringify(api.encode({ root: three, extended: {} }, apiOpts)))).to.deep.equal({
        data: {
          type: 'tests',
          id: 3,
          attributes: { name: 'rutabaga', extended: {} },
          relationships: {},
          links: { self: 'https://example.com/api/tests/3' }
        },
        included: []
      });
    });

    it('should encode a model with children', function () {
      expect(JSON.parse(JSON.stringify(api.encode({
        root: one,
        extended: { children: [two, three] }
      }, apiOpts)))).to.deep.equal(_jsonApiSample.sample);
    });
  });

  describe('Parsing', function () {
    it('should parse a returned document with no included data', function () {
      expect(api.parse({
        data: {
          type: 'tests',
          id: 3,
          attributes: { name: 'rutabaga', extended: {} },
          relationships: {},
          links: { self: 'https://example.com/api/tests/3' }
        },
        included: []
      })).to.deep.equal(three);
    });

    it('should parse a returned document with included data', function () {
      expect(api.parse(_jsonApiSample.sample)).to.deep.equal({
        root: root,
        extended: [two, three]
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5qcyJdLCJuYW1lcyI6WyJleHBlY3QiLCJkZXNjcmliZSIsImFwaSIsInNjaGVtYXRhIiwiYXBpT3B0cyIsImRvbWFpbiIsInBhdGgiLCJvbmUiLCJ0eXBlIiwiaWQiLCJuYW1lIiwiZXh0ZW5kZWQiLCJjaGlsZHJlbiIsInBhcmVudF9pZCIsImNoaWxkX2lkIiwidHdvIiwiY29ob3J0IiwidGhyZWUiLCJpdCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImVuY29kZSIsInJvb3QiLCJ0byIsImRlZXAiLCJlcXVhbCIsImRhdGEiLCJhdHRyaWJ1dGVzIiwicmVsYXRpb25zaGlwcyIsImxpbmtzIiwic2VsZiIsImluY2x1ZGVkIl0sIm1hcHBpbmdzIjoiOztBQUVBOzs7O0FBQ0E7Ozs7QUFNQTs7QUFDQTs7QUFDQTs7OztBQVBBOztBQUVBO0FBTkE7O0FBT0EsSUFBTUEsU0FBUyxlQUFLQSxNQUFwQjs7QUFNQUMsU0FBUyxVQUFULEVBQXFCLFlBQU07QUFDekIsTUFBTUMsTUFBTSxtQkFBWSxFQUFFQyw0QkFBRixFQUFaLENBQVo7QUFDQSxNQUFNQyxVQUFVLEVBQUVDLFFBQVEscUJBQVYsRUFBaUNDLE1BQU0sTUFBdkMsRUFBaEI7O0FBRUEsTUFBTUMsTUFBTTtBQUNWQyxVQUFNLE9BREk7QUFFVkMsUUFBSSxDQUZNO0FBR1ZDLFVBQU0sUUFISTtBQUlWQyxjQUFVLEVBSkE7QUFLVkMsY0FBVSxDQUFDLEVBQUVDLFdBQVcsQ0FBYixFQUFnQkMsVUFBVSxDQUExQixFQUFEO0FBTEEsR0FBWjtBQU9BLE1BQU1DLE1BQU07QUFDVlAsVUFBTSxPQURJO0FBRVZDLFFBQUksQ0FGTTtBQUdWQyxVQUFNLFNBSEk7QUFJVkMsY0FBVSxFQUFFSyxRQUFRLElBQVYsRUFKQTtBQUtWSixjQUFVLENBQUMsRUFBRUMsV0FBVyxDQUFiLEVBQWdCQyxVQUFVLENBQTFCLEVBQUQ7QUFMQSxHQUFaO0FBT0EsTUFBTUcsUUFBUTtBQUNaVCxVQUFNLE9BRE07QUFFWkMsUUFBSSxDQUZRO0FBR1pDLFVBQU0sVUFITTtBQUlaQyxjQUFVO0FBSkUsR0FBZDs7QUFPQVYsV0FBUyxVQUFULEVBQXFCLFlBQU07QUFDekJpQixPQUFHLHdDQUFILEVBQTZDLFlBQU07QUFDakRsQixhQUFPbUIsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVuQixJQUFJb0IsTUFBSixDQUFXLEVBQUVDLE1BQU1OLEtBQVIsRUFBZU4sVUFBVSxFQUF6QixFQUFYLEVBQTBDUCxPQUExQyxDQUFmLENBQVgsQ0FBUCxFQUNDb0IsRUFERCxDQUNJQyxJQURKLENBQ1NDLEtBRFQsQ0FDZTtBQUNiQyxjQUFNO0FBQ0puQixnQkFBTSxPQURGO0FBRUpDLGNBQUksQ0FGQTtBQUdKbUIsc0JBQVksRUFBRWxCLE1BQU0sVUFBUixFQUFvQkMsVUFBVSxFQUE5QixFQUhSO0FBSUprQix5QkFBZSxFQUpYO0FBS0pDLGlCQUFPLEVBQUVDLE1BQU0saUNBQVI7QUFMSCxTQURPO0FBUWJDLGtCQUFVO0FBUkcsT0FEZjtBQVdELEtBWkQ7O0FBY0FkLE9BQUcscUNBQUgsRUFBMEMsWUFBTTtBQUM5Q2xCLGFBQU9tQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZW5CLElBQUlvQixNQUFKLENBQVc7QUFDMUNDLGNBQU1oQixHQURvQztBQUUxQ0ksa0JBQVUsRUFBRUMsVUFBVSxDQUFDRyxHQUFELEVBQU1FLEtBQU4sQ0FBWjtBQUZnQyxPQUFYLEVBRzlCYixPQUg4QixDQUFmLENBQVgsQ0FBUCxFQUlDb0IsRUFKRCxDQUlJQyxJQUpKLENBSVNDLEtBSlQ7QUFLRCxLQU5EO0FBT0QsR0F0QkQ7O0FBd0JBekIsV0FBUyxTQUFULEVBQW9CLFlBQU07QUFDeEJpQixPQUFHLHdEQUFILEVBQTZELFlBQU07QUFDakVsQixhQUFPRSxJQUFJa0IsS0FBSixDQUFVO0FBQ2ZPLGNBQU07QUFDSm5CLGdCQUFNLE9BREY7QUFFSkMsY0FBSSxDQUZBO0FBR0ptQixzQkFBWSxFQUFFbEIsTUFBTSxVQUFSLEVBQW9CQyxVQUFVLEVBQTlCLEVBSFI7QUFJSmtCLHlCQUFlLEVBSlg7QUFLSkMsaUJBQU8sRUFBRUMsTUFBTSxpQ0FBUjtBQUxILFNBRFM7QUFRZkMsa0JBQVU7QUFSSyxPQUFWLENBQVAsRUFTSVIsRUFUSixDQVNPQyxJQVRQLENBU1lDLEtBVFosQ0FTa0JULEtBVGxCO0FBVUQsS0FYRDs7QUFhQUMsT0FBRyxxREFBSCxFQUEwRCxZQUFNO0FBQzlEbEIsYUFBT0UsSUFBSWtCLEtBQUosdUJBQVAsRUFBMEJJLEVBQTFCLENBQTZCQyxJQUE3QixDQUFrQ0MsS0FBbEMsQ0FBd0M7QUFDdENILGNBQU1BLElBRGdDO0FBRXRDWixrQkFBVSxDQUFDSSxHQUFELEVBQU1FLEtBQU47QUFGNEIsT0FBeEM7QUFJRCxLQUxEO0FBTUQsR0FwQkQ7QUFxQkQsQ0F0RUQiLCJmaWxlIjoidGVzdC9qc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBub2RlLCBtb2NoYSAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IGNoYWkgZnJvbSAnY2hhaSc7XG4vLyBpbXBvcnQgY2hhaUFzUHJvbWlzZWQgZnJvbSAnY2hhaS1hcy1wcm9taXNlZCc7XG5cbi8vIGNoYWkudXNlKGNoYWlBc1Byb21pc2VkKTtcbmNvbnN0IGV4cGVjdCA9IGNoYWkuZXhwZWN0O1xuXG5pbXBvcnQgeyBKU09OQXBpIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgVGVzdFR5cGUgfSBmcm9tICcuL3Rlc3RUeXBlJztcbmltcG9ydCB7IHNhbXBsZSB9IGZyb20gJy4vanNvbkFwaVNhbXBsZSc7XG5cbmRlc2NyaWJlKCdKU09OIEFQSScsICgpID0+IHtcbiAgY29uc3QgYXBpID0gbmV3IEpTT05BcGkoeyBzY2hlbWF0YTogVGVzdFR5cGUgfSk7XG4gIGNvbnN0IGFwaU9wdHMgPSB7IGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLCBwYXRoOiAnL2FwaScgfTtcblxuICBjb25zdCBvbmUgPSB7XG4gICAgdHlwZTogJ3Rlc3RzJyxcbiAgICBpZDogMSxcbiAgICBuYW1lOiAncG90YXRvJyxcbiAgICBleHRlbmRlZDoge30sXG4gICAgY2hpbGRyZW46IFt7IHBhcmVudF9pZDogMSwgY2hpbGRfaWQ6IDIgfV0sXG4gIH07XG4gIGNvbnN0IHR3byA9IHtcbiAgICB0eXBlOiAndGVzdHMnLFxuICAgIGlkOiAyLFxuICAgIG5hbWU6ICdmcm90YXRvJyxcbiAgICBleHRlbmRlZDogeyBjb2hvcnQ6IDIwMTMgfSxcbiAgICBjaGlsZHJlbjogW3sgcGFyZW50X2lkOiAyLCBjaGlsZF9pZDogMyB9XSxcbiAgfTtcbiAgY29uc3QgdGhyZWUgPSB7XG4gICAgdHlwZTogJ3Rlc3RzJyxcbiAgICBpZDogMyxcbiAgICBuYW1lOiAncnV0YWJhZ2EnLFxuICAgIGV4dGVuZGVkOiB7fSxcbiAgfTtcblxuICBkZXNjcmliZSgnRW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBlbmNvZGUgYSBtb2RlbCB3aXRoIG5vIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXBpLmVuY29kZSh7IHJvb3Q6IHRocmVlLCBleHRlbmRlZDoge30gfSwgYXBpT3B0cykpKSlcbiAgICAgIC50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgICAgaWQ6IDMsXG4gICAgICAgICAgYXR0cmlidXRlczogeyBuYW1lOiAncnV0YWJhZ2EnLCBleHRlbmRlZDoge30gfSxcbiAgICAgICAgICByZWxhdGlvbnNoaXBzOiB7fSxcbiAgICAgICAgICBsaW5rczogeyBzZWxmOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hcGkvdGVzdHMvMycgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaW5jbHVkZWQ6IFtdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGVuY29kZSBhIG1vZGVsIHdpdGggY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcGkuZW5jb2RlKHtcbiAgICAgICAgcm9vdDogb25lLFxuICAgICAgICBleHRlbmRlZDogeyBjaGlsZHJlbjogW3R3bywgdGhyZWVdIH0sXG4gICAgICB9LCBhcGlPcHRzKSkpKVxuICAgICAgLnRvLmRlZXAuZXF1YWwoc2FtcGxlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1BhcnNpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBhIHJldHVybmVkIGRvY3VtZW50IHdpdGggbm8gaW5jbHVkZWQgZGF0YScsICgpID0+IHtcbiAgICAgIGV4cGVjdChhcGkucGFyc2Uoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgICBpZDogMyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7IG5hbWU6ICdydXRhYmFnYScsIGV4dGVuZGVkOiB7fSB9LFxuICAgICAgICAgIHJlbGF0aW9uc2hpcHM6IHt9LFxuICAgICAgICAgIGxpbmtzOiB7IHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8zJyB9LFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlZDogW10sXG4gICAgICB9KSkudG8uZGVlcC5lcXVhbCh0aHJlZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGEgcmV0dXJuZWQgZG9jdW1lbnQgd2l0aCBpbmNsdWRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGFwaS5wYXJzZShzYW1wbGUpKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgcm9vdDogcm9vdCxcbiAgICAgICAgZXh0ZW5kZWQ6IFt0d28sIHRocmVlXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
