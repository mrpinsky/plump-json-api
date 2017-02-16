'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONApi = undefined;

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
      baseURL: '',
      schemata: []
    }, opts);

    this.baseURL = options.baseURL;
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
      var _this3 = this;

      var root = _ref.root,
          extended = _ref.extended;

      var schema = this[$schemata][root.type];
      var options = Object.assign({ include: schema.$include }, opts);

      // NOTE: This implementation does not currently ensure full linkage.
      // It assumes that extended only contains data that is linked to
      return {
        data: this.$$encodeDataObject(root, options),
        included: extended.map(function (child) {
          return _this3.$$encodeDataObject(child, options);
        })
      };
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
    key: 'schema',
    value: function schema(name) {
      return this[$schemata][name];
    }
  }, {
    key: '$$parseDataObject',
    value: function $$parseDataObject(data) {
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
      var schema = this[$schemata][data.type];
      if (schema === undefined) {
        throw new Error('No schema for type: ' + data.type);
      } else {
        var link = this.baseURL + '/' + data.type + '/' + data[schema.$id];

        return {
          type: data.type,
          id: data[schema.$id],
          attributes: this.$$encodeAttributes(data),
          relationships: this.$$encodeRelationships(data, schema, opts),
          links: { self: link }
        };
      }
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
    key: '$$encodeAttributes',
    value: function $$encodeAttributes(data) {
      return this.$$attributeFields(data.type).map(function (attr) {
        return _defineProperty({}, attr, data[attr]);
      }).reduce(function (acc, curr) {
        return (0, _mergeOptions3.default)(acc, curr);
      }, {});
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
    key: '$$encodeRelationships',
    value: function $$encodeRelationships(data, schema, opts) {
      var _this5 = this;

      var relFields = Object.keys(data).filter(function (field) {
        return schema.$fields[field] && schema.$fields[field].type === 'hasMany' && opts.include[field];
      });

      return relFields.map(function (field) {
        return _defineProperty({}, field, {
          links: { related: _this5.baseURL + '/' + data.type + '/' + data[schema.$id] + '/' + field },
          data: data[field].map(function (rel) {
            var type = schema.$fields[field].relationship.$sides[field].other.type;
            return _this5.$$resourceIdentifier(type, rel);
          })
        });
      }).reduce(function (acc, curr) {
        return (0, _mergeOptions3.default)(acc, curr);
      }, {});
    }
  }, {
    key: '$$resourceIdentifier',
    value: function $$resourceIdentifier(type, rel) {
      var retVal = { type: type, id: rel.id };
      var meta = {};
      for (var key in rel) {
        if (key !== 'id') {
          meta[key] = rel[key];
        }
      }
      if (Object.keys(meta).length > 0) {
        // meta !== {}
        retVal.meta = meta;
      }
      return retVal;
    }
  }]);

  return JSONApi;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiYmFzZVVSTCIsInNjaGVtYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsIiQkYWRkU2NoZW1hIiwicyIsInJlc3BvbnNlIiwianNvbiIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJpbmNsdWRlZCIsInJvb3QiLCIkJHBhcnNlRGF0YU9iamVjdCIsImV4dGVuZGVkIiwibWFwIiwiaXRlbSIsInNjaGVtYSIsInR5cGUiLCJpbmNsdWRlIiwiJGluY2x1ZGUiLCIkJGVuY29kZURhdGFPYmplY3QiLCJjaGlsZCIsIiRuYW1lIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYW1lIiwiJGlkIiwiaWQiLCJhdHRyaWJ1dGVzIiwiJCRwYXJzZVJlbGF0aW9uc2hpcHMiLCJyZWxhdGlvbnNoaXBzIiwibGluayIsIiQkZW5jb2RlQXR0cmlidXRlcyIsIiQkZW5jb2RlUmVsYXRpb25zaGlwcyIsImxpbmtzIiwic2VsZiIsImtleXMiLCIkZmllbGRzIiwiZmlsdGVyIiwiZmllbGQiLCIkJGF0dHJpYnV0ZUZpZWxkcyIsImF0dHIiLCJyZWR1Y2UiLCJhY2MiLCJjdXJyIiwicGFyZW50SWQiLCJ0eXBlTmFtZSIsInJlbE5hbWUiLCJyZWxGaWVsZHMiLCJyZWxhdGVkIiwicmVsYXRpb25zaGlwIiwiJHNpZGVzIiwib3RoZXIiLCIkJHJlc291cmNlSWRlbnRpZmllciIsInJlbCIsInJldFZhbCIsIm1ldGEiLCJrZXkiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWUMsT0FBTyxXQUFQLENBQWxCOztJQUVhQyxPLFdBQUFBLE87QUFDWCxxQkFBdUI7QUFBQTs7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3JCLFFBQU1DLFVBQVVDLE9B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L0QsRUFEQTtBQUVQOUIsZ0JBQU1BLEtBQUs4QixLQUFMLEVBQVl6QixHQUFaLENBQWdCLGVBQU87QUFDM0IsZ0JBQU1HLE9BQU9ELE9BQU9xQixPQUFQLENBQWVFLEtBQWYsRUFBc0JXLFlBQXRCLENBQW1DQyxNQUFuQyxDQUEwQ1osS0FBMUMsRUFBaURhLEtBQWpELENBQXVEbkMsSUFBcEU7QUFDQSxtQkFBTyxPQUFLb0Msb0JBQUwsQ0FBMEJwQyxJQUExQixFQUFnQ3FDLEdBQWhDLENBQVA7QUFDRCxXQUhLO0FBRkMsU0FEWDtBQVNELE9BVk0sRUFVSlosTUFWSSxDQVVHLFVBQUNDLEdBQUQsRUFBTUMsSUFBTjtBQUFBLGVBQWUsNEJBQWFELEdBQWIsRUFBa0JDLElBQWxCLENBQWY7QUFBQSxPQVZILEVBVTJDLEVBVjNDLENBQVA7QUFXRDs7O3lDQUVvQjNCLEksRUFBTXFDLEcsRUFBSztBQUM5QixVQUFNQyxTQUFTLEVBQUV0QyxNQUFNQSxJQUFSLEVBQWNVLElBQUkyQixJQUFJM0IsRUFBdEIsRUFBZjtBQUNBLFVBQU02QixPQUFPLEVBQWI7QUFDQSxXQUFLLElBQU1DLEdBQVgsSUFBa0JILEdBQWxCLEVBQXVCO0FBQ3JCLFlBQUlHLFFBQVEsSUFBWixFQUFrQjtBQUNoQkQsZUFBS0MsR0FBTCxJQUFZSCxJQUFJRyxHQUFKLENBQVo7QUFDRDtBQUNGO0FBQ0QsVUFBSTdELE9BQU93QyxJQUFQLENBQVlvQixJQUFaLEVBQWtCRSxNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUFFO0FBQ2xDSCxlQUFPQyxJQUFQLEdBQWNBLElBQWQ7QUFDRDtBQUNELGFBQU9ELE1BQVA7QUFDRCIsImZpbGUiOiJqc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1lcmdlT3B0aW9ucyBmcm9tICdtZXJnZS1vcHRpb25zJztcblxuY29uc3QgJHNjaGVtYXRhID0gU3ltYm9sKCckc2NoZW1hdGEnKTtcblxuZXhwb3J0IGNsYXNzIEpTT05BcGkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgYmFzZVVSTDogJycsXG4gICAgICBzY2hlbWF0YTogW10sXG4gICAgfSwgb3B0cyk7XG5cbiAgICB0aGlzLmJhc2VVUkwgPSBvcHRpb25zLmJhc2VVUkw7XG4gICAgdGhpc1skc2NoZW1hdGFdID0ge307XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5zY2hlbWF0YSkpIHtcbiAgICAgIG9wdGlvbnMuc2NoZW1hdGEgPSBbb3B0aW9ucy5zY2hlbWF0YV07XG4gICAgfVxuICAgIG9wdGlvbnMuc2NoZW1hdGEuZm9yRWFjaChzID0+IHRoaXMuJCRhZGRTY2hlbWEocykpO1xuICB9XG5cbiAgcGFyc2UocmVzcG9uc2UpIHtcbiAgICBjb25zdCBqc29uID0gdHlwZW9mIHJlc3BvbnNlID09PSAnc3RyaW5nJyA/IEpTT04ucGFyc2UocmVzcG9uc2UpIDogcmVzcG9uc2U7XG4gICAgY29uc3QgZGF0YSA9IGpzb24uZGF0YTtcbiAgICBjb25zdCBpbmNsdWRlZCA9IGpzb24uaW5jbHVkZWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy4kJHBhcnNlRGF0YU9iamVjdChkYXRhKSxcbiAgICAgIGV4dGVuZGVkOiBpbmNsdWRlZC5tYXAoaXRlbSA9PiB0aGlzLiQkcGFyc2VEYXRhT2JqZWN0KGl0ZW0pKSxcbiAgICB9O1xuICB9XG5cbiAgZW5jb2RlKHsgcm9vdCwgZXh0ZW5kZWQgfSwgb3B0cykge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBpbmNsdWRlOiBzY2hlbWEuJGluY2x1ZGUgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuXG4gICAgLy8gTk9URTogVGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBjdXJyZW50bHkgZW5zdXJlIGZ1bGwgbGlua2FnZS5cbiAgICAvLyBJdCBhc3N1bWVzIHRoYXQgZXh0ZW5kZWQgb25seSBjb250YWlucyBkYXRhIHRoYXQgaXMgbGlua2VkIHRvXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IHRoaXMuJCRlbmNvZGVEYXRhT2JqZWN0KHJvb3QsIG9wdGlvbnMpLFxuICAgICAgaW5jbHVkZWQ6IGV4dGVuZGVkLm1hcChjaGlsZCA9PiB0aGlzLiQkZW5jb2RlRGF0YU9iamVjdChjaGlsZCwgb3B0aW9ucykpLFxuICAgIH07XG4gIH1cblxuICAkJGFkZFNjaGVtYShzY2hlbWEpIHtcbiAgICBpZiAodGhpc1skc2NoZW1hdGFdW3NjaGVtYS4kbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1skc2NoZW1hdGFdW3NjaGVtYS4kbmFtZV0gPSBzY2hlbWE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIHNjaGVtYSByZWdpc3RlcmVkOiAke3NjaGVtYS5uYW1lfWApO1xuICAgIH1cbiAgfVxuXG4gIHNjaGVtYShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXNbJHNjaGVtYXRhXVtuYW1lXTtcbiAgfVxuXG4gICQkcGFyc2VEYXRhT2JqZWN0KGRhdGEpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc2NoZW1hIGZvciB0eXBlOiAke2RhdGEudHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1lcmdlT3B0aW9ucyhcbiAgICAgICAgeyB0eXBlOiBkYXRhLnR5cGUsIFtzY2hlbWEuJGlkXTogZGF0YS5pZCB9LFxuICAgICAgICBkYXRhLmF0dHJpYnV0ZXMsXG4gICAgICAgIHRoaXMuJCRwYXJzZVJlbGF0aW9uc2hpcHMoZGF0YS5pZCwgZGF0YS5yZWxhdGlvbnNoaXBzKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAkJGVuY29kZURhdGFPYmplY3QoZGF0YSwgb3B0cykge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtkYXRhLnR5cGVdO1xuICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzY2hlbWEgZm9yIHR5cGU6ICR7ZGF0YS50eXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBsaW5rID0gYCR7dGhpcy5iYXNlVVJMfS8ke2RhdGEudHlwZX0vJHtkYXRhW3NjaGVtYS4kaWRdfWA7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgaWQ6IGRhdGFbc2NoZW1hLiRpZF0sXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuJCRlbmNvZGVBdHRyaWJ1dGVzKGRhdGEpLFxuICAgICAgICByZWxhdGlvbnNoaXBzOiB0aGlzLiQkZW5jb2RlUmVsYXRpb25zaGlwcyhkYXRhLCBzY2hlbWEsIG9wdHMpLFxuICAgICAgICBsaW5rczogeyBzZWxmOiBsaW5rIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gICQkYXR0cmlidXRlRmllbGRzKHR5cGUpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bdHlwZV07XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNjaGVtYS4kZmllbGRzKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGZpZWxkICE9PSBzY2hlbWEuJGlkICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlICE9PSAnaGFzTWFueSc7XG4gICAgfSk7XG4gIH1cblxuICAkJGVuY29kZUF0dHJpYnV0ZXMoZGF0YSkge1xuICAgIHJldHVybiB0aGlzLiQkYXR0cmlidXRlRmllbGRzKGRhdGEudHlwZSlcbiAgICAgIC5tYXAoYXR0ciA9PiB7XG4gICAgICAgIHJldHVybiB7IFthdHRyXTogZGF0YVthdHRyXSB9O1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkcGFyc2VSZWxhdGlvbnNoaXBzKHBhcmVudElkLCByZWxhdGlvbnNoaXBzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLm1hcChyZWxOYW1lID0+IHtcbiAgICAgIC8vIEFsbCBjaGlsZHJlbiBpbiB0aGlzIHJlbGF0aW9uc2hpcCBzaG91bGQgaGF2ZVxuICAgICAgLy8gdGhlIHNhbWUgdHlwZSwgc28gZ2V0IHRoZSB0eXBlIG9mIHRoZSBmaXJzdCBvbmVcbiAgICAgIGNvbnN0IHR5cGVOYW1lID0gcmVsYXRpb25zaGlwc1tyZWxOYW1lXS5kYXRhWzBdLnR5cGU7XG4gICAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bdHlwZU5hbWVdO1xuICAgICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIHR5cGU6ICR7dHlwZU5hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIFtyZWxOYW1lXTogcmVsYXRpb25zaGlwc1tyZWxOYW1lXS5kYXRhLm1hcChjaGlsZCA9PiB7XG4gICAgICAgICAgcmV0dXJuIHsgaWQ6IGNoaWxkLmlkIH07XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkZW5jb2RlUmVsYXRpb25zaGlwcyhkYXRhLCBzY2hlbWEsIG9wdHMpIHtcbiAgICBjb25zdCByZWxGaWVsZHMgPSBPYmplY3Qua2V5cyhkYXRhKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIHNjaGVtYS4kZmllbGRzW2ZpZWxkXSAmJiBzY2hlbWEuJGZpZWxkc1tmaWVsZF0udHlwZSA9PT0gJ2hhc01hbnknICYmIG9wdHMuaW5jbHVkZVtmaWVsZF07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVsRmllbGRzLm1hcChmaWVsZCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRdOiB7XG4gICAgICAgICAgbGlua3M6IHsgcmVsYXRlZDogYCR7dGhpcy5iYXNlVVJMfS8ke2RhdGEudHlwZX0vJHtkYXRhW3NjaGVtYS4kaWRdfS8ke2ZpZWxkfWAgfSxcbiAgICAgICAgICBkYXRhOiBkYXRhW2ZpZWxkXS5tYXAocmVsID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWEuJGZpZWxkc1tmaWVsZF0ucmVsYXRpb25zaGlwLiRzaWRlc1tmaWVsZF0ub3RoZXIudHlwZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQkcmVzb3VyY2VJZGVudGlmaWVyKHR5cGUsIHJlbCk7XG4gICAgICAgICAgfSksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0pLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBtZXJnZU9wdGlvbnMoYWNjLCBjdXJyKSwge30pO1xuICB9XG5cbiAgJCRyZXNvdXJjZUlkZW50aWZpZXIodHlwZSwgcmVsKSB7XG4gICAgY29uc3QgcmV0VmFsID0geyB0eXBlOiB0eXBlLCBpZDogcmVsLmlkIH07XG4gICAgY29uc3QgbWV0YSA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIHJlbCkge1xuICAgICAgaWYgKGtleSAhPT0gJ2lkJykge1xuICAgICAgICBtZXRhW2tleV0gPSByZWxba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKG1ldGEpLmxlbmd0aCA+IDApIHsgLy8gbWV0YSAhPT0ge31cbiAgICAgIHJldFZhbC5tZXRhID0gbWV0YTtcbiAgICB9XG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxufVxuIl19
