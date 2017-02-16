import mergeOptions from 'merge-options';

const $schemata = Symbol('$schemata');

export class JSONApi {
  constructor(opts = {}) {
    const options = Object.assign({}, {
      baseURL: '',
      schemata: [],
    }, opts);

    this.baseURL = options.baseURL;
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
      { include: schema.$include },
      opts
    );

    // NOTE: This implementation does not currently ensure full linkage.
    // It assumes that extended only contains data that is linked to
    return {
      data: this.$$encodeDataObject(root, options),
      included: extended.map(child => this.$$encodeDataObject(child, options)),
    };
  }

  $$addSchema(schema) {
    if (this[$schemata][schema.$name] === undefined) {
      this[$schemata][schema.$name] = schema;
    } else {
      throw new Error(`Duplicate schema registered: ${schema.name}`);
    }
  }

  schema(name) {
    return this[$schemata][name];
  }

  $$parseDataObject(data) {
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
      const link = `${this.baseURL}/${data.type}/${data[schema.$id]}`;

      return {
        type: data.type,
        id: data[schema.$id],
        attributes: this.$$encodeAttributes(data),
        relationships: this.$$encodeRelationships(data, schema, opts),
        links: { self: link },
      };
    }
  }

  $$attributeFields(type) {
    const schema = this[$schemata][type];
    return Object.keys(schema.$fields).filter(field => {
      return field !== schema.$id && schema.$fields[field].type !== 'hasMany';
    });
  }

  $$encodeAttributes(data) {
    return this.$$attributeFields(data.type)
      .map(attr => {
        return { [attr]: data[attr] };
      })
      .reduce((acc, curr) => mergeOptions(acc, curr), {});
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

  $$encodeRelationships(data, schema, opts) {
    const relFields = Object.keys(data).filter(field => {
      return schema.$fields[field] && schema.$fields[field].type === 'hasMany' && opts.include[field];
    });

    return relFields.map(field => {
      return {
        [field]: {
          links: { related: `${this.baseURL}/${data.type}/${data[schema.$id]}/${field}` },
          data: data[field].map(rel => {
            const type = schema.$fields[field].relationship.$sides[field].other.type;
            return this.$$resourceIdentifier(type, rel);
          }),
        },
      };
    }).reduce((acc, curr) => mergeOptions(acc, curr), {});
  }

  $$resourceIdentifier(type, rel) {
    const retVal = { type: type, id: rel.id };
    const meta = {};
    for (const key in rel) {
      if (key !== 'id') {
        meta[key] = rel[key];
      }
    }
    if (Object.keys(meta).length > 0) { // meta !== {}
      retVal.meta = meta;
    }
    return retVal;
  }
}
