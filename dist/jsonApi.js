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
      storage: [],
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwic3RvcmFnZSIsInNjaGVtYXRhIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9yRWFjaCIsIiQkYWRkU2NoZW1hIiwicyIsImpzb24iLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwidHlwZSIsInJlbGF0aW9uc2hpcHMiLCIkJHBhcnNlUmVsYXRpb25zaGlwcyIsInJlcXVlc3RlZCIsIiRpZCIsImlkIiwiYXR0cmlidXRlcyIsInNhdmUiLCJleHRlbmRlZCIsImluY2x1ZGVkIiwibWFwIiwiY2hpbGREYXRhIiwiaW5jbHVzaW9uIiwicGFyc2VSZWxhdGlvbnNoaXBzIiwicm9vdCIsInNjaGVtYSIsImRvbWFpbiIsInBhdGgiLCJwcmVmaXgiLCJpbmNsdWRlZFBrZyIsIiQkaW5jbHVkZWRQYWNrYWdlIiwia2V5cyIsIiRmaWVsZHMiLCJmaWx0ZXIiLCJmaWVsZCIsImtleSIsInJldFZhbCIsImxpbmtzIiwic2VsZiIsIiRuYW1lIiwiJCRyZWxhdGVkUGFja2FnZSIsImxlbmd0aCIsInVuZGVmaW5lZCIsIkVycm9yIiwibmFtZSIsInJlbGF0aW9uc2hpcCIsInJlbE5hbWUiLCIkc2lkZXMiLCJvdGhlciIsImNoaWxkIiwicmVkdWNlIiwiYWNjIiwiY3VyciIsImluY2x1ZGUiLCIkaW5jbHVkZSIsImZpZWxkcyIsInJlbCIsImNoaWxkU3BlYyIsInJlbGF0ZWQiLCIkJHBhY2thZ2VGb3JJbmNsdXNpb24iLCJjb25jYXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsWUFBWUMsT0FBTyxXQUFQLENBQWxCOztJQUVhQyxPLFdBQUFBLE87QUFDWCxxQkFBdUI7QUFBQTs7QUFBQSxRQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3JCLFFBQU1DLFVBQVVDLE9BQU9DLE1B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QixLQUFLMkIsS0FBTCxDQUFwQjtBQUNEO0FBQ0YsT0FORDs7QUFRQSxVQUFNRSxTQUFTO0FBQ2IxQixjQUFNSCxLQUFLRyxJQURFO0FBRWJLLFlBQUlSLEtBQUtRLEVBRkk7QUFHYkMsb0JBQVlBLFVBSEM7QUFJYnFCLGVBQU87QUFDTEMsZ0JBQVNWLE1BQVQsU0FBbUJILE9BQU9jLEtBQTFCLFNBQW1DaEMsS0FBS1E7QUFEbkM7QUFKTSxPQUFmOztBQVNBLFVBQUlsQixPQUFPa0MsSUFBUCxDQUFZcEIsYUFBWixFQUEyQjhCLE1BQTNCLEdBQW9DLENBQXhDLEVBQTJDO0FBQ3pDTCxlQUFPekIsYUFBUCxHQUF1QkEsYUFBdkI7QUFDRDs7QUFFRCxhQUFPeUIsTUFBUDtBQUNEOzs7d0NBRTJDO0FBQUE7O0FBQUEsVUFBMUJsQixRQUEwQix1RUFBZixFQUFlO0FBQUEsVUFBWHZCLElBQVcsdUVBQUosRUFBSTs7QUFDMUMsVUFBTUMsVUFBVUMsT0FBT0MsTUFBUCxDQUNkLEVBRGMsRUFFZDtBQUNFNEIsZ0JBQVEscUJBRFY7QUFFRUMsY0FBTTtBQUZSLE9BRmMsRUFNZGhDLElBTmMsQ0FBaEI7QUFRQSxhQUFPRSxPQUFPa0MsSUFBUCxDQUFZYixRQUFaLEVBQXNCRSxHQUF0QixDQUEwQix3QkFBZ0I7QUFDL0MsZUFBT0YsU0FBUzJCLFlBQVQsRUFBdUJ6QixHQUF2QixDQUEyQjtBQUFBLGlCQUFTLE9BQUt1QyxxQkFBTCxDQUEyQlYsS0FBM0IsRUFBa0NyRCxPQUFsQyxDQUFUO0FBQUEsU0FBM0IsQ0FBUDtBQUNELE9BRk0sRUFFSnNELE1BRkksQ0FFRyxVQUFDQyxHQUFELEVBQU1DLElBQU47QUFBQSxlQUFlRCxJQUFJUyxNQUFKLENBQVdSLElBQVgsQ0FBZjtBQUFBLE9BRkgsQ0FBUDtBQUdEIiwiZmlsZSI6Impzb25BcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVyZ2VPcHRpb25zIGZyb20gJ21lcmdlLW9wdGlvbnMnO1xuXG5jb25zdCAkc2NoZW1hdGEgPSBTeW1ib2woJyRzY2hlbWF0YScpO1xuXG5leHBvcnQgY2xhc3MgSlNPTkFwaSB7XG4gIGNvbnN0cnVjdG9yKG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICBzdG9yYWdlOiBbXSxcbiAgICAgIHNjaGVtYXRhOiBbXSxcbiAgICB9LCBvcHRzKTtcblxuICAgIHRoaXNbJHNjaGVtYXRhXSA9IHt9O1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG9wdGlvbnMuc2NoZW1hdGEpKSB7XG4gICAgICBvcHRpb25zLnNjaGVtYXRhID0gW29wdGlvbnMuc2NoZW1hdGFdO1xuICAgIH1cbiAgICBvcHRpb25zLnNjaGVtYXRhLmZvckVhY2gocyA9PiB0aGlzLiQkYWRkU2NoZW1hKHMpKTtcbiAgfVxuXG4gIHBhcnNlKGpzb24pIHtcbiAgICBjb25zdCBkYXRhID0gdHlwZW9mIGpzb24gPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShqc29uKSA6IGpzb247XG4gICAgY29uc3QgdHlwZSA9IHRoaXMudHlwZShkYXRhLmRhdGEudHlwZSk7XG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRoaXMuJCRwYXJzZVJlbGF0aW9uc2hpcHMoZGF0YS5yZWxhdGlvbnNoaXBzKTtcblxuICAgIGNvbnN0IHJlcXVlc3RlZCA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIFt0eXBlLiRpZF06IGRhdGEuaWQsXG4gICAgICB9LFxuICAgICAgZGF0YS5hdHRyaWJ1dGVzLFxuICAgICAgcmVsYXRpb25zaGlwc1xuICAgICk7XG4gICAgdGhpcy5zYXZlKCk7XG5cbiAgICBjb25zdCBleHRlbmRlZCA9IGRhdGEuaW5jbHVkZWQubWFwKGluY2x1c2lvbiA9PiB7XG4gICAgICAvLyBjb25zdCBjaGlsZFR5cGUgPSB0aGlzLnR5cGUoaW5jbHVzaW9uLnR5cGUpO1xuICAgICAgLy8gY29uc3QgY2hpbGRJZCA9IGluY2x1c2lvbi5pZDtcbiAgICAgIGNvbnN0IGNoaWxkRGF0YSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHt9LFxuICAgICAgICBpbmNsdXNpb24uYXR0cmlidXRlcyxcbiAgICAgICAgdGhpcy5wYXJzZVJlbGF0aW9uc2hpcHMoaW5jbHVzaW9uLnJlbGF0aW9uc2hpcHMpXG4gICAgICApO1xuICAgICAgcmV0dXJuIGNoaWxkRGF0YTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJlcXVlc3RlZCwgZXh0ZW5kZWQgfTtcbiAgfVxuXG4gIGVuY29kZSh7IHJvb3QsIGV4dGVuZGVkIH0sIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBkb21haW46ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgcGF0aDogJy9hcGknLFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke29wdGlvbnMuZG9tYWluIHx8ICcnfSR7b3B0aW9ucy5wYXRoIHx8ICcnfWA7XG5cbiAgICBjb25zdCBpbmNsdWRlZFBrZyA9IHRoaXMuJCRpbmNsdWRlZFBhY2thZ2UoZXh0ZW5kZWQsIG9wdHMpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHNjaGVtYS4kZmllbGRzKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGZpZWxkICE9PSBzY2hlbWEuJGlkICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlICE9PSAnaGFzTWFueSc7XG4gICAgfSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgYXR0cmlidXRlc1trZXldID0gcm9vdFtrZXldO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmV0VmFsID0ge1xuICAgICAgbGlua3M6IHsgc2VsZjogYCR7cHJlZml4fS8ke3NjaGVtYS4kbmFtZX0vJHtyb290LmlkfWAgfSxcbiAgICAgIGRhdGE6IHsgdHlwZTogc2NoZW1hLiRuYW1lLCBpZDogcm9vdC5pZCB9LFxuICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgIGluY2x1ZGVkOiBpbmNsdWRlZFBrZyxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRoaXMuJCRyZWxhdGVkUGFja2FnZShyb290LCBvcHRzKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykubGVuZ3RoID4gMCkge1xuICAgICAgcmV0VmFsLnJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cblxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cblxuICAkJGFkZFNjaGVtYShzY2hlbWEpIHtcbiAgICBpZiAodGhpc1skc2NoZW1hdGFdW3NjaGVtYS4kbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1skc2NoZW1hdGFdW3NjaGVtYS4kbmFtZV0gPSBzY2hlbWE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIHNjaGVtYSByZWdpc3RlcmVkOiAke3NjaGVtYS5uYW1lfWApO1xuICAgIH1cbiAgfVxuXG4gICQkc2NoZW1hdGEoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbJHNjaGVtYXRhXSk7XG4gIH1cblxuICAkJHBhcnNlUmVsYXRpb25zaGlwcyhkYXRhKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEuZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIHR5cGU6ICR7ZGF0YS5kYXRhLnR5cGV9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRhdGEucmVsYXRpb25zaGlwcykubWFwKHJlbE5hbWUgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpb25zaGlwID0gc2NoZW1hLiRmaWVsZHNbcmVsTmFtZV0ucmVsYXRpb25zaGlwO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW3JlbE5hbWVdOiBkYXRhLnJlbGF0aW9uc2hpcHNbcmVsTmFtZV0uZGF0YS5tYXAoY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBbcmVsYXRpb25zaGlwLiRzaWRlc1tyZWxOYW1lXS5zZWxmLmZpZWxkXTogZGF0YS5pZCxcbiAgICAgICAgICAgIFtyZWxhdGlvbnNoaXAuJHNpZGVzW3JlbE5hbWVdLm90aGVyLmZpZWxkXTogY2hpbGQuaWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSksXG4gICAgICB9O1xuICAgIH0pLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBtZXJnZU9wdGlvbnMoYWNjLCBjdXJyKSwge30pO1xuICB9XG5cbiAgJCRyZWxhdGVkUGFja2FnZShyb290LCBvcHRzID0ge30pIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhY2thZ2UgdHlwZTogJHtyb290LnR5cGV9YCk7XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7IGluY2x1ZGU6IHRoaXNbJHNjaGVtYXRhXVtyb290LnR5cGVdLiRpbmNsdWRlIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICBjb25zdCBwcmVmaXggPSBgJHtvcHRpb25zLmRvbWFpbiB8fCAnJ30ke29wdGlvbnMucGF0aCB8fCAnJ31gO1xuICAgIGNvbnN0IGZpZWxkcyA9IE9iamVjdC5rZXlzKG9wdGlvbnMuaW5jbHVkZSkuZmlsdGVyKHJlbCA9PiByb290W3JlbF0gJiYgcm9vdFtyZWxdLmxlbmd0aCk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7fTtcbiAgICBmaWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBjb25zdCBjaGlsZFNwZWMgPSBzY2hlbWEuJGZpZWxkc1tmaWVsZF0ucmVsYXRpb25zaGlwLiRzaWRlc1tmaWVsZF0ub3RoZXI7XG4gICAgICByZXRWYWxbZmllbGRdID0ge1xuICAgICAgICBsaW5rczoge1xuICAgICAgICAgIHJlbGF0ZWQ6IGAke3ByZWZpeH0vJHtzY2hlbWEuJG5hbWV9LyR7cm9vdFtzY2hlbWEuJGlkXX0vJHtmaWVsZH1gLFxuICAgICAgICB9LFxuICAgICAgICBkYXRhOiByb290W2ZpZWxkXS5tYXAoY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiB7IHR5cGU6IHRoaXNbJHNjaGVtYXRhXVtjaGlsZFNwZWMudHlwZV0uJG5hbWUsIGlkOiBjaGlsZFtjaGlsZFNwZWMuZmllbGRdIH07XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cblxuICAkJHBhY2thZ2VGb3JJbmNsdXNpb24oZGF0YSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0cy5kb21haW4gfHwgJyd9JHtvcHRzLnBhdGggfHwgJyd9YDtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS50eXBlXTtcbiAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhY2thZ2UgaW5jbHVkZWQgdHlwZTogJHtkYXRhLnR5cGV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRoaXMuJCRyZWxhdGVkUGFja2FnZShkYXRhLCBvcHRzKTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0ge307XG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLiRmaWVsZHMpLmZpbHRlcihmaWVsZCA9PiB7XG4gICAgICByZXR1cm4gZmllbGQgIT09IHNjaGVtYS4kaWQgJiYgc2NoZW1hLiRmaWVsZHNbZmllbGRdLnR5cGUgIT09ICdoYXNNYW55JztcbiAgICB9KS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGlmIChkYXRhW2ZpZWxkXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgYXR0cmlidXRlc1tmaWVsZF0gPSBkYXRhW2ZpZWxkXTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHJldFZhbCA9IHtcbiAgICAgIHR5cGU6IGRhdGEudHlwZSxcbiAgICAgIGlkOiBkYXRhLmlkLFxuICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgIGxpbmtzOiB7XG4gICAgICAgIHNlbGY6IGAke3ByZWZpeH0vJHtzY2hlbWEuJG5hbWV9LyR7ZGF0YS5pZH1gLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKHJlbGF0aW9uc2hpcHMpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldFZhbC5yZWxhdGlvbnNoaXBzID0gcmVsYXRpb25zaGlwcztcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0VmFsO1xuICB9XG5cbiAgJCRpbmNsdWRlZFBhY2thZ2UoZXh0ZW5kZWQgPSB7fSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHtcbiAgICAgICAgZG9tYWluOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsXG4gICAgICAgIHBhdGg6ICcvYXBpJyxcbiAgICAgIH0sXG4gICAgICBvcHRzXG4gICAgKTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoZXh0ZW5kZWQpLm1hcChyZWxhdGlvbnNoaXAgPT4ge1xuICAgICAgcmV0dXJuIGV4dGVuZGVkW3JlbGF0aW9uc2hpcF0ubWFwKGNoaWxkID0+IHRoaXMuJCRwYWNrYWdlRm9ySW5jbHVzaW9uKGNoaWxkLCBvcHRpb25zKSk7XG4gICAgfSkucmVkdWNlKChhY2MsIGN1cnIpID0+IGFjYy5jb25jYXQoY3VycikpO1xuICB9XG59XG4iXX0=
