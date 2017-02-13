'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// import { Model } from '../model';
// import { Relationship } from '../relationship';

var Children = exports.Children = {
  $name: 'parent_child_relationship',
  $sides: {
    parents: {
      self: {
        field: 'child_id',
        type: 'tests'
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'children'
      }
    },
    children: {
      self: {
        field: 'parent_id',
        type: 'tests'
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'parents'
      }
    }
  }
};

var Likes = exports.Likes = {
  $sides: {
    likers: {
      self: {
        field: 'child_id',
        type: 'tests'
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'likees'
      }
    },
    likees: {
      self: {
        field: 'parent_id',
        type: 'tests'
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'likers'
      }
    }
  },
  $restrict: {
    reaction: {
      type: 'string',
      value: 'like'
    }
  },
  $name: 'reactions'
};

var Agrees = exports.Agrees = {
  $sides: {
    agreers: {
      self: {
        field: 'child_id',
        type: 'tests'
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'agreees'
      }
    },
    agreees: {
      self: {
        field: 'parent_id',
        type: 'tests'
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'agreers'
      }
    }
  },
  $restrict: {
    reaction: {
      type: 'string',
      value: 'agree'
    }
  },
  $name: 'reactions'
};

var ValenceChildren = exports.ValenceChildren = {
  $sides: {
    valenceParents: {
      self: {
        field: 'child_id',
        type: 'tests'
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'valenceChildren'
      }
    },
    valenceChildren: {
      self: {
        field: 'parent_id',
        type: 'tests'
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'valenceParents'
      }
    }
  },
  $extras: {
    perm: {
      type: 'number'
    }
  },
  $name: 'valence_children'
};

var QueryChildren = exports.QueryChildren = {
  $sides: {
    queryParents: {
      self: {
        field: 'child_id',
        type: 'tests',
        query: {
          logic: ['where', ['where', 'child_id', '=', '{id}'], ['where', 'perm', '>=', 2]],
          requireLoad: true
        }
      },
      other: {
        field: 'parent_id',
        type: 'tests',
        title: 'queryChildren'
      }
    },
    queryChildren: {
      self: {
        field: 'parent_id',
        type: 'tests',
        query: {
          logic: ['where', ['where', 'parent_id', '=', '{id}'], ['where', 'perm', '>=', 2]],
          requireLoad: true
        }
      },
      other: {
        field: 'child_id',
        type: 'tests',
        title: 'queryParents'
      }
    }
  },
  $extras: {
    perm: {
      type: 'number'
    }
  },
  $name: 'query_children'
};

var TestType = exports.TestType = {
  $name: 'tests',
  $id: 'id',
  $packageIncludes: ['children'],
  $fields: {
    id: {
      type: 'number'
    },
    name: {
      type: 'string'
    },
    extended: {
      type: 'object',
      default: {}
    },
    children: {
      type: 'hasMany',
      relationship: Children
    },
    valenceChildren: {
      type: 'hasMany',
      relationship: ValenceChildren
    },
    parents: {
      type: 'hasMany',
      relationship: Children
    },
    queryChildren: {
      type: 'hasMany',
      readonly: true,
      relationship: QueryChildren
    },
    queryParents: {
      type: 'hasMany',
      readonly: true,
      relationship: QueryChildren
    },
    valenceParents: {
      type: 'hasMany',
      relationship: ValenceChildren
    },
    likers: {
      type: 'hasMany',
      relationship: Likes
    },
    likees: {
      type: 'hasMany',
      relationship: Likes
    },
    agreers: {
      type: 'hasMany',
      relationship: Agrees
    },
    agreees: {
      type: 'hasMany',
      relationship: Agrees
    }
  },
  $include: {
    children: {
      attributes: ['name', 'extended'],
      relationships: ['children'],
      depth: Infinity
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvdGVzdFR5cGUuanMiXSwibmFtZXMiOlsiQ2hpbGRyZW4iLCIkbmFtZSIsIiRzaWRlcyIsInBhcmVudHMiLCJzZWxmIiwiZmllbGQiLCJ0eXBlIiwib3RoZXIiLCJ0aXRsZSIsImNoaWxkcmVuIiwiTGlrZXMiLCJsaWtlcnMiLCJsaWtlZXMiLCIkcmVzdHJpY3QiLCJyZWFjdGlvbiIsInZhbHVlIiwiQWdyZWVzIiwiYWdyZWVycyIsImFncmVlZXMiLCJWYWxlbmNlQ2hpbGRyZW4iLCJ2YWxlbmNlUGFyZW50cyIsInZhbGVuY2VDaGlsZHJlbiIsIiRleHRyYXMiLCJwZXJtIiwiUXVlcnlDaGlsZHJlbiIsInF1ZXJ5UGFyZW50cyIsInF1ZXJ5IiwibG9naWMiLCJyZXF1aXJlTG9hZCIsInF1ZXJ5Q2hpbGRyZW4iLCJUZXN0VHlwZSIsIiRpZCIsIiRwYWNrYWdlSW5jbHVkZXMiLCIkZmllbGRzIiwiaWQiLCJuYW1lIiwiZXh0ZW5kZWQiLCJkZWZhdWx0IiwicmVsYXRpb25zaGlwIiwicmVhZG9ubHkiLCIkaW5jbHVkZSIsImF0dHJpYnV0ZXMiLCJyZWxhdGlvbnNoaXBzIiwiZGVwdGgiLCJJbmZpbml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBOztBQUVPLElBQU1BLDhCQUFXO0FBQ3RCQyxTQUFPLDJCQURlO0FBRXRCQyxVQUFRO0FBQ05DLGFBQVM7QUFDUEMsWUFBTTtBQUNKQyxlQUFPLFVBREg7QUFFSkMsY0FBTTtBQUZGLE9BREM7QUFLUEMsYUFBTztBQUNMRixlQUFPLFdBREY7QUFFTEMsY0FBTSxPQUZEO0FBR0xFLGVBQU87QUFIRjtBQUxBLEtBREg7QUFZTkMsY0FBVTtBQUNSTCxZQUFNO0FBQ0pDLGVBQU8sV0FESDtBQUVKQyxjQUFNO0FBRkYsT0FERTtBQUtSQyxhQUFPO0FBQ0xGLGVBQU8sVUFERjtBQUVMQyxjQUFNLE9BRkQ7QUFHTEUsZUFBTztBQUhGO0FBTEM7QUFaSjtBQUZjLENBQWpCOztBQTRCQSxJQUFNRSx3QkFBUTtB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TUFBRCxFQUFTLFVBQVQsQ0FESjtBQUVSQyxxQkFBZSxDQUFDLFVBQUQsQ0FGUDtBQUdSQyxhQUFPQztBQUhDO0FBREY7QUExRFksQ0FBakIiLCJmaWxlIjoidGVzdC90ZXN0VHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vbW9kZWwnO1xuLy8gaW1wb3J0IHsgUmVsYXRpb25zaGlwIH0gZnJvbSAnLi4vcmVsYXRpb25zaGlwJztcblxuZXhwb3J0IGNvbnN0IENoaWxkcmVuID0ge1xuICAkbmFtZTogJ3BhcmVudF9jaGlsZF9yZWxhdGlvbnNoaXAnLFxuICAkc2lkZXM6IHtcbiAgICBwYXJlbnRzOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgdGl0bGU6ICdjaGlsZHJlbicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ3BhcmVudHMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IExpa2VzID0ge1xuICAkc2lkZXM6IHtcbiAgICBsaWtlcnM6IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdjaGlsZF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICB9LFxuICAgICAgb3RoZXI6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ2xpa2VlcycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbGlrZWVzOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgIH0sXG4gICAgICBvdGhlcjoge1xuICAgICAgICBmaWVsZDogJ2NoaWxkX2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgdGl0bGU6ICdsaWtlcnMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICAkcmVzdHJpY3Q6IHtcbiAgICByZWFjdGlvbjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogJ2xpa2UnLFxuICAgIH0sXG4gIH0sXG4gICRuYW1lOiAncmVhY3Rpb25zJyxcbn07XG5cbmV4cG9ydCBjb25zdCBBZ3JlZXMgPSB7XG4gICRzaWRlczoge1xuICAgIGFncmVlcnM6IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdjaGlsZF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICB9LFxuICAgICAgb3RoZXI6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ2FncmVlZXMnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGFncmVlZXM6IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ2FncmVlcnMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICAkcmVzdHJpY3Q6IHtcbiAgICByZWFjdGlvbjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogJ2FncmVlJyxcbiAgICB9LFxuICB9LFxuICAkbmFtZTogJ3JlYWN0aW9ucycsXG59O1xuXG5leHBvcnQgY29uc3QgVmFsZW5jZUNoaWxkcmVuID0ge1xuICAkc2lkZXM6IHtcbiAgICB2YWxlbmNlUGFyZW50czoge1xuICAgICAgc2VsZjoge1xuICAgICAgICBmaWVsZDogJ2NoaWxkX2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgIH0sXG4gICAgICBvdGhlcjoge1xuICAgICAgICBmaWVsZDogJ3BhcmVudF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgIHRpdGxlOiAndmFsZW5jZUNoaWxkcmVuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB2YWxlbmNlQ2hpbGRyZW46IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ3ZhbGVuY2VQYXJlbnRzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgJGV4dHJhczoge1xuICAgIHBlcm06IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gIH0sXG4gICRuYW1lOiAndmFsZW5jZV9jaGlsZHJlbicsXG59O1xuXG5leHBvcnQgY29uc3QgUXVlcnlDaGlsZHJlbiA9IHtcbiAgJHNpZGVzOiB7XG4gICAgcXVlcnlQYXJlbnRzOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICBxdWVyeToge1xuICAgICAgICAgIGxvZ2ljOiBbJ3doZXJlJywgWyd3aGVyZScsICdjaGlsZF9pZCcsICc9JywgJ3tpZH0nXSwgWyd3aGVyZScsICdwZXJtJywgJz49JywgMl1dLFxuICAgICAgICAgIHJlcXVpcmVMb2FkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgdGl0bGU6ICdxdWVyeUNoaWxkcmVuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBxdWVyeUNoaWxkcmVuOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICBsb2dpYzogWyd3aGVyZScsIFsnd2hlcmUnLCAncGFyZW50X2lkJywgJz0nLCAne2lkfSddLCBbJ3doZXJlJywgJ3Blcm0nLCAnPj0nLCAyXV0sXG4gICAgICAgICAgcmVxdWlyZUxvYWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3RoZXI6IHtcbiAgICAgICAgZmllbGQ6ICdjaGlsZF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgIHRpdGxlOiAncXVlcnlQYXJlbnRzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgJGV4dHJhczoge1xuICAgIHBlcm06IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gIH0sXG4gICRuYW1lOiAncXVlcnlfY2hpbGRyZW4nLFxufTtcblxuZXhwb3J0IGNvbnN0IFRlc3RUeXBlID0ge1xuICAkbmFtZTogJ3Rlc3RzJyxcbiAgJGlkOiAnaWQnLFxuICAkcGFja2FnZUluY2x1ZGVzOiBbJ2NoaWxkcmVuJ10sXG4gICRmaWVsZHM6IHtcbiAgICBpZDoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgfSxcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICB9LFxuICAgIGV4dGVuZGVkOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIGRlZmF1bHQ6IHt9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogQ2hpbGRyZW4sXG4gICAgfSxcbiAgICB2YWxlbmNlQ2hpbGRyZW46IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogVmFsZW5jZUNoaWxkcmVuLFxuICAgIH0sXG4gICAgcGFyZW50czoge1xuICAgICAgdHlwZTogJ2hhc01hbnknLFxuICAgICAgcmVsYXRpb25zaGlwOiBDaGlsZHJlbixcbiAgICB9LFxuICAgIHF1ZXJ5Q2hpbGRyZW46IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgcmVsYXRpb25zaGlwOiBRdWVyeUNoaWxkcmVuLFxuICAgIH0sXG4gICAgcXVlcnlQYXJlbnRzOiB7XG4gICAgICB0eXBlOiAnaGFzTWFueScsXG4gICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgIHJlbGF0aW9uc2hpcDogUXVlcnlDaGlsZHJlbixcbiAgICB9LFxuICAgIHZhbGVuY2VQYXJlbnRzOiB7XG4gICAgICB0eXBlOiAnaGFzTWFueScsXG4gICAgICByZWxhdGlvbnNoaXA6IFZhbGVuY2VDaGlsZHJlbixcbiAgICB9LFxuICAgIGxpa2Vyczoge1xuICAgICAgdHlwZTogJ2hhc01hbnknLFxuICAgICAgcmVsYXRpb25zaGlwOiBMaWtlcyxcbiAgICB9LFxuICAgIGxpa2Vlczoge1xuICAgICAgdHlwZTogJ2hhc01hbnknLFxuICAgICAgcmVsYXRpb25zaGlwOiBMaWtlcyxcbiAgICB9LFxuICAgIGFncmVlcnM6IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogQWdyZWVzLFxuICAgIH0sXG4gICAgYWdyZWVlczoge1xuICAgICAgdHlwZTogJ2hhc01hbnknLFxuICAgICAgcmVsYXRpb25zaGlwOiBBZ3JlZXMsXG4gICAgfSxcbiAgfSxcbiAgJGluY2x1ZGU6IHtcbiAgICBjaGlsZHJlbjoge1xuICAgICAgYXR0cmlidXRlczogWyduYW1lJywgJ2V4dGVuZGVkJ10sXG4gICAgICByZWxhdGlvbnNoaXBzOiBbJ2NoaWxkcmVuJ10sXG4gICAgICBkZXB0aDogSW5maW5pdHksXG4gICAgfSxcbiAgfSxcbn07XG4iXX0=
