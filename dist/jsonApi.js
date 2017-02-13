'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONApi = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mergeOptions = require('merge-options');

var _mergeOptions2 = _interopRequireDefault(_mergeOptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $schemata = Symbol('$schemata');

var JSONApi = exports.JSONApi = function () {
  function JSONApi() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, JSONApi);

    var options = Object.assign({}, {
      schemata: []
    }, opts);

    this[$schemata] = {};

    if (!Array.isArray(options.schemata)) {
      options.schemata = [options.schemata];
    }
    options.schemata.forEach(function (s) {
      return _this.$$addSchema(s);
    });
  }

  _createClass(JSONApi, [{
    key: 'parse',
    value: function parse(json) {
      var _this2 = this;

      var data = typeof json === 'string' ? JSON.parse(json) : json;
      var type = this.type(data.data.type);
      var relationships = this.$$parseRelationships(data.relationships);

      var requested = Object.assign(_defineProperty({}, type.$id, data.id), data.attributes, relationships);
      this.save();

      var extended = data.included.map(function (inclusion) {
        // const childType = this.type(inclusion.type);
        // const childId = inclusion.id;
        var childData = Object.assign({}, inclusion.attributes, _this2.parseRelationships(inclusion.relationships));
        return childData;
      });

      return { requested: requested, extended: extended };
    }
  }, {
    key: 'encode',
    value: function encode(_ref, opts) {
      var root = _ref.root,
          extended = _ref.extended;

      var schema = this[$schemata][root.type];
      var options = Object.assign({}, {
        domain: 'https://example.com',
        path: '/api'
      }, opts);
      var prefix = '' + (options.domain || '') + (options.path || '');

      var includedPkg = this.$$includedPackage(extended, opts);
      var attributes = {};

      Object.keys(schema.$fields).filter(function (field) {
        return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
      }).forEach(function (key) {
        attributes[key] = root[key];
      });

      var retVal = {
        links: { self: prefix + '/' + schema.$name + '/' + root.id },
        data: { type: schema.$name, id: root.id },
        attributes: attributes,
        included: includedPkg
      };

      var relationships = this.$$relatedPackage(root, opts);
      if (Object.keys(relationships).length > 0) {
        retVal.relationships = relationships;
      }

      return retVal;
    }
  }, {
    key: '$$addSchema',
    value: function $$addSchema(schema) {
      if (this[$schemata][schema.$name] === undefined) {
        this[$schemata][schema.$name] = schema;
      } else {
        throw new Error('Duplicate schema registered: ' + schema.name);
      }
    }
  }, {
    key: '$$schemata',
    value: function $$schemata() {
      return Object.keys(this[$schemata]);
    }
  }, {
    key: '$$parseRelationships',
    value: function $$parseRelationships(data) {
      var schema = this[$schemata][data.data.type];
      if (schema === undefined) {
        throw new Error('Cannot parse type: ' + data.data.type);
      }

      return Object.keys(data.relationships).map(function (relName) {
        var relationship = schema.$fields[relName].relationship;
        return _defineProperty({}, relName, data.relationships[relName].data.map(function (child) {
          var _ref2;

          return _ref2 = {}, _defineProperty(_ref2, relationship.$sides[relName].self.field, data.id), _defineProperty(_ref2, relationship.$sides[relName].other.field, child.id), _ref2;
        }));
      }).reduce(function (acc, curr) {
        return (0, _mergeOptions2.default)(acc, curr);
      }, {});
    }
  }, {
    key: '$$relatedPackage',
    value: function $$relatedPackage(root) {
      var _this3 = this;

      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var schema = this[$schemata][root.type];
      if (schema === undefined) {
        throw new Error('Cannot package type: ' + root.type);
      }
      var options = Object.assign({}, { include: this[$schemata][root.type].$include }, opts);
      var prefix = '' + (options.domain || '') + (options.path || '');
      var fields = Object.keys(options.include).filter(function (rel) {
        return root[rel] && root[rel].length;
      });

      var retVal = {};
      fields.forEach(function (field) {
        var childSpec = schema.$fields[field].relationship.$sides[field].other;
        retVal[field] = {
          links: {
            related: prefix + '/' + schema.$name + '/' + root[schema.$id] + '/' + field
          },
          data: root[field].map(function (child) {
            return { type: _this3[$schemata][childSpec.type].$name, id: child[childSpec.field] };
          })
        };
      });

      return retVal;
    }
  }, {
    key: '$$packageForInclusion',
    value: function $$packageForInclusion(data) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var prefix = '' + (opts.domain || '') + (opts.path || '');
      var schema = this[$schemata][data.type];
      if (schema === undefined) {
        throw new Error('Cannot package included type: ' + data.type);
      }

      var relationships = this.$$relatedPackage(data, opts);
      var attributes = {};
      Object.keys(schema.$fields).filter(function (field) {
        return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
      }).forEach(function (field) {
        if (data[field] !== 'undefined') {
          attributes[field] = data[field];
        }
      });

      var retVal = {
        type: data.type,
        id: data.id,
        attributes: attributes,
        links: {
          self: prefix + '/' + schema.$name + '/' + data.id
        }
      };

      if (Object.keys(relationships).length > 0) {
        retVal.relationships = relationships;
      }

      return retVal;
    }
  }, {
    key: '$$includedPackage',
    value: function $$includedPackage() {
      var _this4 = this;

      var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var options = Object.assign({}, {
        domain: 'https://example.com',
        path: '/api'
      }, opts);
      return Object.keys(extended).map(function (relationship) {
        return extended[relationship].map(function (child) {
          return _this4.$$packageForInclusion(child, options);
        });
      }).reduce(function (acc, curr) {
        return acc.concat(curr);
      });
    }
  }]);

  return JSONApi;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwic2NoZW1hdGEiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiJCRhZGRTY2hlbWEiLCJzIiwianNvbiIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJ0eXBlIiwicmVsYXRpb25zaGlwcyIsIiQkcGFyc2VSZWxhdGlvbnNoaXBzIiwicmVxdWVzdGVkIiwiJGlkIiwiaWQiLCJhdHRyaWJ1dGVzIiwic2F2ZSIsImV4dGVuZGVkIiwiaW5jbHVkZWQiLCJtYXAiLCJjaGlsZERhdGEiLCJpbmNsdXNpb24iLCJwYXJzZVJlbGF0aW9uc2hpcHMiLCJyb290Iiwic2NoZW1hIiwiZG9tYWluIiwicGF0aCIsInByZWZpeCIsImluY2x1ZGVkUGtnIiwiJCRpbmNsdWRlZFBhY2thZ2UiLCJrZXlzIiwiJGZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwia2V5IiwicmV0VmFsIiwibGlua3MiLCJzZWxmIiwiJG5hbWUiLCIkJHJlbGF0ZWRQYWNrYWdlIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYW1lIiwicmVsYXRpb25zaGlwIiwicmVsTmFtZSIsIiRzaWRlcyIsIm90aGVyIiwiY2hpbGQiLCJyZWR1Y2UiLCJhY2MiLCJjdXJyIiwiaW5jbHVkZSIsIiRpbmNsdWRlIiwiZmllbGRzIiwicmVsIiwiY2hpbGRTcGVjIiwicmVsYXRlZCIsIiQkcGFja2FnZUZvckluY2x1c2lvbiIsImNvbmNhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZQyxPQUFPLFdBQVAsQ0FBbEI7O0lBRWFDLE8sV0FBQUEsTztBQUNYLHFCQUF1QjtBQUFBOztBQUFBLFFBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDckIsUUFBTUMsVUFBVUMsT0FBT0MsTUFBUCxDQUFjLEVB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LE9BTkQ7O0FBUUEsVUFBTUUsU0FBUztBQUNiMUIsY0FBTUgsS0FBS0csSUFERTtBQUViSyxZQUFJUixLQUFLUSxFQUZJO0FBR2JDLG9CQUFZQSxVQUhDO0FBSWJxQixlQUFPO0FBQ0xDLGdCQUFTVixNQUFULFNBQW1CSCxPQUFPYyxLQUExQixTQUFtQ2hDLEtBQUtRO0FBRG5DO0FBSk0sT0FBZjs7QUFTQSxVQUFJakIsT0FBT2lDLElBQVAsQ0FBWXBCLGFBQVosRUFBMkI4QixNQUEzQixHQUFvQyxDQUF4QyxFQUEyQztBQUN6Q0wsZUFBT3pCLGFBQVAsR0FBdUJBLGFBQXZCO0FBQ0Q7O0FBRUQsYUFBT3lCLE1BQVA7QUFDRDs7O3dDQUUyQztBQUFBOztBQUFBLFVBQTFCbEIsUUFBMEIsdUVBQWYsRUFBZTtBQUFBLFVBQVh0QixJQUFXLHVFQUFKLEVBQUk7O0FBQzFDLFVBQU1DLFVBQVVDLE9BQU9DLE1BQVAsQ0FDZCxFQURjLEVBRWQ7QUFDRTJCLGdCQUFRLHFCQURWO0FBRUVDLGNBQU07QUFGUixPQUZjLEVBTWQvQixJQU5jLENBQWhCO0FBUUEsYUFBT0UsT0FBT2lDLElBQVAsQ0FBWWIsUUFBWixFQUFzQkUsR0FBdEIsQ0FBMEIsd0JBQWdCO0FBQy9DLGVBQU9GLFNBQVMyQixZQUFULEVBQXVCekIsR0FBdkIsQ0FBMkI7QUFBQSxpQkFBUyxPQUFLdUMscUJBQUwsQ0FBMkJWLEtBQTNCLEVBQWtDcEQsT0FBbEMsQ0FBVDtBQUFBLFNBQTNCLENBQVA7QUFDRCxPQUZNLEVBRUpxRCxNQUZJLENBRUcsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOO0FBQUEsZUFBZUQsSUFBSVMsTUFBSixDQUFXUixJQUFYLENBQWY7QUFBQSxPQUZILENBQVA7QUFHRCIsImZpbGUiOiJqc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1lcmdlT3B0aW9ucyBmcm9tICdtZXJnZS1vcHRpb25zJztcblxuY29uc3QgJHNjaGVtYXRhID0gU3ltYm9sKCckc2NoZW1hdGEnKTtcblxuZXhwb3J0IGNsYXNzIEpTT05BcGkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgc2NoZW1hdGE6IFtdLFxuICAgIH0sIG9wdHMpO1xuXG4gICAgdGhpc1skc2NoZW1hdGFdID0ge307XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5zY2hlbWF0YSkpIHtcbiAgICAgIG9wdGlvbnMuc2NoZW1hdGEgPSBbb3B0aW9ucy5zY2hlbWF0YV07XG4gICAgfVxuICAgIG9wdGlvbnMuc2NoZW1hdGEuZm9yRWFjaChzID0+IHRoaXMuJCRhZGRTY2hlbWEocykpO1xuICB9XG5cbiAgcGFyc2UoanNvbikge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YganNvbiA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKGpzb24pIDoganNvbjtcbiAgICBjb25zdCB0eXBlID0gdGhpcy50eXBlKGRhdGEuZGF0YS50eXBlKTtcbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy4kJHBhcnNlUmVsYXRpb25zaGlwcyhkYXRhLnJlbGF0aW9uc2hpcHMpO1xuXG4gICAgY29uc3QgcmVxdWVzdGVkID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgW3R5cGUuJGlkXTogZGF0YS5pZCxcbiAgICAgIH0sXG4gICAgICBkYXRhLmF0dHJpYnV0ZXMsXG4gICAgICByZWxhdGlvbnNoaXBzXG4gICAgKTtcbiAgICB0aGlzLnNhdmUoKTtcblxuICAgIGNvbnN0IGV4dGVuZGVkID0gZGF0YS5pbmNsdWRlZC5tYXAoaW5jbHVzaW9uID0+IHtcbiAgICAgIC8vIGNvbnN0IGNoaWxkVHlwZSA9IHRoaXMudHlwZShpbmNsdXNpb24udHlwZSk7XG4gICAgICAvLyBjb25zdCBjaGlsZElkID0gaW5jbHVzaW9uLmlkO1xuICAgICAgY29uc3QgY2hpbGREYXRhID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIGluY2x1c2lvbi5hdHRyaWJ1dGVzLFxuICAgICAgICB0aGlzLnBhcnNlUmVsYXRpb25zaGlwcyhpbmNsdXNpb24ucmVsYXRpb25zaGlwcylcbiAgICAgICk7XG4gICAgICByZXR1cm4gY2hpbGREYXRhO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgcmVxdWVzdGVkLCBleHRlbmRlZCB9O1xuICB9XG5cbiAgZW5jb2RlKHsgcm9vdCwgZXh0ZW5kZWQgfSwgb3B0cykge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICBwYXRoOiAnL2FwaScsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0aW9ucy5kb21haW4gfHwgJyd9JHtvcHRpb25zLnBhdGggfHwgJyd9YDtcblxuICAgIGNvbnN0IGluY2x1ZGVkUGtnID0gdGhpcy4kJGluY2x1ZGVkUGFja2FnZShleHRlbmRlZCwgb3B0cyk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLiRmaWVsZHMpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gZmllbGQgIT09IHNjaGVtYS4kaWQgJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgIT09ICdoYXNNYW55JztcbiAgICB9KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBhdHRyaWJ1dGVzW2tleV0gPSByb290W2tleV07XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7XG4gICAgICBsaW5rczogeyBzZWxmOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke3Jvb3QuaWR9YCB9LFxuICAgICAgZGF0YTogeyB0eXBlOiBzY2hlbWEuJG5hbWUsIGlkOiByb290LmlkIH0sXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgaW5jbHVkZWQ6IGluY2x1ZGVkUGtnLFxuICAgIH07XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy4kJHJlbGF0ZWRQYWNrYWdlKHJvb3QsIG9wdHMpO1xuICAgIGlmIChPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXRWYWwucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxuXG4gICQkYWRkU2NoZW1hKHNjaGVtYSkge1xuICAgIGlmICh0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9IHNjaGVtYTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgc2NoZW1hIHJlZ2lzdGVyZWQ6ICR7c2NoZW1hLm5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgJCRzY2hlbWF0YSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpc1skc2NoZW1hdGFdKTtcbiAgfVxuXG4gICQkcGFyc2VSZWxhdGlvbnNoaXBzKGRhdGEpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS5kYXRhLnR5cGVdO1xuICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFyc2UgdHlwZTogJHtkYXRhLmRhdGEudHlwZX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZGF0YS5yZWxhdGlvbnNoaXBzKS5tYXAocmVsTmFtZSA9PiB7XG4gICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSBzY2hlbWEuJGZpZWxkc1tyZWxOYW1lXS5yZWxhdGlvbnNoaXA7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBbcmVsTmFtZV06IGRhdGEucmVsYXRpb25zaGlwc1tyZWxOYW1lXS5kYXRhLm1hcChjaGlsZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFtyZWxhdGlvbnNoaXAuJHNpZGVzW3JlbE5hbWVdLnNlbGYuZmllbGRdOiBkYXRhLmlkLFxuICAgICAgICAgICAgW3JlbGF0aW9uc2hpcC4kc2lkZXNbcmVsTmFtZV0ub3RoZXIuZmllbGRdOiBjaGlsZC5pZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSkucmVkdWNlKChhY2MsIGN1cnIpID0+IG1lcmdlT3B0aW9ucyhhY2MsIGN1cnIpLCB7fSk7XG4gIH1cblxuICAkJHJlbGF0ZWRQYWNrYWdlKHJvb3QsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdO1xuICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFja2FnZSB0eXBlOiAke3Jvb3QudHlwZX1gKTtcbiAgICB9XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHsgaW5jbHVkZTogdGhpc1skc2NoZW1hdGFdW3Jvb3QudHlwZV0uJGluY2x1ZGUgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke29wdGlvbnMuZG9tYWluIHx8ICcnfSR7b3B0aW9ucy5wYXRoIHx8ICcnfWA7XG4gICAgY29uc3QgZmllbGRzID0gT2JqZWN0LmtleXMob3B0aW9ucy5pbmNsdWRlKS5maWx0ZXIocmVsID0+IHJvb3RbcmVsXSAmJiByb290W3JlbF0ubGVuZ3RoKTtcblxuICAgIGNvbnN0IHJldFZhbCA9IHt9O1xuICAgIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGNvbnN0IGNoaWxkU3BlYyA9IHNjaGVtYS4kZmllbGRzW2ZpZWxkXS5yZWxhdGlvbnNoaXAuJHNpZGVzW2ZpZWxkXS5vdGhlcjtcbiAgICAgIHJldFZhbFtmaWVsZF0gPSB7XG4gICAgICAgIGxpbmtzOiB7XG4gICAgICAgICAgcmVsYXRlZDogYCR7cHJlZml4fS8ke3NjaGVtYS4kbmFtZX0vJHtyb290W3NjaGVtYS4kaWRdfS8ke2ZpZWxkfWAsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IHJvb3RbZmllbGRdLm1hcChjaGlsZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogdGhpc1skc2NoZW1hdGFdW2NoaWxkU3BlYy50eXBlXS4kbmFtZSwgaWQ6IGNoaWxkW2NoaWxkU3BlYy5maWVsZF0gfTtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxuXG4gICQkcGFja2FnZUZvckluY2x1c2lvbihkYXRhLCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBwcmVmaXggPSBgJHtvcHRzLmRvbWFpbiB8fCAnJ30ke29wdHMucGF0aCB8fCAnJ31gO1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtkYXRhLnR5cGVdO1xuICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFja2FnZSBpbmNsdWRlZCB0eXBlOiAke2RhdGEudHlwZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy4kJHJlbGF0ZWRQYWNrYWdlKGRhdGEsIG9wdHMpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhzY2hlbWEuJGZpZWxkcykuZmlsdGVyKGZpZWxkID0+IHtcbiAgICAgIHJldHVybiBmaWVsZCAhPT0gc2NoZW1hLiRpZCAmJiBzY2hlbWEuJGZpZWxkc1tmaWVsZF0udHlwZSAhPT0gJ2hhc01hbnknO1xuICAgIH0pLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgaWYgKGRhdGFbZmllbGRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhdHRyaWJ1dGVzW2ZpZWxkXSA9IGRhdGFbZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcmV0VmFsID0ge1xuICAgICAgdHlwZTogZGF0YS50eXBlLFxuICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgbGlua3M6IHtcbiAgICAgICAgc2VsZjogYCR7cHJlZml4fS8ke3NjaGVtYS4kbmFtZX0vJHtkYXRhLmlkfWAsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBpZiAoT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykubGVuZ3RoID4gMCkge1xuICAgICAgcmV0VmFsLnJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cblxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cblxuICAkJGluY2x1ZGVkUGFja2FnZShleHRlbmRlZCA9IHt9LCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBkb21haW46ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgcGF0aDogJy9hcGknLFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhleHRlbmRlZCkubWFwKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICByZXR1cm4gZXh0ZW5kZWRbcmVsYXRpb25zaGlwXS5tYXAoY2hpbGQgPT4gdGhpcy4kJHBhY2thZ2VGb3JJbmNsdXNpb24oY2hpbGQsIG9wdGlvbnMpKTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gYWNjLmNvbmNhdChjdXJyKSk7XG4gIH1cbn1cbiJdfQ==
