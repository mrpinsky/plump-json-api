'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONApi = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mergeOptions2 = require('merge-options');

var _mergeOptions3 = _interopRequireDefault(_mergeOptions2);

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
    value: function parse(response) {
      var _this2 = this;

      var json = typeof response === 'string' ? JSON.parse(response) : response;
      var data = json.data;
      var included = json.included;

      return {
        root: this.$$parseDataObject(data),
        extended: included.map(function (item) {
          return _this2.$$parseDataObject(item);
        })
      };
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
    key: '$$attributeFields',
    value: function $$attributeFields(type) {
      var schema = this[$schemata][type];
      return Object.keys(schema.$fields).filter(function (field) {
        return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
      });
    }
  }, {
    key: '$$parseDataObject',
    value: function $$parseDataObject(data) {
      console.log(data);
      var schema = this[$schemata][data.type];
      if (schema === undefined) {
        throw new Error('No schema for type: ' + data.type);
      } else {
        return (0, _mergeOptions3.default)(_defineProperty({ type: data.type }, schema.$id, data.id), data.attributes, this.$$parseRelationships(data.id, data.relationships));
      }
    }
  }, {
    key: '$$encodeDataObject',
    value: function $$encodeDataObject(data, opts) {
      var _this3 = this;

      var schema = this[$schemata][data.type];
      if (schema === undefined) {
        throw new Error('No schema for type: ' + data.type);
      } else {
        var _ret = function () {
          var options = Object.assign({}, {
            include: schema.$include,
            prefix: ''
          }, opts);
          var link = options.prefix + '/' + data.type + '/' + data[schema.$id];
          var relationships = _this3.$$encodeRelationships(data, options);
          return {
            v: {
              type: data.type,
              id: data[schema.$id],
              attributes: _this3.$$attributeFields(data.type).map(function (attr) {
                return _defineProperty({}, attr, data[attr]);
              }).reduce(function (acc, curr) {
                return (0, _mergeOptions3.default)(acc, curr);
              }, {}),
              relationships: relationships,
              links: {
                self: link,
                related: Object.keys(relationships).map(function (rel) {
                  return link + '/' + rel;
                })
              }
            }
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }
  }, {
    key: '$$parseRelationships',
    value: function $$parseRelationships(parentId, relationships) {
      var _this4 = this;

      return Object.keys(relationships).map(function (relName) {
        // All children in this relationship should have
        // the same type, so get the type of the first one
        var typeName = relationships[relName].data[0].type;
        var schema = _this4[$schemata][typeName];
        if (schema === undefined) {
          throw new Error('Cannot parse type: ' + typeName);
        }

        return _defineProperty({}, relName, relationships[relName].data.map(function (child) {
          return { id: child.id };
        }));
      }).reduce(function (acc, curr) {
        return (0, _mergeOptions3.default)(acc, curr);
      }, {});
    }
  }, {
    key: '$$relatedPackage',
    value: function $$relatedPackage(root) {
      var _this5 = this;

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
            return { type: _this5[$schemata][childSpec.type].$name, id: child[childSpec.field] };
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
      var _this6 = this;

      var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var options = Object.assign({}, {
        domain: 'https://example.com',
        path: '/api'
      }, opts);
      return Object.keys(extended).map(function (relationship) {
        return extended[relationship].map(function (child) {
          return _this6.$$packageForInclusion(child, options);
        });
      }).reduce(function (acc, curr) {
        return acc.concat(curr);
      }, []);
    }
  }]);

  return JSONApi;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwic2NoZW1hdGEiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiJCRhZGRTY2hlbWEiLCJzIiwicmVzcG9uc2UiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsImluY2x1ZGVkIiwicm9vdCIsIiQkcGFyc2VEYXRhT2JqZWN0IiwiZXh0ZW5kZWQiLCJtYXAiLCJpdGVtIiwic2NoZW1hIiwidHlwZSIsImRvbWFpbiIsInBhdGgiLCJwcmVmaXgiLCJpbmNsdWRlZFBrZyIsIiQkaW5jbHVkZWRQYWNrYWdlIiwiYXR0cmlidXRlcyIsImtleXMiLCIkZmllbGRzIiwiZmlsdGVyIiwiZmllbGQiLCIkaWQiLCJrZXkiLCJyZXRWYWwiLCJsaW5rcyIsInNlbGYiLCIkbmFtZSIsImlkIiwicmVsYXRpb25zaGlwcyIsIiQkcmVsYXRlZFBhY2thZ2UiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJFcnJvciIsIm5hbWUiLCJjb25zb2xlIiwibG9nIiwiJCRwYXJzZVJlbGF0aW9uc2hpcHMiLCJpbmNsdWRlIiwiJGluY2x1ZGUiLCJsaW5rIiwiJCRlbmNvZGVSZWxhdGlvbnNoaXBzIiwiJCRhdHRyaWJ1dGVGaWVsZHMiLCJhdHRyIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsInJlbGF0ZWQiLCJyZWwiLCJwYXJlbnRJZCIsInR5cGVOYW1lIiwicmVsTmFtZSIsImNoaWxkIiwiZmllbGRzIiwiY2hpbGRTcGVjIiwicmVsYXRpb25zaGlwIiwiJHNpZGVzIiwib3RoZXIiLCIkJHBhY2thZ2VGb3JJbmNsdXNpb24iLCJjb25jYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZQyxPQUFPLFdBQVAsQ0FBbEI7O0lBRWFDLE8sV0FBQUEsTztBQUNYLHFCQUF1QjtBQUFB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Q0FBMkJOLEtBQTNCLEVBQWtDOUQsT0FBbEMsQ0FBVDtBQUFBLFNBQTNCLENBQVA7QUFDRCxPQUZNLEVBRUpzRCxNQUZJLENBRUcsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOO0FBQUEsZUFBZUQsSUFBSWMsTUFBSixDQUFXYixJQUFYLENBQWY7QUFBQSxPQUZILEVBRW9DLEVBRnBDLENBQVA7QUFHRCIsImZpbGUiOiJqc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1lcmdlT3B0aW9ucyBmcm9tICdtZXJnZS1vcHRpb25zJztcblxuY29uc3QgJHNjaGVtYXRhID0gU3ltYm9sKCckc2NoZW1hdGEnKTtcblxuZXhwb3J0IGNsYXNzIEpTT05BcGkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgc2NoZW1hdGE6IFtdLFxuICAgIH0sIG9wdHMpO1xuXG4gICAgdGhpc1skc2NoZW1hdGFdID0ge307XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5zY2hlbWF0YSkpIHtcbiAgICAgIG9wdGlvbnMuc2NoZW1hdGEgPSBbb3B0aW9ucy5zY2hlbWF0YV07XG4gICAgfVxuICAgIG9wdGlvbnMuc2NoZW1hdGEuZm9yRWFjaChzID0+IHRoaXMuJCRhZGRTY2hlbWEocykpO1xuICB9XG5cbiAgcGFyc2UocmVzcG9uc2UpIHtcbiAgICBjb25zdCBqc29uID0gdHlwZW9mIHJlc3BvbnNlID09PSAnc3RyaW5nJyA/IEpTT04ucGFyc2UocmVzcG9uc2UpIDogcmVzcG9uc2U7XG4gICAgY29uc3QgZGF0YSA9IGpzb24uZGF0YTtcbiAgICBjb25zdCBpbmNsdWRlZCA9IGpzb24uaW5jbHVkZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy4kJHBhcnNlRGF0YU9iamVjdChkYXRhKSxcbiAgICAgIGV4dGVuZGVkOiBpbmNsdWRlZC5tYXAoaXRlbSA9PiB0aGlzLiQkcGFyc2VEYXRhT2JqZWN0KGl0ZW0pKSxcbiAgICB9O1xuICB9XG5cbiAgZW5jb2RlKHsgcm9vdCwgZXh0ZW5kZWQgfSwgb3B0cykge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICBwYXRoOiAnL2FwaScsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0aW9ucy5kb21haW4gfHwgJyd9JHtvcHRpb25zLnBhdGggfHwgJyd9YDtcblxuICAgIGNvbnN0IGluY2x1ZGVkUGtnID0gdGhpcy4kJGluY2x1ZGVkUGFja2FnZShleHRlbmRlZCwgb3B0cyk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLiRmaWVsZHMpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gZmllbGQgIT09IHNjaGVtYS4kaWQgJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgIT09ICdoYXNNYW55JztcbiAgICB9KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBhdHRyaWJ1dGVzW2tleV0gPSByb290W2tleV07XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7XG4gICAgICBsaW5rczogeyBzZWxmOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke3Jvb3QuaWR9YCB9LFxuICAgICAgZGF0YTogeyB0eXBlOiBzY2hlbWEuJG5hbWUsIGlkOiByb290LmlkIH0sXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgaW5jbHVkZWQ6IGluY2x1ZGVkUGtnLFxuICAgIH07XG5cbiAgICBjb25zdCByZWxhdGlvbnNoaXBzID0gdGhpcy4kJHJlbGF0ZWRQYWNrYWdlKHJvb3QsIG9wdHMpO1xuICAgIGlmIChPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXRWYWwucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxuXG4gICQkYWRkU2NoZW1hKHNjaGVtYSkge1xuICAgIGlmICh0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9IHNjaGVtYTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgc2NoZW1hIHJlZ2lzdGVyZWQ6ICR7c2NoZW1hLm5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgJCRzY2hlbWF0YSgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpc1skc2NoZW1hdGFdKTtcbiAgfVxuXG4gICQkYXR0cmlidXRlRmllbGRzKHR5cGUpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bdHlwZV07XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNjaGVtYS4kZmllbGRzKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGZpZWxkICE9PSBzY2hlbWEuJGlkICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlICE9PSAnaGFzTWFueSc7XG4gICAgfSk7XG4gIH1cblxuICAkJHBhcnNlRGF0YU9iamVjdChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNjaGVtYSBmb3IgdHlwZTogJHtkYXRhLnR5cGV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtZXJnZU9wdGlvbnMoXG4gICAgICAgIHsgdHlwZTogZGF0YS50eXBlLCBbc2NoZW1hLiRpZF06IGRhdGEuaWQgfSxcbiAgICAgICAgZGF0YS5hdHRyaWJ1dGVzLFxuICAgICAgICB0aGlzLiQkcGFyc2VSZWxhdGlvbnNoaXBzKGRhdGEuaWQsIGRhdGEucmVsYXRpb25zaGlwcylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgJCRlbmNvZGVEYXRhT2JqZWN0KGRhdGEsIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc2NoZW1hIGZvciB0eXBlOiAke2RhdGEudHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHt9LFxuICAgICAgICB7XG4gICAgICAgICAgaW5jbHVkZTogc2NoZW1hLiRpbmNsdWRlLFxuICAgICAgICAgIHByZWZpeDogJycsXG4gICAgICAgIH0sXG4gICAgICAgIG9wdHNcbiAgICAgICk7XG4gICAgICBjb25zdCBsaW5rID0gYCR7b3B0aW9ucy5wcmVmaXh9LyR7ZGF0YS50eXBlfS8ke2RhdGFbc2NoZW1hLiRpZF19YDtcbiAgICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLiQkZW5jb2RlUmVsYXRpb25zaGlwcyhkYXRhLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgaWQ6IGRhdGFbc2NoZW1hLiRpZF0sXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuJCRhdHRyaWJ1dGVGaWVsZHMoZGF0YS50eXBlKVxuICAgICAgICAgIC5tYXAoYXR0ciA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBbYXR0cl06IGRhdGFbYXR0cl0gfTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogcmVsYXRpb25zaGlwcyxcbiAgICAgICAgbGlua3M6IHtcbiAgICAgICAgICBzZWxmOiBsaW5rLFxuICAgICAgICAgIHJlbGF0ZWQ6IE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLm1hcChyZWwgPT4gYCR7bGlua30vJHtyZWx9YCksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gICQkcGFyc2VSZWxhdGlvbnNoaXBzKHBhcmVudElkLCByZWxhdGlvbnNoaXBzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLm1hcChyZWxOYW1lID0+IHtcbiAgICAgIC8vIEFsbCBjaGlsZHJlbiBpbiB0aGlzIHJlbGF0aW9uc2hpcCBzaG91bGQgaGF2ZVxuICAgICAgLy8gdGhlIHNhbWUgdHlwZSwgc28gZ2V0IHRoZSB0eXBlIG9mIHRoZSBmaXJzdCBvbmVcbiAgICAgIGNvbnN0IHR5cGVOYW1lID0gcmVsYXRpb25zaGlwc1tyZWxOYW1lXS5kYXRhWzBdLnR5cGU7XG4gICAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bdHlwZU5hbWVdO1xuICAgICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIHR5cGU6ICR7dHlwZU5hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFtyZWxOYW1lXTogcmVsYXRpb25zaGlwc1tyZWxOYW1lXS5kYXRhLm1hcChjaGlsZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIHsgaWQ6IGNoaWxkLmlkIH07XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkcmVsYXRlZFBhY2thZ2Uocm9vdCwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3Jvb3QudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYWNrYWdlIHR5cGU6ICR7cm9vdC50eXBlfWApO1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgeyBpbmNsdWRlOiB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXS4kaW5jbHVkZSB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0aW9ucy5kb21haW4gfHwgJyd9JHtvcHRpb25zLnBhdGggfHwgJyd9YDtcbiAgICBjb25zdCBmaWVsZHMgPSBPYmplY3Qua2V5cyhvcHRpb25zLmluY2x1ZGUpLmZpbHRlcihyZWwgPT4gcm9vdFtyZWxdICYmIHJvb3RbcmVsXS5sZW5ndGgpO1xuXG4gICAgY29uc3QgcmV0VmFsID0ge307XG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgY29uc3QgY2hpbGRTcGVjID0gc2NoZW1hLiRmaWVsZHNbZmllbGRdLnJlbGF0aW9uc2hpcC4kc2lkZXNbZmllbGRdLm90aGVyO1xuICAgICAgcmV0VmFsW2ZpZWxkXSA9IHtcbiAgICAgICAgbGlua3M6IHtcbiAgICAgICAgICByZWxhdGVkOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke3Jvb3Rbc2NoZW1hLiRpZF19LyR7ZmllbGR9YCxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogcm9vdFtmaWVsZF0ubWFwKGNoaWxkID0+IHtcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiB0aGlzWyRzY2hlbWF0YV1bY2hpbGRTcGVjLnR5cGVdLiRuYW1lLCBpZDogY2hpbGRbY2hpbGRTcGVjLmZpZWxkXSB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0VmFsO1xuICB9XG5cbiAgJCRwYWNrYWdlRm9ySW5jbHVzaW9uKGRhdGEsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IHByZWZpeCA9IGAke29wdHMuZG9tYWluIHx8ICcnfSR7b3B0cy5wYXRoIHx8ICcnfWA7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYWNrYWdlIGluY2x1ZGVkIHR5cGU6ICR7ZGF0YS50eXBlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLiQkcmVsYXRlZFBhY2thZ2UoZGF0YSwgb3B0cyk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHNjaGVtYS4kZmllbGRzKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGZpZWxkICE9PSBzY2hlbWEuJGlkICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlICE9PSAnaGFzTWFueSc7XG4gICAgfSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBpZiAoZGF0YVtmaWVsZF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhdHRyaWJ1dGVzW2ZpZWxkXSA9IGRhdGFbZmllbGRdO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcmV0VmFsID0ge1xuICAgICAgdHlwZTogZGF0YS50eXBlLFxuICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgbGlua3M6IHtcbiAgICAgICAgc2VsZjogYCR7cHJlZml4fS8ke3NjaGVtYS4kbmFtZX0vJHtkYXRhLmlkfWAsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBpZiAoT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykubGVuZ3RoID4gMCkge1xuICAgICAgcmV0VmFsLnJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cblxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cblxuICAkJGluY2x1ZGVkUGFja2FnZShleHRlbmRlZCA9IHt9LCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBkb21haW46ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgcGF0aDogJy9hcGknLFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhleHRlbmRlZCkubWFwKHJlbGF0aW9uc2hpcCA9PiB7XG4gICAgICByZXR1cm4gZXh0ZW5kZWRbcmVsYXRpb25zaGlwXS5tYXAoY2hpbGQgPT4gdGhpcy4kJHBhY2thZ2VGb3JJbmNsdXNpb24oY2hpbGQsIG9wdGlvbnMpKTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gYWNjLmNvbmNhdChjdXJyKSwgW10pO1xuICB9XG59XG4iXX0=
