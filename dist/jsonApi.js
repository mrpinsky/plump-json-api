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
      var _Object$assign,
          _this2 = this;

      var data = typeof json === 'string' ? JSON.parse(json) : json;
      var schema = this[$schemata][data.data.type];
      if (schema === undefined) {
        throw new Error('No schema for type: ' + data.data.type);
      }
      var relationships = this.$$parseRelationships(data.data.id, data.relationships);

      var root = Object.assign((_Object$assign = {}, _defineProperty(_Object$assign, schema.$id, data.data.id), _defineProperty(_Object$assign, 'type', schema.$name), _Object$assign), data.attributes, relationships);

      var extended = data.included.map(function (inclusion) {
        var childType = _this2[$schemata][inclusion.type];
        var childData = Object.assign(_defineProperty({ type: childType.$name }, childType.$id, inclusion.id), inclusion.attributes);
        if (inclusion.relationships) {
          Object.assign(childData, _this2.$$parseRelationships(inclusion.id, inclusion.relationships));
        }
        return childData;
      });

      return { root: root, extended: extended };
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
    value: function $$parseRelationships(parentId, data) {
      var _this3 = this;

      return Object.keys(data).map(function (relName) {
        // All children in this relationship should have
        // the same type, so get the type of the first one
        var typeName = data[relName].data[0].type;
        var schema = _this3[$schemata][typeName];
        if (schema === undefined) {
          throw new Error('Cannot parse type: ' + typeName);
        }

        var relationship = schema.$fields[relName].relationship;
        return _defineProperty({}, relName, data[relName].data.map(function (child) {
          var _ref2;

          return _ref2 = {}, _defineProperty(_ref2, relationship.$sides[relName].self.field, parentId), _defineProperty(_ref2, relationship.$sides[relName].other.field, child.id), _ref2;
        }));
      }).reduce(function (acc, curr) {
        return (0, _mergeOptions2.default)(acc, curr);
      }, {});
    }
  }, {
    key: '$$relatedPackage',
    value: function $$relatedPackage(root) {
      var _this4 = this;

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
            return { type: _this4[$schemata][childSpec.type].$name, id: child[childSpec.field] };
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
        if (data[field] !== undefined) {
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
      var _this5 = this;

      var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var options = Object.assign({}, {
        domain: 'https://example.com',
        path: '/api'
      }, opts);
      return Object.keys(extended).map(function (relationship) {
        return extended[relationship].map(function (child) {
          return _this5.$$packageForInclusion(child, options);
        });
      }).reduce(function (acc, curr) {
        return acc.concat(curr);
      }, []);
    }
  }]);

  return JSONApi;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwic2NoZW1hdGEiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiJCRhZGRTY2hlbWEiLCJzIiwianNvbiIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJzY2hlbWEiLCJ0eXBlIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJyZWxhdGlvbnNoaXBzIiwiJCRwYXJzZVJlbGF0aW9uc2hpcHMiLCJpZCIsInJvb3QiLCIkaWQiLCIkbmFtZSIsImF0dHJpYnV0ZXMiLCJleHRlbmRlZCIsImluY2x1ZGVkIiwibWFwIiwiY2hpbGRUeXBlIiwiaW5jbHVzaW9uIiwiY2hpbGREYXRhIiwiZG9tYWluIiwicGF0aCIsInByZWZpeCIsImluY2x1ZGVkUGtnIiwiJCRpbmNsdWRlZFBhY2thZ2UiLCJrZXlzIiwiJGZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwia2V5IiwicmV0VmFsIiwibGlua3MiLCJzZWxmIiwiJCRyZWxhdGVkUGFja2FnZSIsImxlbmd0aCIsIm5hbWUiLCJwYXJlbnRJZCIsInR5cGVOYW1lIiwicmVsTmFtZSIsInJlbGF0aW9uc2hpcCIsIiRzaWRlcyIsIm90aGVyIiwiY2hpbGQiLCJyZWR1Y2UiLCJhY2MiLCJjdXJyIiwiaW5jbHVkZSIsIiRpbmNsdWRlIiwiZmllbGRzIiwicmVsIiwiY2hpbGRTcGVjIiwicmVsYXRlZCIsIiQkcGFja2FnZUZvckluY2x1c2lvbiIsImNvbmNhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZQyxPQUFPLFdBQVAsQ0FBbEI7O0lBRWFDLE8sV0FBQUEsTztBQUNYLHFCQUF1QjtBQUFBOztBQUFBLFFBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDckIsUUFBTUMsVUFBVUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFB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U0FBU3lCLFlBQVQsRUFBdUJ2QixHQUF2QixDQUEyQjtBQUFBLGlCQUFTLE9BQUtvQyxxQkFBTCxDQUEyQlYsS0FBM0IsRUFBa0NwRCxPQUFsQyxDQUFUO0FBQUEsU0FBM0IsQ0FBUDtBQUNELE9BRk0sRUFFSnFELE1BRkksQ0FFRyxVQUFDQyxHQUFELEVBQU1DLElBQU47QUFBQSxlQUFlRCxJQUFJUyxNQUFKLENBQVdSLElBQVgsQ0FBZjtBQUFBLE9BRkgsRUFFb0MsRUFGcEMsQ0FBUDtBQUdEIiwiZmlsZSI6Impzb25BcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVyZ2VPcHRpb25zIGZyb20gJ21lcmdlLW9wdGlvbnMnO1xuXG5jb25zdCAkc2NoZW1hdGEgPSBTeW1ib2woJyRzY2hlbWF0YScpO1xuXG5leHBvcnQgY2xhc3MgSlNPTkFwaSB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICBzY2hlbWF0YTogW10sXG4gICAgfSwgb3B0cyk7XG5cbiAgICB0aGlzWyRzY2hlbWF0YV0gPSB7fTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShvcHRpb25zLnNjaGVtYXRhKSkge1xuICAgICAgb3B0aW9ucy5zY2hlbWF0YSA9IFtvcHRpb25zLnNjaGVtYXRhXTtcbiAgICB9XG4gICAgb3B0aW9ucy5zY2hlbWF0YS5mb3JFYWNoKHMgPT4gdGhpcy4kJGFkZFNjaGVtYShzKSk7XG4gIH1cblxuICBwYXJzZShqc29uKSB7XG4gICAgY29uc3QgZGF0YSA9IHR5cGVvZiBqc29uID09PSAnc3RyaW5nJyA/IEpTT04ucGFyc2UoanNvbikgOiBqc29uO1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtkYXRhLmRhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNjaGVtYSBmb3IgdHlwZTogJHtkYXRhLmRhdGEudHlwZX1gKTtcbiAgICB9XG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRoaXMuJCRwYXJzZVJlbGF0aW9uc2hpcHMoZGF0YS5kYXRhLmlkLCBkYXRhLnJlbGF0aW9uc2hpcHMpO1xuXG4gICAgY29uc3Qgcm9vdCA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIFtzY2hlbWEuJGlkXTogZGF0YS5kYXRhLmlkLFxuICAgICAgICB0eXBlOiBzY2hlbWEuJG5hbWUsXG4gICAgICB9LFxuICAgICAgZGF0YS5hdHRyaWJ1dGVzLFxuICAgICAgcmVsYXRpb25zaGlwc1xuICAgICk7XG5cbiAgICBjb25zdCBleHRlbmRlZCA9IGRhdGEuaW5jbHVkZWQubWFwKGluY2x1c2lvbiA9PiB7XG4gICAgICBjb25zdCBjaGlsZFR5cGUgPSB0aGlzWyRzY2hlbWF0YV1baW5jbHVzaW9uLnR5cGVdO1xuICAgICAgY29uc3QgY2hpbGREYXRhID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgeyB0eXBlOiBjaGlsZFR5cGUuJG5hbWUsIFtjaGlsZFR5cGUuJGlkXTogaW5jbHVzaW9uLmlkIH0sXG4gICAgICAgIGluY2x1c2lvbi5hdHRyaWJ1dGVzXG4gICAgICApO1xuICAgICAgaWYgKGluY2x1c2lvbi5yZWxhdGlvbnNoaXBzKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY2hpbGREYXRhLCB0aGlzLiQkcGFyc2VSZWxhdGlvbnNoaXBzKGluY2x1c2lvbi5pZCwgaW5jbHVzaW9uLnJlbGF0aW9uc2hpcHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGlsZERhdGE7XG4gICAgfSk7XG5cbiAgICByZXR1cm4geyByb290LCBleHRlbmRlZCB9O1xuICB9XG5cbiAgZW5jb2RlKHsgcm9vdCwgZXh0ZW5kZWQgfSwgb3B0cykge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICBwYXRoOiAnL2FwaScsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0aW9ucy5kb21haW4gfHwgJyd9JHtvcHRpb25zLnBhdGggfHwgJyd9YDtcblxuICAgIGNvbnN0IGluY2x1ZGVkUGtnID0gdGhpcy4kJGluY2x1ZGVkUGFja2FnZShleHRlbmRlZCwgb3B0cyk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLiRmaWVsZHMpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gZmllbGQgIT09IHNjaGVtYS4kaWQgJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgIT09ICdoYXNNYW55JztcbiAgICB9KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBhdHRyaWJ1dGVzW2tleV0gPSByb290W2tleV07XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7XG4gICAgICBsaW5rczogeyBzZWxmOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke3Jvb3QuaWR9YCB9LFxuICAgICAgZGF0YTogeyB0eXBlOiBzY2hlbWEuJG5hbWUsIGlkOiByb290LmlkIH0sXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgaW5jbHVkZWQ6IGluY2x1ZGVkUGtnLFxuICAgIH07XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy4kJHJlbGF0ZWRQYWNrYWdlKHJvb3QsIG9wdHMpO1xuICAgIGlmIChPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXRWYWwucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxuXG4gICQkYWRkU2NoZW1hKHNjaGVtYSkge1xuICAgIGlmICh0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9IHNjaGVtYTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgc2NoZW1hIHJlZ2lzdGVyZWQ6ICR7c2NoZW1hLm5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgJCRzY2hlbWF0YSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpc1skc2NoZW1hdGFdKTtcbiAgfVxuXG4gICQkcGFyc2VSZWxhdGlvbnNoaXBzKHBhcmVudElkLCBkYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRhdGEpLm1hcChyZWxOYW1lID0+IHtcbiAgICAgIC8vIEFsbCBjaGlsZHJlbiBpbiB0aGlzIHJlbGF0aW9uc2hpcCBzaG91bGQgaGF2ZVxuICAgICAgLy8gdGhlIHNhbWUgdHlwZSwgc28gZ2V0IHRoZSB0eXBlIG9mIHRoZSBmaXJzdCBvbmVcbiAgICAgIGNvbnN0IHR5cGVOYW1lID0gZGF0YVtyZWxOYW1lXS5kYXRhWzBdLnR5cGU7XG4gICAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bdHlwZU5hbWVdO1xuICAgICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIHR5cGU6ICR7dHlwZU5hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcCA9IHNjaGVtYS4kZmllbGRzW3JlbE5hbWVdLnJlbGF0aW9uc2hpcDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFtyZWxOYW1lXTogZGF0YVtyZWxOYW1lXS5kYXRhLm1hcChjaGlsZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFtyZWxhdGlvbnNoaXAuJHNpZGVzW3JlbE5hbWVdLnNlbGYuZmllbGRdOiBwYXJlbnRJZCxcbiAgICAgICAgICAgIFtyZWxhdGlvbnNoaXAuJHNpZGVzW3JlbE5hbWVdLm90aGVyLmZpZWxkXTogY2hpbGQuaWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH0pLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBtZXJnZU9wdGlvbnMoYWNjLCBjdXJyKSwge30pO1xuICB9XG5cbiAgJCRyZWxhdGVkUGFja2FnZShyb290LCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhY2thZ2UgdHlwZTogJHtyb290LnR5cGV9YCk7XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7IGluY2x1ZGU6IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdLiRpbmNsdWRlIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICBjb25zdCBwcmVmaXggPSBgJHtvcHRpb25zLmRvbWFpbiB8fCAnJ30ke29wdGlvbnMucGF0aCB8fCAnJ31gO1xuICAgIGNvbnN0IGZpZWxkcyA9IE9iamVjdC5rZXlzKG9wdGlvbnMuaW5jbHVkZSkuZmlsdGVyKHJlbCA9PiByb290W3JlbF0gJiYgcm9vdFtyZWxdLmxlbmd0aCk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBjb25zdCBjaGlsZFNwZWMgPSBzY2hlbWEuJGZpZWxkc1tmaWVsZF0ucmVsYXRpb25zaGlwLiRzaWRlc1tmaWVsZF0ub3RoZXI7XG4gICAgICByZXRWYWxbZmllbGRdID0ge1xuICAgICAgICBsaW5rczoge1xuICAgICAgICAgIHJlbGF0ZWQ6IGAke3ByZWZpeH0vJHtzY2hlbWEuJG5hbWV9LyR7cm9vdFtzY2hlbWEuJGlkXX0vJHtmaWVsZH1gLFxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiByb290W2ZpZWxkXS5tYXAoY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiB7IHR5cGU6IHRoaXNbJHNjaGVtYXRhXVtjaGlsZFNwZWMudHlwZV0uJG5hbWUsIGlkOiBjaGlsZFtjaGlsZFNwZWMuZmllbGRdIH07XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cblxuICAkJHBhY2thZ2VGb3JJbmNsdXNpb24oZGF0YSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0cy5kb21haW4gfHwgJyd9JHtvcHRzLnBhdGggfHwgJyd9YDtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhY2thZ2UgaW5jbHVkZWQgdHlwZTogJHtkYXRhLnR5cGV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRoaXMuJCRyZWxhdGVkUGFja2FnZShkYXRhLCBvcHRzKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0ge307XG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLiRmaWVsZHMpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gZmllbGQgIT09IHNjaGVtYS4kaWQgJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgIT09ICdoYXNNYW55JztcbiAgICB9KS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGlmIChkYXRhW2ZpZWxkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGF0dHJpYnV0ZXNbZmllbGRdID0gZGF0YVtmaWVsZF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7XG4gICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICBpZDogZGF0YS5pZCxcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICBsaW5rczoge1xuICAgICAgICBzZWxmOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke2RhdGEuaWR9YCxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGlmIChPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXRWYWwucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxuXG4gICQkaW5jbHVkZWRQYWNrYWdlKGV4dGVuZGVkID0ge30sIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICBwYXRoOiAnL2FwaScsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGV4dGVuZGVkKS5tYXAocmVsYXRpb25zaGlwID0+IHtcbiAgICAgIHJldHVybiBleHRlbmRlZFtyZWxhdGlvbnNoaXBdLm1hcChjaGlsZCA9PiB0aGlzLiQkcGFja2FnZUZvckluY2x1c2lvbihjaGlsZCwgb3B0aW9ucykpO1xuICAgIH0pLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MuY29uY2F0KGN1cnIpLCBbXSk7XG4gIH1cbn1cbiJdfQ==
