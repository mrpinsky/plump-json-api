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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvdGVzdFR5cGUuanMiXSwibmFtZXMiOlsiQ2hpbGRyZW4iLCIkbmFtZSIsIiRzaWRlcyIsInBhcmVudHMiLCJzZWxmIiwiZmllbGQiLCJ0eXBlIiwib3RoZXIiLCJ0aXRsZSIsImNoaWxkcmVuIiwiTGlrZXMiLCJsaWtlcnMiLCJsaWtlZXMiLCIkcmVzdHJpY3QiLCJyZWFjdGlvbiIsInZhbHVlIiwiQWdyZWVzIiwiYWdyZWVycyIsImFncmVlZXMiLCJWYWxlbmNlQ2hpbGRyZW4iLCJ2YWxlbmNlUGFyZW50cyIsInZhbGVuY2VDaGlsZHJlbiIsIiRleHRyYXMiLCJwZXJtIiwiUXVlcnlDaGlsZHJlbiIsInF1ZXJ5UGFyZW50cyIsInF1ZXJ5IiwibG9naWMiLCJyZXF1aXJlTG9hZCIsInF1ZXJ5Q2hpbGRyZW4iLCJUZXN0VHlwZSIsIiRpZCIsIiRmaWVsZHMiLCJpZCIsIm5hbWUiLCJleHRlbmRlZCIsImRlZmF1bHQiLCJyZWxhdGlvbnNoaXAiLCJyZWFkb25seSIsIiRpbmNsdWRlIiwiYXR0cmlidXRlcyIsInJlbGF0aW9uc2hpcHMiLCJkZXB0aCIsIkluZmluaXR5Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7O0FBRU8sSUFBTUEsOEJBQVc7QUFDdEJDLFNBQU8sMkJBRGU7QUFFdEJDLFVBQVE7QUFDTkMsYUFBUztBQUNQQyxZQUFNO0FBQ0pDLGVBQU8sVUFESDtBQUVKQyxjQUFNO0FBRkYsT0FEQztBQUtQQyxhQUFPO0FBQ0xGLGVBQU8sV0FERjtBQUVMQyxjQUFNLE9BRkQ7QUFHTEUsZUFBTztBQUhGO0FBTEEsS0FESDtBQVlOQyxjQUFVO0FBQ1JMLFlBQU07QUFDSkMsZUFBTyxXQURIO0FBRUpDLGNBQU07QUFGRixPQURFO0FBS1JDLGFBQU87QUFDTEYsZUFBTyxVQURGO0FBRUxDLGNBQU0sT0FGRDtBQUdMRSxlQUFPO0FBSEY7QUFMQztBQVpKO0FBRmMsQ0FBakI7O0FBNEJBLElBQU1FLHdCQUFRO0FBQ25CUixVQUFRO0FBQ05TLFlB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QUdSQyxhQUFPQztBQUhDO0FBREY7QUF6RFksQ0FBakIiLCJmaWxlIjoidGVzdC90ZXN0VHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vbW9kZWwnO1xuLy8gaW1wb3J0IHsgUmVsYXRpb25zaGlwIH0gZnJvbSAnLi4vcmVsYXRpb25zaGlwJztcblxuZXhwb3J0IGNvbnN0IENoaWxkcmVuID0ge1xuICAkbmFtZTogJ3BhcmVudF9jaGlsZF9yZWxhdGlvbnNoaXAnLFxuICAkc2lkZXM6IHtcbiAgICBwYXJlbnRzOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgdGl0bGU6ICdjaGlsZHJlbicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ3BhcmVudHMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IExpa2VzID0ge1xuICAkc2lkZXM6IHtcbiAgICBsaWtlcnM6IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdjaGlsZF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICB9LFxuICAgICAgb3RoZXI6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ2xpa2VlcycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbGlrZWVzOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgIH0sXG4gICAgICBvdGhlcjoge1xuICAgICAgICBmaWVsZDogJ2NoaWxkX2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgdGl0bGU6ICdsaWtlcnMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICAkcmVzdHJpY3Q6IHtcbiAgICByZWFjdGlvbjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogJ2xpa2UnLFxuICAgIH0sXG4gIH0sXG4gICRuYW1lOiAncmVhY3Rpb25zJyxcbn07XG5cbmV4cG9ydCBjb25zdCBBZ3JlZXMgPSB7XG4gICRzaWRlczoge1xuICAgIGFncmVlcnM6IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdjaGlsZF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICB9LFxuICAgICAgb3RoZXI6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ2FncmVlZXMnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGFncmVlZXM6IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ2FncmVlcnMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICAkcmVzdHJpY3Q6IHtcbiAgICByZWFjdGlvbjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICB2YWx1ZTogJ2FncmVlJyxcbiAgICB9LFxuICB9LFxuICAkbmFtZTogJ3JlYWN0aW9ucycsXG59O1xuXG5leHBvcnQgY29uc3QgVmFsZW5jZUNoaWxkcmVuID0ge1xuICAkc2lkZXM6IHtcbiAgICB2YWxlbmNlUGFyZW50czoge1xuICAgICAgc2VsZjoge1xuICAgICAgICBmaWVsZDogJ2NoaWxkX2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgIH0sXG4gICAgICBvdGhlcjoge1xuICAgICAgICBmaWVsZDogJ3BhcmVudF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgIHRpdGxlOiAndmFsZW5jZUNoaWxkcmVuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB2YWxlbmNlQ2hpbGRyZW46IHtcbiAgICAgIHNlbGY6IHtcbiAgICAgICAgZmllbGQ6ICdwYXJlbnRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICB0aXRsZTogJ3ZhbGVuY2VQYXJlbnRzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgJGV4dHJhczoge1xuICAgIHBlcm06IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gIH0sXG4gICRuYW1lOiAndmFsZW5jZV9jaGlsZHJlbicsXG59O1xuXG5leHBvcnQgY29uc3QgUXVlcnlDaGlsZHJlbiA9IHtcbiAgJHNpZGVzOiB7XG4gICAgcXVlcnlQYXJlbnRzOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAnY2hpbGRfaWQnLFxuICAgICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgICBxdWVyeToge1xuICAgICAgICAgIGxvZ2ljOiBbJ3doZXJlJywgWyd3aGVyZScsICdjaGlsZF9pZCcsICc9JywgJ3tpZH0nXSwgWyd3aGVyZScsICdwZXJtJywgJz49JywgMl1dLFxuICAgICAgICAgIHJlcXVpcmVMb2FkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG90aGVyOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgdGl0bGU6ICdxdWVyeUNoaWxkcmVuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBxdWVyeUNoaWxkcmVuOiB7XG4gICAgICBzZWxmOiB7XG4gICAgICAgIGZpZWxkOiAncGFyZW50X2lkJyxcbiAgICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICBsb2dpYzogWyd3aGVyZScsIFsnd2hlcmUnLCAncGFyZW50X2lkJywgJz0nLCAne2lkfSddLCBbJ3doZXJlJywgJ3Blcm0nLCAnPj0nLCAyXV0sXG4gICAgICAgICAgcmVxdWlyZUxvYWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgb3RoZXI6IHtcbiAgICAgICAgZmllbGQ6ICdjaGlsZF9pZCcsXG4gICAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICAgIHRpdGxlOiAncXVlcnlQYXJlbnRzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgJGV4dHJhczoge1xuICAgIHBlcm06IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gIH0sXG4gICRuYW1lOiAncXVlcnlfY2hpbGRyZW4nLFxufTtcblxuZXhwb3J0IGNvbnN0IFRlc3RUeXBlID0ge1xuICAkbmFtZTogJ3Rlc3RzJyxcbiAgJGlkOiAnaWQnLFxuICAkZmllbGRzOiB7XG4gICAgaWQ6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgIH0sXG4gICAgbmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgfSxcbiAgICBleHRlbmRlZDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBkZWZhdWx0OiB7fSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICB0eXBlOiAnaGFzTWFueScsXG4gICAgICByZWxhdGlvbnNoaXA6IENoaWxkcmVuLFxuICAgIH0sXG4gICAgdmFsZW5jZUNoaWxkcmVuOiB7XG4gICAgICB0eXBlOiAnaGFzTWFueScsXG4gICAgICByZWxhdGlvbnNoaXA6IFZhbGVuY2VDaGlsZHJlbixcbiAgICB9LFxuICAgIHBhcmVudHM6IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogQ2hpbGRyZW4sXG4gICAgfSxcbiAgICBxdWVyeUNoaWxkcmVuOiB7XG4gICAgICB0eXBlOiAnaGFzTWFueScsXG4gICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgIHJlbGF0aW9uc2hpcDogUXVlcnlDaGlsZHJlbixcbiAgICB9LFxuICAgIHF1ZXJ5UGFyZW50czoge1xuICAgICAgdHlwZTogJ2hhc01hbnknLFxuICAgICAgcmVhZG9ubHk6IHRydWUsXG4gICAgICByZWxhdGlvbnNoaXA6IFF1ZXJ5Q2hpbGRyZW4sXG4gICAgfSxcbiAgICB2YWxlbmNlUGFyZW50czoge1xuICAgICAgdHlwZTogJ2hhc01hbnknLFxuICAgICAgcmVsYXRpb25zaGlwOiBWYWxlbmNlQ2hpbGRyZW4sXG4gICAgfSxcbiAgICBsaWtlcnM6IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogTGlrZXMsXG4gICAgfSxcbiAgICBsaWtlZXM6IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogTGlrZXMsXG4gICAgfSxcbiAgICBhZ3JlZXJzOiB7XG4gICAgICB0eXBlOiAnaGFzTWFueScsXG4gICAgICByZWxhdGlvbnNoaXA6IEFncmVlcyxcbiAgICB9LFxuICAgIGFncmVlZXM6IHtcbiAgICAgIHR5cGU6ICdoYXNNYW55JyxcbiAgICAgIHJlbGF0aW9uc2hpcDogQWdyZWVzLFxuICAgIH0sXG4gIH0sXG4gICRpbmNsdWRlOiB7XG4gICAgY2hpbGRyZW46IHtcbiAgICAgIGF0dHJpYnV0ZXM6IFsnbmFtZScsICdleHRlbmRlZCddLFxuICAgICAgcmVsYXRpb25zaGlwczogWydjaGlsZHJlbiddLFxuICAgICAgZGVwdGg6IEluZmluaXR5LFxuICAgIH0sXG4gIH0sXG59O1xuIl19
