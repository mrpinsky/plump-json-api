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
    console.log('OPTS: ' + JSON.stringify(opts.baseURL));
    console.log('OPTIONS: ' + JSON.stringify(options.baseURL));

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiYmFzZVVSTCIsInNjaGVtYXRhIiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiJCRhZGRTY2hlbWEiLCJzIiwicmVzcG9uc2UiLCJqc29uIiwicGFyc2UiLCJkYXRhIiwiaW5jbHVkZWQiLCJyb290IiwiJCRwYXJzZURhdGFPYmplY3QiLCJleHRlbmRlZCIsIm1hcCIsIml0ZW0iLCJzY2hlbWEiLCJ0eXBlIiwiaW5jbHVkZSIsIiRpbmNsdWRlIiwiJCRlbmNvZGVEYXRhT2JqZWN0IiwiY2hpbGQiLCIkbmFtZSIsInVuZGVmaW5lZCIsIkVycm9yIiwibmFtZSIsIiRpZCIsImlkIiwiYXR0cmlidXRlcyIsIiQkcGFyc2VSZWxhdGlvbnNoaXBzIiwicmVsYXRpb25zaGlwcyIsImxpbmsiLCIkJGVuY29kZUF0dHJpYnV0ZXMiLCIkJGVuY29kZVJlbGF0aW9uc2hpcHMiLCJsaW5rcyIsInNlbGYiLCJrZXlzIiwiJGZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwiJCRhdHRyaWJ1dGVGaWVsZHMiLCJhdHRyIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsInBhcmVudElkIiwidHlwZU5hbWUiLCJyZWxOYW1lIiwicmVsRmllbGRzIiwicmVsYXRlZCIsInJlbGF0aW9uc2hpcCIsIiRzaWRlcyIsIm90aGVyIiwiJCRyZXNvdXJjZUlkZW50aWZpZXIiLCJyZWwiLCJyZXRWYWwiLCJtZXRhIiwia2V5IiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVlDLE9BQU8sV0FBUCxDQUFsQjs7SUFFYUMsTyxXQUFBQSxPO0FBQ1gscUJBQXVCO0FBQUE7O0FBQUEsUUFBWEMsSUFBVyx1RUFBSixFQUFJ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QUFPLEVBQUVlLFNBQVksT0FBS3RELE9BQWpCLFNBQTRCYyxLQUFLUSxJQUFqQyxTQUF5Q1IsS0FBS08sT0FBT1UsR0FBWixDQUF6QyxTQUE2RGEsS0FBL0QsRUFEQTtBQUVQOUIsZ0JBQU1BLEtBQUs4QixLQUFMLEVBQVl6QixHQUFaLENBQWdCLGVBQU87QUFDM0IsZ0JBQU1HLE9BQU9ELE9BQU9xQixPQUFQLENBQWVFLEtBQWYsRUFBc0JXLFlBQXRCLENBQW1DQyxNQUFuQyxDQUEwQ1osS0FBMUMsRUFBaURhLEtBQWpELENBQXVEbkMsSUFBcEU7QUFDQSxtQkFBTyxPQUFLb0Msb0JBQUwsQ0FBMEJwQyxJQUExQixFQUFnQ3FDLEdBQWhDLENBQVA7QUFDRCxXQUhLO0FBRkMsU0FEWDtBQVNELE9BVk0sRUFVSlosTUFWSSxDQVVHLFVBQUNDLEdBQUQsRUFBTUMsSUFBTjtBQUFBLGVBQWUsNEJBQWFELEdBQWIsRUFBa0JDLElBQWxCLENBQWY7QUFBQSxPQVZILEVBVTJDLEVBVjNDLENBQVA7QUFXRDs7O3lDQUVvQjNCLEksRUFBTXFDLEcsRUFBSztBQUM5QixVQUFNQyxTQUFTLEVBQUV0QyxNQUFNQSxJQUFSLEVBQWNVLElBQUkyQixJQUFJM0IsRUFBdEIsRUFBZjtBQUNBLFVBQU02QixPQUFPLEVBQWI7QUFDQSxXQUFLLElBQU1DLEdBQVgsSUFBa0JILEdBQWxCLEVBQXVCO0FBQ3JCLFlBQUlHLFFBQVEsSUFBWixFQUFrQjtBQUNoQkQsZUFBS0MsR0FBTCxJQUFZSCxJQUFJRyxHQUFKLENBQVo7QUFDRDtBQUNGO0FBQ0QsVUFBSWhFLE9BQU8yQyxJQUFQLENBQVlvQixJQUFaLEVBQWtCRSxNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUFFO0FBQ2xDSCxlQUFPQyxJQUFQLEdBQWNBLElBQWQ7QUFDRDtBQUNELGFBQU9ELE1BQVA7QUFDRCIsImZpbGUiOiJqc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1lcmdlT3B0aW9ucyBmcm9tICdtZXJnZS1vcHRpb25zJztcblxuY29uc3QgJHNjaGVtYXRhID0gU3ltYm9sKCckc2NoZW1hdGEnKTtcblxuZXhwb3J0IGNsYXNzIEpTT05BcGkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgYmFzZVVSTDogJycsXG4gICAgICBzY2hlbWF0YTogW10sXG4gICAgfSwgb3B0cyk7XG4gICAgY29uc29sZS5sb2coYE9QVFM6ICR7SlNPTi5zdHJpbmdpZnkob3B0cy5iYXNlVVJMKX1gKTtcbiAgICBjb25zb2xlLmxvZyhgT1BUSU9OUzogJHtKU09OLnN0cmluZ2lmeShvcHRpb25zLmJhc2VVUkwpfWApO1xuXG4gICAgdGhpcy5iYXNlVVJMID0gb3B0aW9ucy5iYXNlVVJMO1xuICAgIHRoaXNbJHNjaGVtYXRhXSA9IHt9O1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuc2NoZW1hdGEpKSB7XG4gICAgICBvcHRpb25zLnNjaGVtYXRhID0gW29wdGlvbnMuc2NoZW1hdGFdO1xuICAgIH1cbiAgICBvcHRpb25zLnNjaGVtYXRhLmZvckVhY2gocyA9PiB0aGlzLiQkYWRkU2NoZW1hKHMpKTtcbiAgfVxuXG4gIHBhcnNlKHJlc3BvbnNlKSB7XG4gICAgY29uc3QganNvbiA9IHR5cGVvZiByZXNwb25zZSA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHJlc3BvbnNlKSA6IHJlc3BvbnNlO1xuICAgIGNvbnN0IGRhdGEgPSBqc29uLmRhdGE7XG4gICAgY29uc3QgaW5jbHVkZWQgPSBqc29uLmluY2x1ZGVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuJCRwYXJzZURhdGFPYmplY3QoZGF0YSksXG4gICAgICBleHRlbmRlZDogaW5jbHVkZWQubWFwKGl0ZW0gPT4gdGhpcy4kJHBhcnNlRGF0YU9iamVjdChpdGVtKSksXG4gICAgfTtcbiAgfVxuXG4gIGVuY29kZSh7IHJvb3QsIGV4dGVuZGVkIH0sIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgaW5jbHVkZTogc2NoZW1hLiRpbmNsdWRlIH0sXG4gICAgICBvcHRzXG4gICAgKTtcblxuICAgIC8vIE5PVEU6IFRoaXMgaW1wbGVtZW50YXRpb24gZG9lcyBub3QgY3VycmVudGx5IGVuc3VyZSBmdWxsIGxpbmthZ2UuXG4gICAgLy8gSXQgYXNzdW1lcyB0aGF0IGV4dGVuZGVkIG9ubHkgY29udGFpbnMgZGF0YSB0aGF0IGlzIGxpbmtlZCB0b1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiB0aGlzLiQkZW5jb2RlRGF0YU9iamVjdChyb290LCBvcHRpb25zKSxcbiAgICAgIGluY2x1ZGVkOiBleHRlbmRlZC5tYXAoY2hpbGQgPT4gdGhpcy4kJGVuY29kZURhdGFPYmplY3QoY2hpbGQsIG9wdGlvbnMpKSxcbiAgICB9O1xuICB9XG5cbiAgJCRhZGRTY2hlbWEoc2NoZW1hKSB7XG4gICAgaWYgKHRoaXNbJHNjaGVtYXRhXVtzY2hlbWEuJG5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXNbJHNjaGVtYXRhXVtzY2hlbWEuJG5hbWVdID0gc2NoZW1hO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBzY2hlbWEgcmVnaXN0ZXJlZDogJHtzY2hlbWEubmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICAkJHBhcnNlRGF0YU9iamVjdChkYXRhKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNjaGVtYSBmb3IgdHlwZTogJHtkYXRhLnR5cGV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtZXJnZU9wdGlvbnMoXG4gICAgICAgIHsgdHlwZTogZGF0YS50eXBlLCBbc2NoZW1hLiRpZF06IGRhdGEuaWQgfSxcbiAgICAgICAgZGF0YS5hdHRyaWJ1dGVzLFxuICAgICAgICB0aGlzLiQkcGFyc2VSZWxhdGlvbnNoaXBzKGRhdGEuaWQsIGRhdGEucmVsYXRpb25zaGlwcylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgJCRlbmNvZGVEYXRhT2JqZWN0KGRhdGEsIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc2NoZW1hIGZvciB0eXBlOiAke2RhdGEudHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGluayA9IGAke3RoaXMuYmFzZVVSTH0vJHtkYXRhLnR5cGV9LyR7ZGF0YVtzY2hlbWEuJGlkXX1gO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICAgIGlkOiBkYXRhW3NjaGVtYS4kaWRdLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLiQkZW5jb2RlQXR0cmlidXRlcyhkYXRhKSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogdGhpcy4kJGVuY29kZVJlbGF0aW9uc2hpcHMoZGF0YSwgc2NoZW1hLCBvcHRzKSxcbiAgICAgICAgbGlua3M6IHsgc2VsZjogbGluayB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAkJGF0dHJpYnV0ZUZpZWxkcyh0eXBlKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3R5cGVdO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzY2hlbWEuJGZpZWxkcykuZmlsdGVyKGZpZWxkID0+IHtcbiAgICAgIHJldHVybiBmaWVsZCAhPT0gc2NoZW1hLiRpZCAmJiBzY2hlbWEuJGZpZWxkc1tmaWVsZF0udHlwZSAhPT0gJ2hhc01hbnknO1xuICAgIH0pO1xuICB9XG5cbiAgJCRlbmNvZGVBdHRyaWJ1dGVzKGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy4kJGF0dHJpYnV0ZUZpZWxkcyhkYXRhLnR5cGUpXG4gICAgICAubWFwKGF0dHIgPT4ge1xuICAgICAgICByZXR1cm4geyBbYXR0cl06IGRhdGFbYXR0cl0gfTtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKChhY2MsIGN1cnIpID0+IG1lcmdlT3B0aW9ucyhhY2MsIGN1cnIpLCB7fSk7XG4gIH1cblxuICAkJHBhcnNlUmVsYXRpb25zaGlwcyhwYXJlbnRJZCwgcmVsYXRpb25zaGlwcykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5tYXAocmVsTmFtZSA9PiB7XG4gICAgICAvLyBBbGwgY2hpbGRyZW4gaW4gdGhpcyByZWxhdGlvbnNoaXAgc2hvdWxkIGhhdmVcbiAgICAgIC8vIHRoZSBzYW1lIHR5cGUsIHNvIGdldCB0aGUgdHlwZSBvZiB0aGUgZmlyc3Qgb25lXG4gICAgICBjb25zdCB0eXBlTmFtZSA9IHJlbGF0aW9uc2hpcHNbcmVsTmFtZV0uZGF0YVswXS50eXBlO1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3R5cGVOYW1lXTtcbiAgICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSB0eXBlOiAke3R5cGVOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBbcmVsTmFtZV06IHJlbGF0aW9uc2hpcHNbcmVsTmFtZV0uZGF0YS5tYXAoY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiB7IGlkOiBjaGlsZC5pZCB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSkucmVkdWNlKChhY2MsIGN1cnIpID0+IG1lcmdlT3B0aW9ucyhhY2MsIGN1cnIpLCB7fSk7XG4gIH1cblxuICAkJGVuY29kZVJlbGF0aW9uc2hpcHMoZGF0YSwgc2NoZW1hLCBvcHRzKSB7XG4gICAgY29uc3QgcmVsRmllbGRzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGZpZWxkID0+IHtcbiAgICAgIHJldHVybiBzY2hlbWEuJGZpZWxkc1tmaWVsZF0gJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgPT09ICdoYXNNYW55JyAmJiBvcHRzLmluY2x1ZGVbZmllbGRdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbEZpZWxkcy5tYXAoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgIGxpbmtzOiB7IHJlbGF0ZWQ6IGAke3RoaXMuYmFzZVVSTH0vJHtkYXRhLnR5cGV9LyR7ZGF0YVtzY2hlbWEuJGlkXX0vJHtmaWVsZH1gIH0sXG4gICAgICAgICAgZGF0YTogZGF0YVtmaWVsZF0ubWFwKHJlbCA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLiRmaWVsZHNbZmllbGRdLnJlbGF0aW9uc2hpcC4kc2lkZXNbZmllbGRdLm90aGVyLnR5cGU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJHJlc291cmNlSWRlbnRpZmllcih0eXBlLCByZWwpO1xuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkcmVzb3VyY2VJZGVudGlmaWVyKHR5cGUsIHJlbCkge1xuICAgIGNvbnN0IHJldFZhbCA9IHsgdHlwZTogdHlwZSwgaWQ6IHJlbC5pZCB9O1xuICAgIGNvbnN0IG1ldGEgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByZWwpIHtcbiAgICAgIGlmIChrZXkgIT09ICdpZCcpIHtcbiAgICAgICAgbWV0YVtrZXldID0gcmVsW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhtZXRhKS5sZW5ndGggPiAwKSB7IC8vIG1ldGEgIT09IHt9XG4gICAgICByZXRWYWwubWV0YSA9IG1ldGE7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cbn1cbiJdfQ==
