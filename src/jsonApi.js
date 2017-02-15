import mergeOptions from 'merge-options';

const $schemata = Symbol('$schemata');

export class JSONApi {
  constructor(opts = {}) {
    const options = Object.assign({}, {
      schemata: [],
    }, opts);

    this[$schemata] = {};

    if (!Array.isArray(options.schemata)) {
      options.schemata = [options.schemata];
    }
    options.schemata.forEach(s => this.$$addSchema(s));
  }

  parse(response) {
    const json = typeof response === 'string' ? JSON.parse(response) : response;
    const data = json.data;
    const included = json.included;

    return {
      root: this.$$parseDataObject(data),
      extended: included.map(item => this.$$parseDataObject(item)),
    };
  }

  encode({ root, extended }, opts) {
    const schema = this[$schemata][root.type];
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

    Object.keys(schema.$fields).filter(field => {
      return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
    }).forEach(key => {
      attributes[key] = root[key];
    });

    const retVal = {
      links: { self: `${prefix}/${schema.$name}/${root.id}` },
      data: { type: schema.$name, id: root.id },
      attributes: attributes,
      included: includedPkg,
    };

    const relationships = this.$$relatedPackage(root, opts);
    if (Object.keys(relationships).length > 0) {
      retVal.relationships = relationships;
    }

    return retVal;
  }

  $$addSchema(schema) {
    if (this[$schemata][schema.$name] === undefined) {
      this[$schemata][schema.$name] = schema;
    } else {
      throw new Error(`Duplicate schema registered: ${schema.name}`);
    }
  }

  $$schemata() {
    return Object.keys(this[$schemata]);
  }

  $$attributeFields(type) {
    const schema = this[$schemata][type];
    return Object.keys(schema.$fields).filter(field => {
      return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
    });
  }

  $$parseDataObject(data) {
    console.log(data);
    const schema = this[$schemata][data.type];
    if (schema === undefined) {
      throw new Error(`No schema for type: ${data.type}`);
    } else {
      return mergeOptions(
        { type: data.type, [schema.$id]: data.id },
        data.attributes,
        this.$$parseRelationships(data.id, data.relationships)
      );
    }
  }

  $$encodeDataObject(data, opts) {
    const schema = this[$schemata][data.type];
    if (schema === undefined) {
      throw new Error(`No schema for type: ${data.type}`);
    } else {
      const options = Object.assign(
        {},
        {
          include: schema.$include,
          prefix: '',
        },
        opts
      );
      const link = `${options.prefix}/${data.type}/${data[schema.$id]}`;
      const relationships = this.$$encodeRelationships(data, options);
      return {
        type: data.type,
        id: data[schema.$id],
        attributes: this.$$attributeFields(data.type)
          .map(attr => {
            return { [attr]: data[attr] };
          })
          .reduce((acc, curr) => mergeOptions(acc, curr), {}),
        relationships: relationships,
        links: {
          self: link,
          related: Object.keys(relationships).map(rel => `${link}/${rel}`),
        },
      };
    }
  }

  $$parseRelationships(parentId, relationships) {
    return Object.keys(relationships).map(relName => {
      // All children in this relationship should have
      // the same type, so get the type of the first one
      const typeName = relationships[relName].data[0].type;
      const schema = this[$schemata][typeName];
      if (schema === undefined) {
        throw new Error(`Cannot parse type: ${typeName}`);
      }

      return {
        [relName]: relationships[relName].data.map(child => {
          return { id: child.id };
        }),
      };
    }).reduce((acc, curr) => mergeOptions(acc, curr), {});
  }

  $$relatedPackage(root, opts = {}) {
    const schema = this[$schemata][root.type];
    if (schema === undefined) {
      throw new Error(`Cannot package type: ${root.type}`);
    }
    const options = Object.assign(
      {},
      { include: this[$schemata][root.type].$include },
      opts
    );
    const prefix = `${options.domain || ''}${options.path || ''}`;
    const fields = Object.keys(options.include).filter(rel => root[rel] && root[rel].length);

    const retVal = {};
    fields.forEach(field => {
      const childSpec = schema.$fields[field].relationship.$sides[field].other;
      retVal[field] = {
        links: {
          related: `${prefix}/${schema.$name}/${root[schema.$id]}/${field}`,
        },
        data: root[field].map(child => {
          return { type: this[$schemata][childSpec.type].$name, id: child[childSpec.field] };
        }),
      };
    });

    return retVal;
  }

  $$packageForInclusion(data, opts = {}) {
    const prefix = `${opts.domain || ''}${opts.path || ''}`;
    const schema = this[$schemata][data.type];
    if (schema === undefined) {
      throw new Error(`Cannot package included type: ${data.type}`);
    }

    const relationships = this.$$relatedPackage(data, opts);
    const attributes = {};
    Object.keys(schema.$fields).filter(field => {
      return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
    }).forEach(field => {
      if (data[field] !== undefined) {
        attributes[field] = data[field];
      }
    });

    const retVal = {
      type: data.type,
      id: data.id,
      attributes: attributes,
      links: {
        self: `${prefix}/${schema.$name}/${data.id}`,
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
    }).reduce((acc, curr) => acc.concat(curr), []);
  }
}
