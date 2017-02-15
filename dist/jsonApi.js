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
      var _this3 = this;

      var root = _ref.root,
          extended = _ref.extended;

      var schema = this[$schemata][root.type];
      var options = {
        prefix: '' + (opts.domain || '') + (opts.path || ''),
        include: schema.$include
      };

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
        var options = Object.assign({}, {
          include: schema.$include,
          prefix: ''
        }, opts);

        var link = options.prefix + '/' + data.type + '/' + data[schema.$id];

        return {
          type: data.type,
          id: data[schema.$id],
          attributes: this.$$encodeAttributes(data),
          relationships: this.$$encodeRelationships(data, schema, Object.assign(options, { prefix: link })),
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
          links: { related: opts.prefix + '/' + field },
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwic2NoZW1hdGEiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiJCRhZGRTY2hlbWEiLCJzIiwicmVzcG9uc2UiLCJqc29uIiwiSlNPTiIsInBhcnNlIiwiZGF0YSIsImluY2x1ZGVkIiwicm9vdCIsIiQkcGFyc2VEYXRhT2JqZWN0IiwiZXh0ZW5kZWQiLCJtYXAiLCJpdGVtIiwic2NoZW1hIiwidHlwZSIsInByZWZpeCIsImRvbWFpbiIsInBhdGgiLCJpbmNsdWRlIiwiJGluY2x1ZGUiLCIkJGVuY29kZURhdGFPYmplY3QiLCJjaGlsZCIsIiRuYW1lIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJuYW1lIiwiJGlkIiwiaWQiLCJhdHRyaWJ1dGVzIiwiJCRwYXJzZVJlbGF0aW9uc2hpcHMiLCJyZWxhdGlvbnNoaXBzIiwibGluayIsIiQkZW5jb2RlQXR0cmlidXRlcyIsIiQkZW5jb2RlUmVsYXRpb25zaGlwcyIsImxpbmtzIiwic2VsZiIsImtleXMiLCIkZmllbGRzIiwiZmlsdGVyIiwiZmllbGQiLCIkJGF0dHJpYnV0ZUZpZWxkcyIsImF0dHIiLCJyZWR1Y2UiLCJhY2MiLCJjdXJyIiwicGFyZW50SWQiLCJ0eXBlTmFtZSIsInJlbE5hbWUiLCJyZWxGaWVsZHMiLCJyZWxhdGVkIiwicmVsYXRpb25zaGlwIiwiJHNpZGVzIiwib3RoZXIiLCIkJHJlc291cmNlSWRlbnRpZmllciIsInJlbCIsInJldFZhbCIsIm1ldGEiLCJrZXkiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWUMsT0FBTyxXQUFQLENBQWxCOztJQUVhQyxPLFdBQUFBLE87QUFDWCxxQkFBdUI7QUFBQTs7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3JC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Q0c0QixLQURILEVBQ1c7QUFDUEwsaUJBQU8sRUFBRWUsU0FBWXpELEtBQUt1QixNQUFqQixTQUEyQndCLEtBQTdCLEVBREE7QUFFUGpDLGdCQUFNQSxLQUFLaUMsS0FBTCxFQUFZNUIsR0FBWixDQUFnQixlQUFPO0FBQzNCLGdCQUFNRyxPQUFPRCxPQUFPd0IsT0FBUCxDQUFlRSxLQUFmLEVBQXNCVyxZQUF0QixDQUFtQ0MsTUFBbkMsQ0FBMENaLEtBQTFDLEVBQWlEYSxLQUFqRCxDQUF1RHRDLElBQXBFO0FBQ0EsbUJBQU8sT0FBS3VDLG9CQUFMLENBQTBCdkMsSUFBMUIsRUFBZ0N3QyxHQUFoQyxDQUFQO0FBQ0QsV0FISztBQUZDLFNBRFg7QUFTRCxPQVZNLEVBVUpaLE1BVkksQ0FVRyxVQUFDQyxHQUFELEVBQU1DLElBQU47QUFBQSxlQUFlLDRCQUFhRCxHQUFiLEVBQWtCQyxJQUFsQixDQUFmO0FBQUEsT0FWSCxFQVUyQyxFQVYzQyxDQUFQO0FBV0Q7Ozt5Q0FFb0I5QixJLEVBQU13QyxHLEVBQUs7QUFDOUIsVUFBTUMsU0FBUyxFQUFFekMsTUFBTUEsSUFBUixFQUFjYSxJQUFJMkIsSUFBSTNCLEVBQXRCLEVBQWY7QUFDQSxVQUFNNkIsT0FBTyxFQUFiO0FBQ0EsV0FBSyxJQUFNQyxHQUFYLElBQWtCSCxHQUFsQixFQUF1QjtBQUNyQixZQUFJRyxRQUFRLElBQVosRUFBa0I7QUFDaEJELGVBQUtDLEdBQUwsSUFBWUgsSUFBSUcsR0FBSixDQUFaO0FBQ0Q7QUFDRjtBQUNELFVBQUkvRCxPQUFPMEMsSUFBUCxDQUFZb0IsSUFBWixFQUFrQkUsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0M7QUFBRTtBQUNsQ0gsZUFBT0MsSUFBUCxHQUFjQSxJQUFkO0FBQ0Q7QUFDRCxhQUFPRCxNQUFQO0FBQ0QiLCJmaWxlIjoianNvbkFwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtZXJnZU9wdGlvbnMgZnJvbSAnbWVyZ2Utb3B0aW9ucyc7XG5cbmNvbnN0ICRzY2hlbWF0YSA9IFN5bWJvbCgnJHNjaGVtYXRhJyk7XG5cbmV4cG9ydCBjbGFzcyBKU09OQXBpIHtcbiAgY29uc3RydWN0b3Iob3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgIHNjaGVtYXRhOiBbXSxcbiAgICB9LCBvcHRzKTtcblxuICAgIHRoaXNbJHNjaGVtYXRhXSA9IHt9O1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuc2NoZW1hdGEpKSB7XG4gICAgICBvcHRpb25zLnNjaGVtYXRhID0gW29wdGlvbnMuc2NoZW1hdGFdO1xuICAgIH1cbiAgICBvcHRpb25zLnNjaGVtYXRhLmZvckVhY2gocyA9PiB0aGlzLiQkYWRkU2NoZW1hKHMpKTtcbiAgfVxuXG4gIHBhcnNlKHJlc3BvbnNlKSB7XG4gICAgY29uc3QganNvbiA9IHR5cGVvZiByZXNwb25zZSA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKHJlc3BvbnNlKSA6IHJlc3BvbnNlO1xuICAgIGNvbnN0IGRhdGEgPSBqc29uLmRhdGE7XG4gICAgY29uc3QgaW5jbHVkZWQgPSBqc29uLmluY2x1ZGVkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuJCRwYXJzZURhdGFPYmplY3QoZGF0YSksXG4gICAgICBleHRlbmRlZDogaW5jbHVkZWQubWFwKGl0ZW0gPT4gdGhpcy4kJHBhcnNlRGF0YU9iamVjdChpdGVtKSksXG4gICAgfTtcbiAgfVxuXG4gIGVuY29kZSh7IHJvb3QsIGV4dGVuZGVkIH0sIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgcHJlZml4OiBgJHtvcHRzLmRvbWFpbiB8fCAnJ30ke29wdHMucGF0aCB8fCAnJ31gLFxuICAgICAgaW5jbHVkZTogc2NoZW1hLiRpbmNsdWRlLFxuICAgIH07XG5cbiAgICAvLyBOT1RFOiBUaGlzIGltcGxlbWVudGF0aW9uIGRvZXMgbm90IGN1cnJlbnRseSBlbnN1cmUgZnVsbCBsaW5rYWdlLlxuICAgIC8vIEl0IGFzc3VtZXMgdGhhdCBleHRlbmRlZCBvbmx5IGNvbnRhaW5zIGRhdGEgdGhhdCBpcyBsaW5rZWQgdG9cbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogdGhpcy4kJGVuY29kZURhdGFPYmplY3Qocm9vdCwgb3B0aW9ucyksXG4gICAgICBpbmNsdWRlZDogZXh0ZW5kZWQubWFwKGNoaWxkID0+IHRoaXMuJCRlbmNvZGVEYXRhT2JqZWN0KGNoaWxkLCBvcHRpb25zKSksXG4gICAgfTtcbiAgfVxuXG4gICQkYWRkU2NoZW1hKHNjaGVtYSkge1xuICAgIGlmICh0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzWyRzY2hlbWF0YV1bc2NoZW1hLiRuYW1lXSA9IHNjaGVtYTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgc2NoZW1hIHJlZ2lzdGVyZWQ6ICR7c2NoZW1hLm5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgJCRwYXJzZURhdGFPYmplY3QoZGF0YSkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVtkYXRhLnR5cGVdO1xuICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzY2hlbWEgZm9yIHR5cGU6ICR7ZGF0YS50eXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWVyZ2VPcHRpb25zKFxuICAgICAgICB7IHR5cGU6IGRhdGEudHlwZSwgW3NjaGVtYS4kaWRdOiBkYXRhLmlkIH0sXG4gICAgICAgIGRhdGEuYXR0cmlidXRlcyxcbiAgICAgICAgdGhpcy4kJHBhcnNlUmVsYXRpb25zaGlwcyhkYXRhLmlkLCBkYXRhLnJlbGF0aW9uc2hpcHMpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gICQkZW5jb2RlRGF0YU9iamVjdChkYXRhLCBvcHRzKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNjaGVtYSBmb3IgdHlwZTogJHtkYXRhLnR5cGV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7fSxcbiAgICAgICAge1xuICAgICAgICAgIGluY2x1ZGU6IHNjaGVtYS4kaW5jbHVkZSxcbiAgICAgICAgICBwcmVmaXg6ICcnLFxuICAgICAgICB9LFxuICAgICAgICBvcHRzXG4gICAgICApO1xuXG4gICAgICBjb25zdCBsaW5rID0gYCR7b3B0aW9ucy5wcmVmaXh9LyR7ZGF0YS50eXBlfS8ke2RhdGFbc2NoZW1hLiRpZF19YDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogZGF0YS50eXBlLFxuICAgICAgICBpZDogZGF0YVtzY2hlbWEuJGlkXSxcbiAgICAgICAgYXR0cmlidXRlczogdGhpcy4kJGVuY29kZUF0dHJpYnV0ZXMoZGF0YSksXG4gICAgICAgIHJlbGF0aW9uc2hpcHM6IHRoaXMuJCRlbmNvZGVSZWxhdGlvbnNoaXBzKGRhdGEsIHNjaGVtYSwgT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7IHByZWZpeDogbGluayB9KSksXG4gICAgICAgIGxpbmtzOiB7IHNlbGY6IGxpbmsgfSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgJCRhdHRyaWJ1dGVGaWVsZHModHlwZSkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVt0eXBlXTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc2NoZW1hLiRmaWVsZHMpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gZmllbGQgIT09IHNjaGVtYS4kaWQgJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgIT09ICdoYXNNYW55JztcbiAgICB9KTtcbiAgfVxuXG4gICQkZW5jb2RlQXR0cmlidXRlcyhkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuJCRhdHRyaWJ1dGVGaWVsZHMoZGF0YS50eXBlKVxuICAgICAgLm1hcChhdHRyID0+IHtcbiAgICAgICAgcmV0dXJuIHsgW2F0dHJdOiBkYXRhW2F0dHJdIH07XG4gICAgICB9KVxuICAgICAgLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBtZXJnZU9wdGlvbnMoYWNjLCBjdXJyKSwge30pO1xuICB9XG5cbiAgJCRwYXJzZVJlbGF0aW9uc2hpcHMocGFyZW50SWQsIHJlbGF0aW9uc2hpcHMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykubWFwKHJlbE5hbWUgPT4ge1xuICAgICAgLy8gQWxsIGNoaWxkcmVuIGluIHRoaXMgcmVsYXRpb25zaGlwIHNob3VsZCBoYXZlXG4gICAgICAvLyB0aGUgc2FtZSB0eXBlLCBzbyBnZXQgdGhlIHR5cGUgb2YgdGhlIGZpcnN0IG9uZVxuICAgICAgY29uc3QgdHlwZU5hbWUgPSByZWxhdGlvbnNoaXBzW3JlbE5hbWVdLmRhdGFbMF0udHlwZTtcbiAgICAgIGNvbnN0IHNjaGVtYSA9IHRoaXNbJHNjaGVtYXRhXVt0eXBlTmFtZV07XG4gICAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGFyc2UgdHlwZTogJHt0eXBlTmFtZX1gKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW3JlbE5hbWVdOiByZWxhdGlvbnNoaXBzW3JlbE5hbWVdLmRhdGEubWFwKGNoaWxkID0+IHtcbiAgICAgICAgICByZXR1cm4geyBpZDogY2hpbGQuaWQgfTtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH0pLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBtZXJnZU9wdGlvbnMoYWNjLCBjdXJyKSwge30pO1xuICB9XG5cbiAgJCRlbmNvZGVSZWxhdGlvbnNoaXBzKGRhdGEsIHNjaGVtYSwgb3B0cykge1xuICAgIGNvbnN0IHJlbEZpZWxkcyA9IE9iamVjdC5rZXlzKGRhdGEpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gc2NoZW1hLiRmaWVsZHNbZmllbGRdICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlID09PSAnaGFzTWFueScgJiYgb3B0cy5pbmNsdWRlW2ZpZWxkXTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZWxGaWVsZHMubWFwKGZpZWxkID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFtmaWVsZF06IHtcbiAgICAgICAgICBsaW5rczogeyByZWxhdGVkOiBgJHtvcHRzLnByZWZpeH0vJHtmaWVsZH1gIH0sXG4gICAgICAgICAgZGF0YTogZGF0YVtmaWVsZF0ubWFwKHJlbCA9PiB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hLiRmaWVsZHNbZmllbGRdLnJlbGF0aW9uc2hpcC4kc2lkZXNbZmllbGRdLm90aGVyLnR5cGU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJHJlc291cmNlSWRlbnRpZmllcih0eXBlLCByZWwpO1xuICAgICAgICAgIH0pLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkcmVzb3VyY2VJZGVudGlmaWVyKHR5cGUsIHJlbCkge1xuICAgIGNvbnN0IHJldFZhbCA9IHsgdHlwZTogdHlwZSwgaWQ6IHJlbC5pZCB9O1xuICAgIGNvbnN0IG1ldGEgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByZWwpIHtcbiAgICAgIGlmIChrZXkgIT09ICdpZCcpIHtcbiAgICAgICAgbWV0YVtrZXldID0gcmVsW2tleV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhtZXRhKS5sZW5ndGggPiAwKSB7IC8vIG1ldGEgIT09IHt9XG4gICAgICByZXRWYWwubWV0YSA9IG1ldGE7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cbn1cbiJdfQ==
