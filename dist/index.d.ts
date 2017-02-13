// Type definitions for plump-json-api 0.1
// Project: github.com/mrpinsky/plump-json-api
// Definitions by: Nate Pinsky <github.com/mrpinsky>

export as namespace JSONApi;

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
declare class JSONApi {
  constructor(opts?: { schemata: JSONApi.ModelSchema[] });

  parse(json: JSONApi.JSONApiDocument): {
    requested: JSONApi.Json,
    extended: JSONApi.Json[],
  };

  encode(
    data: {
      root: JSONApi.JSONApiDocument,
      extended: JSONApi.JSONApiDocument[],
    },
    opts?: {
      domain?: string,
      path?: string,
    }
  );
}

declare namespace JSONApi {
  type JsonValue = string | number | Json;

  export interface Json {
    [key: string]: JsonValue | JsonValue[];
  }

  interface BlockFilter {
    [index: number]: string | BlockFilter;
    0: 'where'
  }

  interface Schema {
    $name: string;
  }

  export interface RelationshipSchema extends Schema {
    $sides: {
      [side: string]: {
        self: {
          field: string,
          type: string,
          query?: {
            logic: BlockFilter,
            requireLoad?: boolean,
          }
        },
        other: {
          field: string,
          type: string,
          title: string,
        }
      }
    }
  }

  export interface ModelSchema extends Schema {
    $id: string,
    $fields: {
      [field: string]: {
        type: string,
        default?: any,
        relationship?: RelationshipSchema,
        readonly?: boolean,
      }
    },
    $include: {
      [relationship: string]: {
        attributes: string[],
        relationships: string[],
        depth?: number,
      }
    }
  }

  interface JSONApiData extends Json {
    type: string,
    id: number | string,
  }

  interface Links extends Json {
    self?: string,
    related?: string,
  }

  interface JSONApiRelationship extends Json {
    links?: Links,
    data?: JSONApiData | JSONApiData[],
    meta?: Json,
  }

  interface JSONApiIncluded extends Json {
    type: string,
    id: number | string,
    attributes?: Json,
    relationships?: JSONApiRelationship[]
    links?: Links,
  }

  export interface JSONApiDocument extends Json {
    meta?: Json,
    data: { type: string, id: number },
    links?: Links,
    attributes?: Json,
    relationships?: {
      [relationship: string]: JSONApiRelationship[],
    },
    included?: JSONApiIncluded[],
  }
}

export { JSONApi };
