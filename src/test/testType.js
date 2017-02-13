// import { Model } from '../model';
// import { Relationship } from '../relationship';

export const Children = {
  $name: 'parent_child_relationship',
  $sides: {
    parents: {
      self: {
        field: 'child_id',
        type: 'tests',
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'children',
      },
    },
    children: {
      self: {
        field: 'parent_id',
        type: 'tests',
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'parents',
      },
    },
  },
};

export const Likes = {
  $sides: {
    likers: {
      self: {
        field: 'child_id',
        type: 'tests',
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'likees',
      },
    },
    likees: {
      self: {
        field: 'parent_id',
        type: 'tests',
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'likers',
      },
    },
  },
  $restrict: {
    reaction: {
      type: 'string',
      value: 'like',
    },
  },
  $name: 'reactions',
};

export const Agrees = {
  $sides: {
    agreers: {
      self: {
        field: 'child_id',
        type: 'tests',
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'agreees',
      },
    },
    agreees: {
      self: {
        field: 'parent_id',
        type: 'tests',
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'agreers',
      },
    },
  },
  $restrict: {
    reaction: {
      type: 'string',
      value: 'agree',
    },
  },
  $name: 'reactions',
};

export const ValenceChildren = {
  $sides: {
    valenceParents: {
      self: {
        field: 'child_id',
        type: 'tests',
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'valenceChildren',
      },
    },
    valenceChildren: {
      self: {
        field: 'parent_id',
        type: 'tests',
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'valenceParents',
      },
    },
  },
  $extras: {
    perm: {
      type: 'number',
    },
  },
  $name: 'valence_children',
};

export const QueryChildren = {
  $sides: {
    queryParents: {
      self: {
        field: 'child_id',
        type: 'tests',
        query: {
          logic: ['where', ['where', 'child_id', '=', '{id}'], ['where', 'perm', '>=', 2]],
          requireLoad: true,
        },
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'queryChildren',
      },
    },
    queryChildren: {
      self: {
        field: 'parent_id',
        type: 'tests',
        query: {
          logic: ['where', ['where', 'parent_id', '=', '{id}'], ['where', 'perm', '>=', 2]],
          requireLoad: true,
        },
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'queryParents',
      },
    },
  },
  $extras: {
    perm: {
      type: 'number',
    },
  },
  $name: 'query_children',
};

export const TestType = {
  $name: 'tests',
  $id: 'id',
  $packageIncludes: ['children'],
  $fields: {
    id: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    extended: {
      type: 'object',
      default: {},
    },
    children: {
      type: 'hasMany',
      relationship: Children,
    },
    valenceChildren: {
      type: 'hasMany',
      relationship: ValenceChildren,
    },
    parents: {
      type: 'hasMany',
      relationship: Children,
    },
    queryChildren: {
      type: 'hasMany',
      readonly: true,
      relationship: QueryChildren,
    },
    queryParents: {
      type: 'hasMany',
      readonly: true,
      relationship: QueryChildren,
    },
    valenceParents: {
      type: 'hasMany',
      relationship: ValenceChildren,
    },
    likers: {
      type: 'hasMany',
      relationship: Likes,
    },
    likees: {
      type: 'hasMany',
      relationship: Likes,
    },
    agreers: {
      type: 'hasMany',
      relationship: Agrees,
    },
    agreees: {
      type: 'hasMany',
      relationship: Agrees,
    },
  },
  $include: {
    children: {
      attributes: ['name', 'extended'],
      relationships: ['children'],
      depth: Infinity,
    },
  },
};
