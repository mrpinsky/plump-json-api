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
      expect(JSON.parse(JSON.stringify(api.encode({ root: three, extended: [] }, apiOpts)))).to.deep.equal({
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaS5qcyJdLCJuYW1lcyI6WyJleHBlY3QiLCJkZXNjcmliZSIsImFwaSIsInNjaGVtYXRhIiwiYXBpT3B0cyIsImRvbWFpbiIsInBhdGgiLCJvbmUiLCJ0eXBlIiwiaWQiLCJuYW1lIiwiZXh0ZW5kZWQiLCJjaGlsZHJlbiIsInR3byIsImNvaG9ydCIsInRocmVlIiwiaXQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJlbmNvZGUiLCJyb290IiwidG8iLCJkZWVwIiwiZXF1YWwiLCJkYXRhIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJsaW5rcyIsInNlbGYiLCJpbmNsdWRlZCJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUdBOztBQUNBOztBQUNBOzs7O0FBSkEsSUFBTUEsU0FBUyxlQUFLQSxNQUFwQixDLENBSEE7O0FBU0FDLFNBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCLE1BQU1DLE1BQU0sbUJBQVksRUFBRUMsNEJBQUYsRUFBWixDQUFaO0FBQ0EsTUFBTUMsVUFBVSxFQUFFQyxRQUFRLHFCQUFWLEVBQWlDQyxNQUFNLE1BQXZDLEVBQWhCOztBQUVBLE1BQU1DLE1BQU07QUFDVkMsVUFBTSxPQURJO0FBRVZDLFFBQUksQ0FGTTtBQUdWQyxVQUFNLFFBSEk7QUFJVkMsY0FBVSxFQUpBO0FBS1ZDLGNBQVUsQ0FBQyxFQUFFSCxJQUFJLENBQU4sRUFBRDtBQUxBLEdBQVo7QUFPQSxNQUFNSSxNQUFNO0FBQ1ZMLFVBQU0sT0FESTtBQUVWQyxRQUFJLENBRk07QUFHVkMsVUFBTSxTQUhJO0FBSVZDLGNBQVUsRUFBRUcsUUFBUSxJQUFWLEVBSkE7QUFLVkYsY0FBVSxDQUFDLEVBQUVILElBQUksQ0FBTixFQUFEO0FBTEEsR0FBWjtBQU9BLE1BQU1NLFFBQVE7QUFDWlAsVUFBTSxPQURNO0FBRVpDLFFBQUksQ0FGUTtBQUdaQyxVQUFNLFVBSE07QUFJWkMsY0FBVTtBQUpFLEdBQWQ7O0FBT0FWLFdBQVMsVUFBVCxFQUFxQixZQUFNO0FBQ3pCZSxPQUFHLHdDQUFILEVBQTZDLFlBQU07QUFDakRoQixhQUFPaUIsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWVqQixJQUFJa0IsTUFBSixDQUFXLEVBQUVDLE1BQU1OLEtBQVIsRUFBZUosVUFBVSxFQUF6QixFQUFYLEVBQTBDUCxPQUExQyxDQUFmLENBQVgsQ0FBUCxFQUNDa0IsRUFERCxDQUNJQyxJQURKLENBQ1NDLEtBRFQsQ0FDZTtBQUNiQyxjQUFNO0FBQ0pqQixnQkFBTSxPQURGO0FBRUpDLGNBQUksQ0FGQTtBQUdKaUIsc0JBQVksRUFBRWhCLE1BQU0sVUFBUixFQUFvQkMsVUFBVSxFQUE5QixFQUhSO0FBSUpnQix5QkFBZSxFQUpYO0FBS0pDLGlCQUFPLEVBQUVDLE1BQU0saUNBQVI7QUFMSCxTQURPO0FBUWJDLGtCQUFVO0FBUkcsT0FEZjtBQVdELEtBWkQ7O0FBY0FkLE9BQUcscUNBQUgsRUFBMEMsWUFBTTtBQUM5Q2hCLGFBQU9pQixLQUFLQyxLQUFMLENBQVdELEtBQUtFLFNBQUwsQ0FBZWpCLElBQUlrQixNQUFKLENBQVc7QUFDMUNDLGNBQU1kLEdBRG9DO0FBRTFDSSxrQkFBVSxDQUFDRSxHQUFELEVBQU1FLEtBQU47QUFGZ0MsT0FBWCxFQUc5QlgsT0FIOEIsQ0FBZixDQUFYLENBQVAsRUFJQ2tCLEVBSkQsQ0FJSUMsSUFKSixDQUlTQyxLQUpUO0FBS0QsS0FORDtBQU9ELEdBdEJEOztBQXdCQXZCLFdBQVMsU0FBVCxFQUFvQixZQUFNO0FBQ3hCZSxPQUFHLHdEQUFILEVBQTZELFlBQU07QUFDakVoQixhQUFPRSxJQUFJZ0IsS0FBSixDQUFVO0FBQ2ZPLGNBQU07QUFDSmpCLGdCQUFNLE9BREY7QUFFSkMsY0FBSSxDQUZBO0FBR0ppQixzQkFBWSxFQUFFaEIsTUFBTSxVQUFSLEVBQW9CQyxVQUFVLEVBQTlCLEVBSFI7QUFJSmdCLHlCQUFlLEVBSlg7QUFLSkMsaUJBQU8sRUFBRUMsTUFBTSxpQ0FBUjtBQUxILFNBRFM7QUFRZkMsa0JBQVU7QUFSSyxPQUFWLENBQVAsRUFTSVIsRUFUSixDQVNPQyxJQVRQLENBU1lDLEtBVFosQ0FTa0IsRUFBRUgsTUFBTU4sS0FBUixFQUFlSixVQUFVLEVBQXpCLEVBVGxCO0FBVUQsS0FYRDs7QUFhQUssT0FBRyxxREFBSCxFQUEwRCxZQUFNO0FBQzlEaEIsYUFBT0UsSUFBSWdCLEtBQUosOEJBQVAsRUFBMEJJLEVBQTFCLENBQTZCQyxJQUE3QixDQUFrQ0MsS0FBbEMsQ0FBd0M7QUFDdENILGNBQU1kLEdBRGdDO0FBRXRDSSxrQkFBVSxDQUFDRSxHQUFELEVBQU1FLEtBQU47QUFGNEIsT0FBeEM7QUFJRCxLQUxEO0FBTUQsR0FwQkQ7QUFxQkQsQ0F0RUQiLCJmaWxlIjoidGVzdC9qc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBub2RlLCBtb2NoYSAqL1xuXG5pbXBvcnQgY2hhaSBmcm9tICdjaGFpJztcbmNvbnN0IGV4cGVjdCA9IGNoYWkuZXhwZWN0O1xuXG5pbXBvcnQgeyBKU09OQXBpIH0gZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgVGVzdFR5cGUgfSBmcm9tICcuL3Rlc3RUeXBlJztcbmltcG9ydCB7IGpzb25BcGlTYW1wbGUgYXMgc2FtcGxlIH0gZnJvbSAnLi9qc29uQXBpU2FtcGxlLmpzJztcblxuZGVzY3JpYmUoJ0pTT04gQVBJJywgKCkgPT4ge1xuICBjb25zdCBhcGkgPSBuZXcgSlNPTkFwaSh7IHNjaGVtYXRhOiBUZXN0VHlwZSB9KTtcbiAgY29uc3QgYXBpT3B0cyA9IHsgZG9tYWluOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsIHBhdGg6ICcvYXBpJyB9O1xuXG4gIGNvbnN0IG9uZSA9IHtcbiAgICB0eXBlOiAndGVzdHMnLFxuICAgIGlkOiAxLFxuICAgIG5hbWU6ICdwb3RhdG8nLFxuICAgIGV4dGVuZGVkOiB7fSxcbiAgICBjaGlsZHJlbjogW3sgaWQ6IDIgfV0sXG4gIH07XG4gIGNvbnN0IHR3byA9IHtcbiAgICB0eXBlOiAndGVzdHMnLFxuICAgIGlkOiAyLFxuICAgIG5hbWU6ICdmcm90YXRvJyxcbiAgICBleHRlbmRlZDogeyBjb2hvcnQ6IDIwMTMgfSxcbiAgICBjaGlsZHJlbjogW3sgaWQ6IDMgfV0sXG4gIH07XG4gIGNvbnN0IHRocmVlID0ge1xuICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgaWQ6IDMsXG4gICAgbmFtZTogJ3J1dGFiYWdhJyxcbiAgICBleHRlbmRlZDoge30sXG4gIH07XG5cbiAgZGVzY3JpYmUoJ0VuY29kaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZW5jb2RlIGEgbW9kZWwgd2l0aCBubyBjaGlsZHJlbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFwaS5lbmNvZGUoeyByb290OiB0aHJlZSwgZXh0ZW5kZWQ6IFtdIH0sIGFwaU9wdHMpKSkpXG4gICAgICAudG8uZGVlcC5lcXVhbCh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgbmFtZTogJ3J1dGFiYWdhJywgZXh0ZW5kZWQ6IHt9IH0sXG4gICAgICAgICAgcmVsYXRpb25zaGlwczoge30sXG4gICAgICAgICAgbGlua3M6IHsgc2VsZjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpL3Rlc3RzLzMnIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGluY2x1ZGVkOiBbXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBlbmNvZGUgYSBtb2RlbCB3aXRoIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXBpLmVuY29kZSh7XG4gICAgICAgIHJvb3Q6IG9uZSxcbiAgICAgICAgZXh0ZW5kZWQ6IFt0d28sIHRocmVlXSxcbiAgICAgIH0sIGFwaU9wdHMpKSkpXG4gICAgICAudG8uZGVlcC5lcXVhbChzYW1wbGUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnUGFyc2luZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhcnNlIGEgcmV0dXJuZWQgZG9jdW1lbnQgd2l0aCBubyBpbmNsdWRlZCBkYXRhJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGFwaS5wYXJzZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICAgIGlkOiAzLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgbmFtZTogJ3J1dGFiYWdhJywgZXh0ZW5kZWQ6IHt9IH0sXG4gICAgICAgICAgcmVsYXRpb25zaGlwczoge30sXG4gICAgICAgICAgbGlua3M6IHsgc2VsZjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpL3Rlc3RzLzMnIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGluY2x1ZGVkOiBbXSxcbiAgICAgIH0pKS50by5kZWVwLmVxdWFsKHsgcm9vdDogdGhyZWUsIGV4dGVuZGVkOiBbXSB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcGFyc2UgYSByZXR1cm5lZCBkb2N1bWVudCB3aXRoIGluY2x1ZGVkIGRhdGEnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYXBpLnBhcnNlKHNhbXBsZSkpLnRvLmRlZXAuZXF1YWwoe1xuICAgICAgICByb290OiBvbmUsXG4gICAgICAgIGV4dGVuZGVkOiBbdHdvLCB0aHJlZV0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
