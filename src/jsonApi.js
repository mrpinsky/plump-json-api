import mergeOptions from 'merge-options';

import { Model, $self } from './model';

const $types = Symbol('$types');

export class JSONApi {
  constructor(opts = {}) {
    const options = Object.assign({}, {
      storage: [],
      types: [],
    }, opts);

    this[$types] = {};

    if (!Array.isArray(options.schema)) {
      options.schema = [options.schema];
    }
    this.$$addTypesFromSchema(options.schema);
  }

  parse(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const type = this.type(data.data.type);
    const relationships = this.$$parseRelationships(data.relationships);

    const requested = Object.assign(
      {
        [type.$id]: data.id,
      },
      data.attributes,
      relationships
    );
    this.save();

    const extended = data.included.map(inclusion => {
      const childType = this.type(inclusion.type);
      const childId = inclusion.id;
      const childData = Object.assign(
        {},
        inclusion.attributes,
        this.parseRelationships(inclusion.relationships)
      );
      return childData;
    });

    return { requested, extended };
  }

  encode({ root, extended }, opts) {
    const type = this.$$type(root.type);
    const options = Object.assign(
      {},
      {
        domain: 'https://example.com',
        path: '/api',
      },
      opts
    );
    const prefix = `${options.domain || ''}${options.path || ''}`;

    const includedPkg = this.$$includedPackage(extended, opts);
    const attributes = {};

    Object.keys(type.$fields).filter(field => {
      return field !== type.$id && type.$fields[field].type !== 'hasMany';
    }).forEach(key => {
      attributes[key] = root[key];
    });

    const retVal = {
      links: { self: `${prefix}/${type.$name}/${root.id}` },
      data: { type: type.$name, id: root.id },
      attributes: attributes,
      included: includedPkg,
    };

    const relationships = this.$$relatedPackage(root, opts);
    if (Object.keys(relationships).length > 0) {
      retVal.relationships = relationships;
    }

    return retVal;
  }

  $$addTypesFromSchema(schema, ExtendingModel = Model) {
    Object.keys(schema).forEach((k) => {
      class DynamicModel extends ExtendingModel {}
      DynamicModel.fromJSON(schema[k]);
      this.$$addType(DynamicModel);
    });
  }

  $$addType(T) {
    if (this[$types][T.$name] === undefined) {
      this[$types][T.$name] = T;
    } else {
      throw new Error(`Duplicate Type registered: ${T.$name}`);
    }
  }

  $$type(T) {
    return this[$types][T];
  }

  $$types() {
    return Object.keys(this[$types]);
  }

  $$parseRelationships(data) {
    const type = this.$$type(data.data.type);

    return Object.keys(data.relationships).map(relName => {
      const relationship = type.$fields[relName].relationship;
      return {
        [relName]: data.relationships[relName].data.map(child => {
          return {
            [relationship.$sides[relName].self.field]: data.id,
            [relationship.$sides[relName].other.field]: child.id,
          };
        }),
      };
    }).reduce((acc, curr) => mergeOptions(acc, curr), {});
  }

  $$relatedPackage(root, opts = {}) {
    const type = this.$$type(root.type);
    const options = Object.assign(
      {},
      { include: this.$$type(root.type).$include },
      opts
    );
    const prefix = `${options.domain || ''}${options.path || ''}`;
    const fields = Object.keys(options.include).filter(rel => root[rel] && root[rel].length);

    const retVal = {};
    fields.forEach(field => {
      const childSpec = type.$fields[field].relationship.$sides[field].other;
      retVal[field] = {
        links: {
          related: `${prefix}/${type.$name}/${root[type.$id]}/${field}`,
        },
        data: root[field].map(child => {
          return { type: this.$$type(childSpec.type).$name, id: child[childSpec.field] };
        }),
      };
    });

    return retVal;
  }

  $$packageForInclusion(data, opts = {}) {
    const prefix = `${opts.domain || ''}${opts.path || ''}`;
    const type = this.$$type(data.type);

    const relationships = this.$$relatedPackage(data, opts);
    const attributes = {};
    Object.keys(type.$fields).filter(field => {
      return field !== type.$id && type.$fields[field].type !== 'hasMany';
    }).forEach(field => {
      if (data[field] !== 'undefined') {
        attributes[field] = data[field];
      }
    });

    const retVal = {
      type: data.type,
      id: data.id,
      attributes: attributes,
      links: {
        self: `${prefix}/${type.$name}/${data.id}`,
      },
    };

    if (Object.keys(relationships).length > 0) {
      retVal.relationships = relationships;
    }

    return retVal;
  }

  $$includedPackage(extended = {}, opts = {}) {
    const options = Object.assign(
      {},
      {
        domain: 'https://example.com',
        path: '/api',
      },
      opts
    );
    return Object.keys(extended).map(relationship => {
      return extended[relationship].map(child => this.$$packageForInclusion(child, options));
    }).reduce((acc, curr) => acc.concat(curr));
  }
}
