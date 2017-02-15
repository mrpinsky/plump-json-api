'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../index');

var _testType = require('./testType');

var _jsonApiSample = require('./jsonApiSample.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect; /* eslint-env node, mocha */

var api = new _index.JSONApi({ schemata: _testType.TestType, baseURL: 'https://example.com/api' });
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

describe('JSON API', function () {
  describe('Encoding', function () {
    it('should encode a model with no children', function () {
      expect(JSON.parse(JSON.stringify(api.encode({ root: three, extended: [] })))).to.deep.equal({
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
        extended: [two, three]
      })))).to.deep.equal(_jsonApiSample.jsonApiSample);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5zcGVjLmpzIl0sIm5hbWVzIjpbImV4cGVjdCIsImFwaSIsInNjaGVtYXRhIiwiYmFzZVVSTCIsIm9uZSIsInR5cGUiLCJpZCIsIm5hbWUiLCJleHRlbmRlZCIsImNoaWxkcmVuIiwidHdvIiwiY29ob3J0IiwidGhyZWUiLCJkZXNjcmliZSIsIml0IiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwiZW5jb2RlIiwicm9vdCIsInRvIiwiZGVlcCIsImVxdWFsIiwiZGF0YSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwibGlua3MiLCJzZWxmIiwiaW5jbHVkZWQiXSwibWFwcGluZ3MiOiI7O0FBRUE7Ozs7QUFHQTs7QUFDQTs7QUFDQTs7OztBQUpBLElBQU1BLFNBQVMsZUFBS0EsTUFBcEIsQyxDQUhBOztBQVNBLElBQU1DLE1BQU0sbUJBQVksRUFBRUMsNEJBQUYsRUFBc0JDLFNBQVMseUJBQS9CLEVBQVosQ0FBWjtBQUNBLElBQU1DLE1BQU07QUFDVkMsUUFBTSxPQURJO0FBRVZDLE1BQUksQ0FGTTtBQUdWQyxRQUFNLFFBSEk7QUFJVkMsWUFBVSxFQUpBO0FBS1ZDLFlBQVUsQ0FBQyxFQUFFSCxJQUFJLENBQU4sRUFBRDtBQUxBLENBQVo7QUFPQSxJQUFNSSxNQUFNO0FBQ1ZMLFFBQU0sT0FESTtBQUVWQyxNQUFJLENBRk07QUFHVkMsUUFBTSxTQUhJO0FBSVZDLFlBQVUsRUFBRUcsUUFBUSxJQUFWLEVBSkE7QUFLVkYsWUFBVSxDQUFDLEVBQUVILElBQUksQ0FBTixFQUFEO0FBTEEsQ0FBWjtBQU9BLElBQU1NLFFBQVE7QUFDWlAsUUFBTSxPQURNO0FBRVpDLE1BQUksQ0FGUTtBQUdaQyxRQUFNLFVBSE07QUFJWkMsWUFBVTtBQUpFLENBQWQ7O0FBT0FLLFNBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCQSxXQUFTLFVBQVQsRUFBcUIsWUFBTTtBQUN6QkMsT0FBRyx3Q0FBSCxFQUE2QyxZQUFNO0FBQ2pEZCxhQUFPZSxLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZWhCLElBQUlpQixNQUFKLENBQVcsRUFBRUMsTUFBTVAsS0FBUixFQUFlSixVQUFVLEVBQXpCLEVBQVgsQ0FBZixDQUFYLENBQVAsRUFDQ1ksRUFERCxDQUNJQyxJQURKLENBQ1NDLEtBRFQsQ0FDZTtBQUNiQyxjQUFNO0FBQ0psQixnQkFBTSxPQURGO0FBRUpDLGNBQUksQ0FGQTtBQUdKa0Isc0JBQVksRUFBRWpCLE1BQU0sVUFBUixFQUFvQkMsVUFBVSxFQUE5QixFQUhSO0FBSUppQix5QkFBZSxFQUpYO0FBS0pDLGlCQUFPLEVBQUVDLE1BQU0saUNBQVI7QUFMSCxTQURPO0FBUWJDLGtCQUFVO0FBUkcsT0FEZjtBQVdELEtBWkQ7O0FBY0FkLE9BQUcscUNBQUgsRUFBMEMsWUFBTTtBQUM5Q2QsYUFBT2UsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVoQixJQUFJaUIsTUFBSixDQUFXO0FBQzFDQyxjQUFNZixHQURvQztBQUUxQ0ksa0JBQVUsQ0FBQ0UsR0FBRCxFQUFNRSxLQUFOO0FBRmdDLE9BQVgsQ0FBZixDQUFYLENBQVAsRUFJQ1EsRUFKRCxDQUlJQyxJQUpKLENBSVNDLEtBSlQ7QUFLRCxLQU5EO0FBT0QsR0F0QkQ7O0FBd0JBVCxXQUFTLFNBQVQsRUFBb0IsWUFBTTtBQUN4QkMsT0FBRyx3REFBSCxFQUE2RCxZQUFNO0FBQ2pFZCxhQUFPQyxJQUFJZSxLQUFKLENBQVU7QUFDZk8sY0FBTTtBQUNKbEIsZ0JBQU0sT0FERjtBQUVKQyxjQUFJLENBRkE7QUFHSmtCLHNCQUFZLEVBQUVqQixNQUFNLFVBQVIsRUFBb0JDLFVBQVUsRUFBOUIsRUFIUjtBQUlKaUIseUJBQWUsRUFKWDtBQUtKQyxpQkFBTyxFQUFFQyxNQUFNLGlDQUFSO0FBTEgsU0FEUztBQVFmQyxrQkFBVTtBQVJLLE9BQVYsQ0FBUCxFQVNJUixFQVRKLENBU09DLElBVFAsQ0FTWUMsS0FUWixDQVNrQixFQUFFSCxNQUFNUCxLQUFSLEVBQWVKLFVBQVUsRUFBekIsRUFUbEI7QUFVRCxLQVhEOztBQWFBTSxPQUFHLHFEQUFILEVBQTBELFlBQU07QUFDOURkLGFBQU9DLElBQUllLEtBQUosOEJBQVAsRUFBMEJJLEVBQTFCLENBQTZCQyxJQUE3QixDQUFrQ0MsS0FBbEMsQ0FBd0M7QUFDdENILGNBQU1mLEdBRGdDO0FBRXRDSSxrQkFBVSxDQUFDRSxHQUFELEVBQU1FLEtBQU47QUFGNEIsT0FBeEM7QUFJRCxLQUxEO0FBTUQsR0FwQkQ7QUFxQkQsQ0E5Q0QiLCJmaWxlIjoidGVzdC9qc29uQXBpLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IG5vZGUsIG1vY2hhICovXG5cbmltcG9ydCBjaGFpIGZyb20gJ2NoYWknO1xuY29uc3QgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XG5cbmltcG9ydCB7IEpTT05BcGkgfSBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgeyBUZXN0VHlwZSB9IGZyb20gJy4vdGVzdFR5cGUnO1xuaW1wb3J0IHsganNvbkFwaVNhbXBsZSBhcyBzYW1wbGUgfSBmcm9tICcuL2pzb25BcGlTYW1wbGUuanMnO1xuXG5jb25zdCBhcGkgPSBuZXcgSlNPTkFwaSh7IHNjaGVtYXRhOiBUZXN0VHlwZSwgYmFzZVVSTDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpJyB9KTtcbmNvbnN0IG9uZSA9IHtcbiAgdHlwZTogJ3Rlc3RzJyxcbiAgaWQ6IDEsXG4gIG5hbWU6ICdwb3RhdG8nLFxuICBleHRlbmRlZDoge30sXG4gIGNoaWxkcmVuOiBbeyBpZDogMiB9XSxcbn07XG5jb25zdCB0d28gPSB7XG4gIHR5cGU6ICd0ZXN0cycsXG4gIGlkOiAyLFxuICBuYW1lOiAnZnJvdGF0bycsXG4gIGV4dGVuZGVkOiB7IGNvaG9ydDogMjAxMyB9LFxuICBjaGlsZHJlbjogW3sgaWQ6IDMgfV0sXG59O1xuY29uc3QgdGhyZWUgPSB7XG4gIHR5cGU6ICd0ZXN0cycsXG4gIGlkOiAzLFxuICBuYW1lOiAncnV0YWJhZ2EnLFxuICBleHRlbmRlZDoge30sXG59O1xuXG5kZXNjcmliZSgnSlNPTiBBUEknLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdFbmNvZGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGVuY29kZSBhIG1vZGVsIHdpdGggbm8gY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcGkuZW5jb2RlKHsgcm9vdDogdGhyZWUsIGV4dGVuZGVkOiBbXSB9KSkpKVxuICAgICAgLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgICBpZDogMyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7IG5hbWU6ICdydXRhYmFnYScsIGV4dGVuZGVkOiB7fSB9LFxuICAgICAgICAgIHJlbGF0aW9uc2hpcHM6IHt9LFxuICAgICAgICAgIGxpbmtzOiB7IHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8zJyB9LFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlZDogW10sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZW5jb2RlIGEgbW9kZWwgd2l0aCBjaGlsZHJlbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFwaS5lbmNvZGUoe1xuICAgICAgICByb290OiBvbmUsXG4gICAgICAgIGV4dGVuZGVkOiBbdHdvLCB0aHJlZV0sXG4gICAgICB9KSkpKVxuICAgICAgLnRvLmRlZXAuZXF1YWwoc2FtcGxlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1BhcnNpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBhIHJldHVybmVkIGRvY3VtZW50IHdpdGggbm8gaW5jbHVkZWQgZGF0YScsICgpID0+IHtcbiAgICAgIGV4cGVjdChhcGkucGFyc2Uoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgICBpZDogMyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7IG5hbWU6ICdydXRhYmFnYScsIGV4dGVuZGVkOiB7fSB9LFxuICAgICAgICAgIHJlbGF0aW9uc2hpcHM6IHt9LFxuICAgICAgICAgIGxpbmtzOiB7IHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8zJyB9LFxuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlZDogW10sXG4gICAgICB9KSkudG8uZGVlcC5lcXVhbCh7IHJvb3Q6IHRocmVlLCBleHRlbmRlZDogW10gfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGEgcmV0dXJuZWQgZG9jdW1lbnQgd2l0aCBpbmNsdWRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGFwaS5wYXJzZShzYW1wbGUpKS50by5kZWVwLmVxdWFsKHtcbiAgICAgICAgcm9vdDogb25lLFxuICAgICAgICBleHRlbmRlZDogW3R3bywgdGhyZWVdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
