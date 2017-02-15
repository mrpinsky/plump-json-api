'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../index');

var _testType = require('./testType');

var _jsonApiSample = require('./jsonApiSample.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect; /* eslint-env node, mocha */

describe('JSON API', function () {
  var api = new _index.JSONApi({ schemata: _testType.TestType });
  var apiOpts = { domain: 'https://example.com', path: '/api' };

  var one = {
    type: 'tests',
    id: 1,
    name: 'potato',
    extended: {},
    children: [{ id: 2 }]
  };
  var two = {
    type: 'tests',
    id: 2,
    name: 'frotato',
    extended: { cohort: 2013 },
    children: [{ id: 3 }]
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
      }, apiOpts)))).to.deep.equal(_jsonApiSample.jsonApiSample);
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
      })).to.deep.equal({ root: three, extended: [] });
    });

    it('should parse a returned document with included data', function () {
      expect(api.parse(_jsonApiSample.jsonApiSample)).to.deep.equal({
        root: one,
        extended: [two, three]
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5qcyJdLCJuYW1lcyI6WyJleHBlY3QiLCJkZXNjcmliZSIsImFwaSIsInNjaGVtYXRhIiwiYXBpT3B0cyIsImRvbWFpbiIsInBhdGgiLCJvbmUiLCJ0eXBlIiwiaWQiLCJuYW1lIiwiZXh0ZW5kZWQiLCJjaGlsZHJlbiIsInR3byIsImNvaG9ydCIsInRocmVlIiwiaXQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJlbmNvZGUiLCJyb290IiwidG8iLCJkZWVwIiwiZXF1YWwiLCJkYXRhIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJsaW5rcyIsInNlbGYiLCJpbmNsdWRlZCJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUdBOztBQUNBOztBQUNBOzs7O0FBSkEsSUFBTUEsU0FBUyxlQUFLQSxNQUFwQixDLENBSEE7O0FBU0FDLFNBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCLE1BQU1DLE1BQU0sbUJBQVksRUFBRUMsNEJBQUYsRUFBWixDQUFaO0FBQ0EsTUFBTUMsVUFBVSxFQUFFQyxRQUFRLHFCQUFWLEVBQWlDQyxNQUFNLE1BQXZDLEVBQWhCOztBQUVBLE1BQU1DLE1BQU07QUFDVkMsVUFBTSxPQURJO0FBRVZDLFFBQUksQ0FGTTtBQUdWQyxVQUFNLFFBSEk7QUFJVkMsY0FBVSxFQUpBO0FBS1ZDLGNBQVUsQ0FBQyxFQUFFSCxJQUFJLENBQU4sRUFBRDtBQUxBLEdBQVo7QUFPQSxNQUFNSSxNQUFNO0FBQ1ZMLFVBQU0sT0FESTtBQUVWQyxRQUFJLENBRk07QUFHVkMsVUFBTSxTQUhJO0FBSVZDLGNBQVUsRUFBRUcsUUFBUSxJQUFWLEVBSkE7QUFLVkYsY0FBVSxDQUFDLEVBQUVILElBQUksQ0FBTixFQUFEO0FBTEEsR0FBWjtBQU9BLE1BQU1NLFFBQVE7QUFDWlAsVUFBTSxPQURNO0FBRVpDLFFBQUksQ0FGUTtBQUdaQyxVQUFNLFVBSE07QUFJWkMsY0FBVTtBQUpFLEdBQWQ7O0FBT0FWLFdBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCZSxPQUFHLHdDQUFILEVBQTZDLFlBQU07QUFDakRoQixhQUFPaUIsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVqQixJQUFJa0IsTUFBSixDQUFXLEVBQUVDLE1BQU1OLEtBQVIsRUFBZUosVUFBVSxFQUF6QixFQUFYLEVBQTBDUCxPQUExQyxDQUFmLENBQVgsQ0FBUCxFQUNDa0IsRUFERCxDQUNJQyxJQURKLENBQ1NDLEtBRFQsQ0FDZTtBQUNiQyxjQUFNO0FBQ0pqQixnQkFBTSxPQURGO0FBRUpDLGNBQUksQ0FGQTtBQUdKaUIsc0JBQVksRUFBRWhCLE1BQU0sVUFBUixFQUFvQkMsVUFBVSxFQUE5QixFQUhSO0FBSUpnQix5QkFBZSxFQUpYO0FBS0pDLGlCQUFPLEVBQUVDLE1BQU0saUNBQVI7QUFMSCxTQURPO0FBUWJDLGtCQUFVO0FBUkcsT0FEZjtBQVdELEtBWkQ7O0FBY0FkLE9BQUcscUNBQUgsRUFBMEMsWUFBTTtBQUM5Q2hCLGFBQU9pQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZWpCLElBQUlrQixNQUFKLENBQVc7QUFDMUNDLGNBQU1kLEdBRG9DO0FBRTFDSSxrQkFBVSxFQUFFQyxVQUFVLENBQUNDLEdBQUQsRUFBTUUsS0FBTixDQUFaO0FBRmdDLE9BQVgsRUFHOUJYLE9BSDhCLENBQWYsQ0FBWCxDQUFQLEVBSUNrQixFQUpELENBSUlDLElBSkosQ0FJU0MsS0FKVDtBQUtELEtBTkQ7QUFPRCxHQXRCRDs7QUF3QkF2QixXQUFTLFNBQVQsRUFBb0IsWUFBTTtBQUN4QmUsT0FBRyx3REFBSCxFQUE2RCxZQUFNO0FBQ2pFaEIsYUFBT0UsSUFBSWdCLEtBQUosQ0FBVTtBQUNmTyxjQUFNO0FBQ0pqQixnQkFBTSxPQURGO0FBRUpDLGNBQUksQ0FGQTtBQUdKaUIsc0JBQVksRUFBRWhCLE1BQU0sVUFBUixFQUFvQkMsVUFBVSxFQUE5QixFQUhSO0FBSUpnQix5QkFBZSxFQUpYO0FBS0pDLGlCQUFPLEVBQUVDLE1BQU0saUNBQVI7QUFMSCxTQURTO0FBUWZDLGtCQUFVO0FBUkssT0FBVixDQUFQLEVBU0lSLEVBVEosQ0FTT0MsSUFUUCxDQVNZQyxLQVRaLENBU2tCLEVBQUVILE1BQU1OLEtBQVIsRUFBZUosVUFBVSxFQUF6QixFQVRsQjtBQVVELEtBWEQ7O0FBYUFLLE9BQUcscURBQUgsRUFBMEQsWUFBTTtBQUM5RGhCLGFBQU9FLElBQUlnQixLQUFKLDhCQUFQLEVBQTBCSSxFQUExQixDQUE2QkMsSUFBN0IsQ0FBa0NDLEtBQWxDLENBQXdDO0FBQ3RDSCxjQUFNZCxHQURnQztBQUV0Q0ksa0JBQVUsQ0FBQ0UsR0FBRCxFQUFNRSxLQUFOO0FBRjRCLE9BQXhDO0FBSUQsS0FMRDtBQU1ELEdBcEJEO0FBcUJELENBdEVEIiwiZmlsZSI6InRlc3QvanNvbkFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgbm9kZSwgbW9jaGEgKi9cblxuaW1wb3J0IGNoYWkgZnJvbSAnY2hhaSc7XG5jb25zdCBleHBlY3QgPSBjaGFpLmV4cGVjdDtcblxuaW1wb3J0IHsgSlNPTkFwaSB9IGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7IFRlc3RUeXBlIH0gZnJvbSAnLi90ZXN0VHlwZSc7XG5pbXBvcnQgeyBqc29uQXBpU2FtcGxlIGFzIHNhbXBsZSB9IGZyb20gJy4vanNvbkFwaVNhbXBsZS5qcyc7XG5cbmRlc2NyaWJlKCdKU09OIEFQSScsICgpID0+IHtcbiAgY29uc3QgYXBpID0gbmV3IEpTT05BcGkoeyBzY2hlbWF0YTogVGVzdFR5cGUgfSk7XG4gIGNvbnN0IGFwaU9wdHMgPSB7IGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLCBwYXRoOiAnL2FwaScgfTtcblxuICBjb25zdCBvbmUgPSB7XG4gICAgdHlwZTogJ3Rlc3RzJyxcbiAgICBpZDogMSxcbiAgICBuYW1lOiAncG90YXRvJyxcbiAgICBleHRlbmRlZDoge30sXG4gICAgY2hpbGRyZW46IFt7IGlkOiAyIH1dLFxuICB9O1xuICBjb25zdCB0d28gPSB7XG4gICAgdHlwZTogJ3Rlc3RzJyxcbiAgICBpZDogMixcbiAgICBuYW1lOiAnZnJvdGF0bycsXG4gICAgZXh0ZW5kZWQ6IHsgY29ob3J0OiAyMDEzIH0sXG4gICAgY2hpbGRyZW46IFt7IGlkOiAzIH1dLFxuICB9O1xuICBjb25zdCB0aHJlZSA9IHtcbiAgICB0eXBlOiAndGVzdHMnLFxuICAgIGlkOiAzLFxuICAgIG5hbWU6ICdydXRhYmFnYScsXG4gICAgZXh0ZW5kZWQ6IHt9LFxuICB9O1xuXG4gIGRlc2NyaWJlKCdFbmNvZGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGVuY29kZSBhIG1vZGVsIHdpdGggbm8gY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcGkuZW5jb2RlKHsgcm9vdDogdGhyZWUsIGV4dGVuZGVkOiB7fSB9LCBhcGlPcHRzKSkpKVxuICAgICAgLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgICBpZDogMyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7IG5hbWU6ICdydXRhYmFnYScsIGV4dGVuZGVkOiB7fSB9LFxuICAgICAgICAgIHJlbGF0aW9uc2hpcHM6IHt9LFxuICAgICAgICAgIGxpbmtzOiB7IHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8zJyB9LFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlZDogW10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZW5jb2RlIGEgbW9kZWwgd2l0aCBjaGlsZHJlbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFwaS5lbmNvZGUoe1xuICAgICAgICByb290OiBvbmUsXG4gICAgICAgIGV4dGVuZGVkOiB7IGNoaWxkcmVuOiBbdHdvLCB0aHJlZV0gfSxcbiAgICAgIH0sIGFwaU9wdHMpKSkpXG4gICAgICAudG8uZGVlcC5lcXVhbChzYW1wbGUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnUGFyc2luZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhcnNlIGEgcmV0dXJuZWQgZG9jdW1lbnQgd2l0aCBubyBpbmNsdWRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGFwaS5wYXJzZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgbmFtZTogJ3J1dGFiYWdhJywgZXh0ZW5kZWQ6IHt9IH0sXG4gICAgICAgICAgcmVsYXRpb25zaGlwczoge30sXG4gICAgICAgICAgbGlua3M6IHsgc2VsZjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpL3Rlc3RzLzMnIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGluY2x1ZGVkOiBbXSxcbiAgICAgIH0pKS50by5kZWVwLmVxdWFsKHsgcm9vdDogdGhyZWUsIGV4dGVuZGVkOiBbXSB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgYSByZXR1cm5lZCBkb2N1bWVudCB3aXRoIGluY2x1ZGVkIGRhdGEnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYXBpLnBhcnNlKHNhbXBsZSkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICByb290OiBvbmUsXG4gICAgICAgIGV4dGVuZGVkOiBbdHdvLCB0aHJlZV0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
