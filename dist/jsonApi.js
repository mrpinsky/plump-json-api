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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwiYmFzZVVSTCIsInNjaGVtYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsIiQkYWRkU2NoZW1hIiwicyIsInJlc3BvbnNlIiwianNvbiIsIkpTT04iLCJwYXJzZSIsImRhdGEiLCJpbmNsdWRlZCIsInJvb3QiLCIkJHBhcnNlRGF0YU9iamVjdCIsImV4dGVuZGVkIiwibWFwIiwiaXRlbSIsInNjaGVtYSIsInR5cGUiLCJpbmNsdWRlIiwiJGluY2x1ZGUiLCIkJGVuY29kZURhdGFPYmplY3QiLCJjaGlsZCIsIiRuYW1lIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYW1lIiwiJGlkIiwiaWQiLCJhdHRyaWJ1dGVzIiwiJCRwYXJzZVJlbGF0aW9uc2hpcHMiLCJyZWxhdGlvbnNoaXBzIiwibGluayIsIiQkZW5jb2RlQXR0cmlidXRlcyIsIiQkZW5jb2RlUmVsYXRpb25zaGlwcyIsImxpbmtzIiwic2VsZiIsImtleXMiLCIkZmllbGRzIiwiZmlsdGVyIiwiZmllbGQiLCIkJGF0dHJpYnV0ZUZpZWxkcyIsImF0dHIiLCJyZWR1Y2UiLCJhY2MiLCJjdXJyIiwicGFyZW50SWQiLCJ0eXBlTmFtZSIsInJlbE5hbWUiLCJyZWxGaWVsZHMiLCJyZWxhdGVkIiwicmVsYXRpb25zaGlwIiwiJHNpZGVzIiwib3RoZXIiLCIkJHJlc291cmNlSWRlbnRpZmllciIsInJlbCIsInJldFZhbCIsIm1ldGEiLCJrZXkiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWUMsT0FBTyxXQUFQLENBQWxCOztJQUVhQyxPLFdBQUFBLE87QUFDWCxxQkFBdUI7QUFBQTs7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3JCLFFBQU1DLFVBQVVDLE9B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LGdCQUFNRyxPQUFPRCxPQUFPcUIsT0FBUCxDQUFlRSxLQUFmLEVBQXNCVyxZQUF0QixDQUFtQ0MsTUFBbkMsQ0FBMENaLEtBQTFDLEVBQWlEYSxLQUFqRCxDQUF1RG5DLElBQXBFO0FBQ0EsbUJBQU8sT0FBS29DLG9CQUFMLENBQTBCcEMsSUFBMUIsRUFBZ0NxQyxHQUFoQyxDQUFQO0FBQ0QsV0FISztBQUZDLFNBRFg7QUFTRCxPQVZNLEVBVUpaLE1BVkksQ0FVRyxVQUFDQyxHQUFELEVBQU1DLElBQU47QUFBQSxlQUFlLDRCQUFhRCxHQUFiLEVBQWtCQyxJQUFsQixDQUFmO0FBQUEsT0FWSCxFQVUyQyxFQVYzQyxDQUFQO0FBV0Q7Ozt5Q0FFb0IzQixJLEVBQU1xQyxHLEVBQUs7QUFDOUIsVUFBTUMsU0FBUyxFQUFFdEMsTUFBTUEsSUFBUixFQUFjVSxJQUFJMkIsSUFBSTNCLEVBQXRCLEVBQWY7QUFDQSxVQUFNNkIsT0FBTyxFQUFiO0FBQ0EsV0FBSyxJQUFNQyxHQUFYLElBQWtCSCxHQUFsQixFQUF1QjtBQUNyQixZQUFJRyxRQUFRLElBQVosRUFBa0I7QUFDaEJELGVBQUtDLEdBQUwsSUFBWUgsSUFBSUcsR0FBSixDQUFaO0FBQ0Q7QUFDRjtBQUNELFVBQUk3RCxPQUFPd0MsSUFBUCxDQUFZb0IsSUFBWixFQUFrQkUsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFBRTtBQUNsQ0gsZUFBT0MsSUFBUCxHQUFjQSxJQUFkO0FBQ0Q7QUFDRCxhQUFPRCxNQUFQO0FBQ0QiLCJmaWxlIjoianNvbkFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtZXJnZU9wdGlvbnMgZnJvbSAnbWVyZ2Utb3B0aW9ucyc7XG5cbmNvbnN0ICRzY2hlbWF0YSA9IFN5bWJvbCgnJHNjaGVtYXRhJyk7XG5cbmV4cG9ydCBjbGFzcyBKU09OQXBpIHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIGJhc2VVUkw6ICcnLFxuICAgICAgc2NoZW1hdGE6IFtdLFxuICAgIH0sIG9wdHMpO1xuXG4gICAgdGhpcy5iYXNlVVJMID0gb3B0aW9ucy5iYXNlVVJMO1xuICAgIHRoaXNbJHNjaGVtYXRhXSA9IHt9O1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuc2NoZW1hdGEpKSB7XG4gICAgICBvcHRpb25zLnNjaGVtYXRhID0gW29wdGlvbnMuc2NoZW1hdGFdO1xuICAgIH1cbiAgICBvcHRpb25zLnNjaGVtYXRhLmZvckVhY2gocyA9PiB0aGlzLiQkYWRkU2NoZW1hKHMpKTtcbiAgfVxuXG4gIHBhcnNlKHJlc3BvbnNlKSB7XG4gICAgY29uc3QganNvbiA9IHR5cGVvZiByZXNwb25zZSA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHJlc3BvbnNlKSA6IHJlc3BvbnNlO1xuICAgIGNvbnN0IGRhdGEgPSBqc29uLmRhdGE7XG4gICAgY29uc3QgaW5jbHVkZWQgPSBqc29uLmluY2x1ZGVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuJCRwYXJzZURhdGFPYmplY3QoZGF0YSksXG4gICAgICBleHRlbmRlZDogaW5jbHVkZWQubWFwKGl0ZW0gPT4gdGhpcy4kJHBhcnNlRGF0YU9iamVjdChpdGVtKSksXG4gICAgfTtcbiAgfVxuXG4gIGVuY29kZSh7IHJvb3QsIGV4dGVuZGVkIH0sIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgaW5jbHVkZTogc2NoZW1hLiRpbmNsdWRlIH0sXG4gICAgICBvcHRzXG4gICAgKTtcblxuICAgIC8vIE5PVEU6IFRoaXMgaW1wbGVtZW50YXRpb24gZG9lcyBub3QgY3VycmVudGx5IGVuc3VyZSBmdWxsIGxpbmthZ2UuXG4gICAgLy8gSXQgYXNzdW1lcyB0aGF0IGV4dGVuZGVkIG9ubHkgY29udGFpbnMgZGF0YSB0aGF0IGlzIGxpbmtlZCB0b1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiB0aGlzLiQkZW5jb2RlRGF0YU9iamVjdChyb290LCBvcHRpb25zKSxcbiAgICAgIGluY2x1ZGVkOiBleHRlbmRlZC5tYXAoY2hpbGQgPT4gdGhpcy4kJGVuY29kZURhdGFPYmplY3QoY2hpbGQsIG9wdGlvbnMpKSxcbiAgICB9O1xuICB9XG5cbiAgJCRhZGRTY2hlbWEoc2NoZW1hKSB7XG4gICAgaWYgKHRoaXNbJHNjaGVtYXRhXVtzY2hlbWEuJG5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXNbJHNjaGVtYXRhXVtzY2hlbWEuJG5hbWVdID0gc2NoZW1hO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBzY2hlbWEgcmVnaXN0ZXJlZDogJHtzY2hlbWEubmFtZX1gKTtcbiAgICB9XG4gIH1cblxuICAkJHBhcnNlRGF0YU9iamVjdChkYXRhKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNjaGVtYSBmb3IgdHlwZTogJHtkYXRhLnR5cGV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtZXJnZU9wdGlvbnMoXG4gICAgICAgIHsgdHlwZTogZGF0YS50eXBlLCBbc2NoZW1hLiRpZF06IGRhdGEuaWQgfSxcbiAgICAgICAgZGF0YS5hdHRyaWJ1dGVzLFxuICAgICAgICB0aGlzLiQkcGFyc2VSZWxhdGlvbnNoaXBzKGRhdGEuaWQsIGRhdGEucmVsYXRpb25zaGlwcylcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgJCRlbmNvZGVEYXRhT2JqZWN0KGRhdGEsIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gc2NoZW1hIGZvciB0eXBlOiAke2RhdGEudHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbGluayA9IGAke3RoaXMuYmFzZVVSTH0vJHtkYXRhLnR5cGV9LyR7ZGF0YVtzY2hlbWEuJGlkXX1gO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICAgIGlkOiBkYXRhW3NjaGVtYS4kaWRdLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLiQkZW5jb2RlQXR0cmlidXRlcyhkYXRhKSxcbiAgICAgICAgcmVsYXRpb25zaGlwczogdGhpcy4kJGVuY29kZVJlbGF0aW9uc2hpcHMoZGF0YSwgc2NoZW1hLCBvcHRzKSxcbiAgICAgICAgbGlua3M6IHsgc2VsZjogbGluayB9LFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAkJGF0dHJpYnV0ZUZpZWxkcyh0eXBlKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3R5cGVdO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhzY2hlbWEuJGZpZWxkcykuZmlsdGVyKGZpZWxkID0+IHtcbiAgICAgIHJldHVybiBmaWVsZCAhPT0gc2NoZW1hLiRpZCAmJiBzY2hlbWEuJGZpZWxkc1tmaWVsZF0udHlwZSAhPT0gJ2hhc01hbnknO1xuICAgIH0pO1xuICB9XG5cbiAgJCRlbmNvZGVBdHRyaWJ1dGVzKGRhdGEpIHtcbiAgICByZXR1cm4gdGhpcy4kJGF0dHJpYnV0ZUZpZWxkcyhkYXRhLnR5cGUpXG4gICAgICAubWFwKGF0dHIgPT4ge1xuICAgICAgICByZXR1cm4geyBbYXR0cl06IGRhdGFbYXR0cl0gfTtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKChhY2MsIGN1cnIpID0+IG1lcmdlT3B0aW9ucyhhY2MsIGN1cnIpLCB7fSk7XG4gIH1cblxuICAkJHBhcnNlUmVsYXRpb25zaGlwcyhwYXJlbnRJZCwgcmVsYXRpb25zaGlwcykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5tYXAocmVsTmFtZSA9PiB7XG4gICAgICAvLyBBbGwgY2hpbGRyZW4gaW4gdGhpcyByZWxhdGlvbnNoaXAgc2hvdWxkIGhhdmVcbiAgICAgIC8vIHRoZSBzYW1lIHR5cGUsIHNvIGdldCB0aGUgdHlwZSBvZiB0aGUgZmlyc3Qgb25lXG4gICAgICBjb25zdCB0eXBlTmFtZSA9IHJlbGF0aW9uc2hpcHNbcmVsTmFtZV0uZGF0YVswXS50eXBlO1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3R5cGVOYW1lXTtcbiAgICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSB0eXBlOiAke3R5cGVOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBbcmVsTmFtZV06IHJlbGF0aW9uc2hpcHNbcmVsTmFtZV0uZGF0YS5tYXAoY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiB7IGlkOiBjaGlsZC5pZCB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSkucmVkdWNlKChhY2MsIGN1cnIpID0+IG1lcmdlT3B0aW9ucyhhY2MsIGN1cnIpLCB7fSk7XG4gIH1cblxuICAkJGVuY29kZVJlbGF0aW9uc2hpcHMoZGF0YSwgc2NoZW1hLCBvcHRzKSB7XG4gICAgY29uc3QgcmVsRmllbGRzID0gT2JqZWN0LmtleXMoZGF0YSkuZmlsdGVyKGZpZWxkID0+IHtcbiAgICAgIHJldHVybiBzY2hlbWEuJGZpZWxkc1tmaWVsZF0gJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgPT09ICdoYXNNYW55JyAmJiBvcHRzLmluY2x1ZGVbZmllbGRdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlbEZpZWxkcy5tYXAoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgIGxpbmtzOiB7IHJlbGF0ZWQ6IGAke3RoaXMuYmFzZVVSTH0vJHtkYXRhLnR5cGV9LyR7ZGF0YVtzY2hlbWEuJGlkXX0vJHtmaWVsZH1gIH0sXG4gICAgICAgICAgZGF0YTogZGF0YVtmaWVsZF0ubWFwKHJlbCA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLiRmaWVsZHNbZmllbGRdLnJlbGF0aW9uc2hpcC4kc2lkZXNbZmllbGRdLm90aGVyLnR5cGU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJHJlc291cmNlSWRlbnRpZmllcih0eXBlLCByZWwpO1xuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkcmVzb3VyY2VJZGVudGlmaWVyKHR5cGUsIHJlbCkge1xuICAgIGNvbnN0IHJldFZhbCA9IHsgdHlwZTogdHlwZSwgaWQ6IHJlbC5pZCB9O1xuICAgIGNvbnN0IG1ldGEgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByZWwpIHtcbiAgICAgIGlmIChrZXkgIT09ICdpZCcpIHtcbiAgICAgICAgbWV0YVtrZXldID0gcmVsW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhtZXRhKS5sZW5ndGggPiAwKSB7IC8vIG1ldGEgIT09IHt9XG4gICAgICByZXRWYWwubWV0YSA9IG1ldGE7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cbn1cbiJdfQ==
