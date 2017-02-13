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
      });
    }
  }]);

  return JSONApi;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb25BcGkuanMiXSwibmFtZXMiOlsiJHNjaGVtYXRhIiwiU3ltYm9sIiwiSlNPTkFwaSIsIm9wdHMiLCJvcHRpb25zIiwiT2JqZWN0IiwiYXNzaWduIiwic2NoZW1hdGEiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiJCRhZGRTY2hlbWEiLCJzIiwianNvbiIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJzY2hlbWEiLCJ0eXBlIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJyZWxhdGlvbnNoaXBzIiwiJCRwYXJzZVJlbGF0aW9uc2hpcHMiLCJpZCIsInJvb3QiLCIkaWQiLCIkbmFtZSIsImF0dHJpYnV0ZXMiLCJleHRlbmRlZCIsImluY2x1ZGVkIiwibWFwIiwiY2hpbGRUeXBlIiwiaW5jbHVzaW9uIiwiY2hpbGREYXRhIiwiZG9tYWluIiwicGF0aCIsInByZWZpeCIsImluY2x1ZGVkUGtnIiwiJCRpbmNsdWRlZFBhY2thZ2UiLCJrZXlzIiwiJGZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwia2V5IiwicmV0VmFsIiwibGlua3MiLCJzZWxmIiwiJCRyZWxhdGVkUGFja2FnZSIsImxlbmd0aCIsIm5hbWUiLCJwYXJlbnRJZCIsInR5cGVOYW1lIiwicmVsTmFtZSIsInJlbGF0aW9uc2hpcCIsIiRzaWRlcyIsIm90aGVyIiwiY2hpbGQiLCJyZWR1Y2UiLCJhY2MiLCJjdXJyIiwiaW5jbHVkZSIsIiRpbmNsdWRlIiwiZmllbGRzIiwicmVsIiwiY2hpbGRTcGVjIiwicmVsYXRlZCIsIiQkcGFja2FnZUZvckluY2x1c2lvbiIsImNvbmNhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZQyxPQUFPLFdBQVAsQ0FBbEI7O0lBRWFDLE8sV0FBQUEsTztBQUNYLHFCQUF1QjtBQUFBOztBQUFBLFFBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDckIsUUFBTUMsVUFBVUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFB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QVN5QixZQUFULEVBQXVCdkIsR0FBdkIsQ0FBMkI7QUFBQSxpQkFBUyxPQUFLb0MscUJBQUwsQ0FBMkJWLEtBQTNCLEVBQWtDcEQsT0FBbEMsQ0FBVDtBQUFBLFNBQTNCLENBQVA7QUFDRCxPQUZNLEVBRUpxRCxNQUZJLENBRUcsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOO0FBQUEsZUFBZUQsSUFBSVMsTUFBSixDQUFXUixJQUFYLENBQWY7QUFBQSxPQUZILENBQVA7QUFHRCIsImZpbGUiOiJqc29uQXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1lcmdlT3B0aW9ucyBmcm9tICdtZXJnZS1vcHRpb25zJztcblxuY29uc3QgJHNjaGVtYXRhID0gU3ltYm9sKCckc2NoZW1hdGEnKTtcblxuZXhwb3J0IGNsYXNzIEpTT05BcGkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgc2NoZW1hdGE6IFtdLFxuICAgIH0sIG9wdHMpO1xuXG4gICAgdGhpc1skc2NoZW1hdGFdID0ge307XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5zY2hlbWF0YSkpIHtcbiAgICAgIG9wdGlvbnMuc2NoZW1hdGEgPSBbb3B0aW9ucy5zY2hlbWF0YV07XG4gICAgfVxuICAgIG9wdGlvbnMuc2NoZW1hdGEuZm9yRWFjaChzID0+IHRoaXMuJCRhZGRTY2hlbWEocykpO1xuICB9XG5cbiAgcGFyc2UoanNvbikge1xuICAgIGNvbnN0IGRhdGEgPSB0eXBlb2YganNvbiA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKGpzb24pIDoganNvbjtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bZGF0YS5kYXRhLnR5cGVdO1xuICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzY2hlbWEgZm9yIHR5cGU6ICR7ZGF0YS5kYXRhLnR5cGV9YCk7XG4gICAgfVxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLiQkcGFyc2VSZWxhdGlvbnNoaXBzKGRhdGEuZGF0YS5pZCwgZGF0YS5yZWxhdGlvbnNoaXBzKTtcblxuICAgIGNvbnN0IHJvb3QgPSBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICBbc2NoZW1hLiRpZF06IGRhdGEuZGF0YS5pZCxcbiAgICAgICAgdHlwZTogc2NoZW1hLiRuYW1lLFxuICAgICAgfSxcbiAgICAgIGRhdGEuYXR0cmlidXRlcyxcbiAgICAgIHJlbGF0aW9uc2hpcHNcbiAgICApO1xuXG4gICAgY29uc3QgZXh0ZW5kZWQgPSBkYXRhLmluY2x1ZGVkLm1hcChpbmNsdXNpb24gPT4ge1xuICAgICAgY29uc3QgY2hpbGRUeXBlID0gdGhpc1skc2NoZW1hdGFdW2luY2x1c2lvbi50eXBlXTtcbiAgICAgIGNvbnN0IGNoaWxkRGF0YSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHsgdHlwZTogY2hpbGRUeXBlLiRuYW1lLCBbY2hpbGRUeXBlLiRpZF06IGluY2x1c2lvbi5pZCB9LFxuICAgICAgICBpbmNsdXNpb24uYXR0cmlidXRlc1xuICAgICAgKTtcbiAgICAgIGlmIChpbmNsdXNpb24ucmVsYXRpb25zaGlwcykge1xuICAgICAgICBPYmplY3QuYXNzaWduKGNoaWxkRGF0YSwgdGhpcy4kJHBhcnNlUmVsYXRpb25zaGlwcyhpbmNsdXNpb24uaWQsIGluY2x1c2lvbi5yZWxhdGlvbnNoaXBzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hpbGREYXRhO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHsgcm9vdCwgZXh0ZW5kZWQgfTtcbiAgfVxuXG4gIGVuY29kZSh7IHJvb3QsIGV4dGVuZGVkIH0sIG9wdHMpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXTtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAge1xuICAgICAgICBkb21haW46ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgcGF0aDogJy9hcGknLFxuICAgICAgfSxcbiAgICAgIG9wdHNcbiAgICApO1xuICAgIGNvbnN0IHByZWZpeCA9IGAke29wdGlvbnMuZG9tYWluIHx8ICcnfSR7b3B0aW9ucy5wYXRoIHx8ICcnfWA7XG5cbiAgICBjb25zdCBpbmNsdWRlZFBrZyA9IHRoaXMuJCRpbmNsdWRlZFBhY2thZ2UoZXh0ZW5kZWQsIG9wdHMpO1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKHNjaGVtYS4kZmllbGRzKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGZpZWxkICE9PSBzY2hlbWEuJGlkICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlICE9PSAnaGFzTWFueSc7XG4gICAgfSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgYXR0cmlidXRlc1trZXldID0gcm9vdFtrZXldO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmV0VmFsID0ge1xuICAgICAgbGlua3M6IHsgc2VsZjogYCR7cHJlZml4fS8ke3NjaGVtYS4kbmFtZX0vJHtyb290LmlkfWAgfSxcbiAgICAgIGRhdGE6IHsgdHlwZTogc2NoZW1hLiRuYW1lLCBpZDogcm9vdC5pZCB9LFxuICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgIGluY2x1ZGVkOiBpbmNsdWRlZFBrZyxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVsYXRpb25zaGlwcyA9IHRoaXMuJCRyZWxhdGVkUGFja2FnZShyb290LCBvcHRzKTtcbiAgICBpZiAoT2JqZWN0LmtleXMocmVsYXRpb25zaGlwcykubGVuZ3RoID4gMCkge1xuICAgICAgcmV0VmFsLnJlbGF0aW9uc2hpcHMgPSByZWxhdGlvbnNoaXBzO1xuICAgIH1cblxuICAgIHJldHVybiByZXRWYWw7XG4gIH1cblxuICAkJGFkZFNjaGVtYShzY2hlbWEpIHtcbiAgICBpZiAodGhpc1skc2NoZW1hdGFdW3NjaGVtYS4kbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpc1skc2NoZW1hdGFdW3NjaGVtYS4kbmFtZV0gPSBzY2hlbWE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIHNjaGVtYSByZWdpc3RlcmVkOiAke3NjaGVtYS5uYW1lfWApO1xuICAgIH1cbiAgfVxuXG4gICQkc2NoZW1hdGEoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXNbJHNjaGVtYXRhXSk7XG4gIH1cblxuICAkJHBhcnNlUmVsYXRpb25zaGlwcyhwYXJlbnRJZCwgZGF0YSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhkYXRhKS5tYXAocmVsTmFtZSA9PiB7XG4gICAgICAvLyBBbGwgY2hpbGRyZW4gaW4gdGhpcyByZWxhdGlvbnNoaXAgc2hvdWxkIGhhdmVcbiAgICAgIC8vIHRoZSBzYW1lIHR5cGUsIHNvIGdldCB0aGUgdHlwZSBvZiB0aGUgZmlyc3Qgb25lXG4gICAgICBjb25zdCB0eXBlTmFtZSA9IGRhdGFbcmVsTmFtZV0uZGF0YVswXS50eXBlO1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3R5cGVOYW1lXTtcbiAgICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSB0eXBlOiAke3R5cGVOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZWxhdGlvbnNoaXAgPSBzY2hlbWEuJGZpZWxkc1tyZWxOYW1lXS5yZWxhdGlvbnNoaXA7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBbcmVsTmFtZV06IGRhdGFbcmVsTmFtZV0uZGF0YS5tYXAoY2hpbGQgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBbcmVsYXRpb25zaGlwLiRzaWRlc1tyZWxOYW1lXS5zZWxmLmZpZWxkXTogcGFyZW50SWQsXG4gICAgICAgICAgICBbcmVsYXRpb25zaGlwLiRzaWRlc1tyZWxOYW1lXS5vdGhlci5maWVsZF06IGNoaWxkLmlkLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICB9KS5yZWR1Y2UoKGFjYywgY3VycikgPT4gbWVyZ2VPcHRpb25zKGFjYywgY3VyciksIHt9KTtcbiAgfVxuXG4gICQkcmVsYXRlZFBhY2thZ2Uocm9vdCwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW3Jvb3QudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYWNrYWdlIHR5cGU6ICR7cm9vdC50eXBlfWApO1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgeyBpbmNsdWRlOiB0aGlzWyRzY2hlbWF0YV1bcm9vdC50eXBlXS4kaW5jbHVkZSB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgY29uc3QgcHJlZml4ID0gYCR7b3B0aW9ucy5kb21haW4gfHwgJyd9JHtvcHRpb25zLnBhdGggfHwgJyd9YDtcbiAgICBjb25zdCBmaWVsZHMgPSBPYmplY3Qua2V5cyhvcHRpb25zLmluY2x1ZGUpLmZpbHRlcihyZWwgPT4gcm9vdFtyZWxdICYmIHJvb3RbcmVsXS5sZW5ndGgpO1xuXG4gICAgY29uc3QgcmV0VmFsID0ge307XG4gICAgZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgY29uc3QgY2hpbGRTcGVjID0gc2NoZW1hLiRmaWVsZHNbZmllbGRdLnJlbGF0aW9uc2hpcC4kc2lkZXNbZmllbGRdLm90aGVyO1xuICAgICAgcmV0VmFsW2ZpZWxkXSA9IHtcbiAgICAgICAgbGlua3M6IHtcbiAgICAgICAgICByZWxhdGVkOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke3Jvb3Rbc2NoZW1hLiRpZF19LyR7ZmllbGR9YCxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogcm9vdFtmaWVsZF0ubWFwKGNoaWxkID0+IHtcbiAgICAgICAgICByZXR1cm4geyB0eXBlOiB0aGlzWyRzY2hlbWF0YV1bY2hpbGRTcGVjLnR5cGVdLiRuYW1lLCBpZDogY2hpbGRbY2hpbGRTcGVjLmZpZWxkXSB9O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmV0VmFsO1xuICB9XG5cbiAgJCRwYWNrYWdlRm9ySW5jbHVzaW9uKGRhdGEsIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IHByZWZpeCA9IGAke29wdHMuZG9tYWluIHx8ICcnfSR7b3B0cy5wYXRoIHx8ICcnfWA7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpc1skc2NoZW1hdGFdW2RhdGEudHlwZV07XG4gICAgaWYgKHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYWNrYWdlIGluY2x1ZGVkIHR5cGU6ICR7ZGF0YS50eXBlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlbGF0aW9uc2hpcHMgPSB0aGlzLiQkcmVsYXRlZFBhY2thZ2UoZGF0YSwgb3B0cyk7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKHNjaGVtYS4kZmllbGRzKS5maWx0ZXIoZmllbGQgPT4ge1xuICAgICAgcmV0dXJuIGZpZWxkICE9PSBzY2hlbWEuJGlkICYmIHNjaGVtYS4kZmllbGRzW2ZpZWxkXS50eXBlICE9PSAnaGFzTWFueSc7XG4gICAgfSkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBpZiAoZGF0YVtmaWVsZF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGF0dHJpYnV0ZXNbZmllbGRdID0gZGF0YVtmaWVsZF07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCByZXRWYWwgPSB7XG4gICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICBpZDogZGF0YS5pZCxcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICBsaW5rczoge1xuICAgICAgICBzZWxmOiBgJHtwcmVmaXh9LyR7c2NoZW1hLiRuYW1lfS8ke2RhdGEuaWR9YCxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGlmIChPYmplY3Qua2V5cyhyZWxhdGlvbnNoaXBzKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXRWYWwucmVsYXRpb25zaGlwcyA9IHJlbGF0aW9uc2hpcHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfVxuXG4gICQkaW5jbHVkZWRQYWNrYWdlKGV4dGVuZGVkID0ge30sIG9wdHMgPSB7fSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge30sXG4gICAgICB7XG4gICAgICAgIGRvbWFpbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgICBwYXRoOiAnL2FwaScsXG4gICAgICB9LFxuICAgICAgb3B0c1xuICAgICk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGV4dGVuZGVkKS5tYXAocmVsYXRpb25zaGlwID0+IHtcbiAgICAgIHJldHVybiBleHRlbmRlZFtyZWxhdGlvbnNoaXBdLm1hcChjaGlsZCA9PiB0aGlzLiQkcGFja2FnZUZvckluY2x1c2lvbihjaGlsZCwgb3B0aW9ucykpO1xuICAgIH0pLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiBhY2MuY29uY2F0KGN1cnIpKTtcbiAgfVxufVxuIl19
