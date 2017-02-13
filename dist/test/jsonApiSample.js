'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jsonApiSample = exports.jsonApiSample = {
  links: {
    self: 'https://example.com/api/tests/1'
  },
  data: {
    type: 'tests',
    id: 1
  },
  attributes: {
    name: 'potato',
    extended: {}
  },
  relationships: {
    children: {
      links: {
        related: 'https://example.com/api/tests/1/children'
      },
      data: [{ type: 'tests', id: 2 }]
    }
  },
  included: [{
    type: 'tests',
    id: 2,
    attributes: {
      name: 'frotato',
      extended: {
        cohort: 2013
      }
    },
    relationships: {
      children: {
        links: {
          related: 'https://example.com/api/tests/2/children'
        },
        data: [{ type: 'tests', id: 3 }]
      }
    },
    links: {
      self: 'https://example.com/api/tests/2'
    }
  }, {
    type: 'tests',
    id: 3,
    attributes: {
      name: 'rutabaga',
      extended: {}
    },
    links: {
      self: 'https://example.com/api/tests/3'
    }
  }]
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaVNhbXBsZS5qcyJdLCJuYW1lcyI6WyJqc29uQXBpU2FtcGxlIiwibGlua3MiLCJzZWxmIiwiZGF0YSIsInR5cGUiLCJpZCIsImF0dHJpYnV0ZXMiLCJuYW1lIiwiZXh0ZW5kZWQiLCJyZWxhdGlvbnNoaXBzIiwiY2hpbGRyZW4iLCJyZWxhdGVkIiwiaW5jbHVkZWQiLCJjb2hvcnQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sSUFBTUEsd0NBQWdCO0FBQzNCQyxTQUFPO0FBQ0xDLFVBQU07QUFERCxHQURvQjtBQUkzQkMsUUFBTTtBQUNKQyxVQUFNLE9BREY7QUFFSkMsUUFBSTtBQUZBLEdBSnFCO0FBUTNCQyxjQUFZO0FBQ1ZDLFVBQU0sUUFESTtBQUVWQyxjQUFVO0FBRkEsR0FSZTtBQVkzQkMsaUJBQWU7QUFDYkMsY0FBVTtBQUNSVCxhQUFPO0FBQ0xVLGlCQUFTO0FBREosT0FEQztBQUlSUixZQUFNLENBQ0osRUFBRUMsTUFBTSxPQUFSLEVBQWlCQyxJQUFJLENBQXJCLEVBREk7QUFKRTtBQURHLEdBWlk7QUFzQjNCTyxZQUNBLENBQ0U7QUFDRVIsVUFBTSxPQURSO0FBRUVDLFFBQUksQ0FGTjtBQUdFQyxnQkFBWTtBQUNWQyxZQUFNLFNBREk7QUFFVkMsZ0JBQVU7QUFDUkssZ0JBQVE7QUFEQTtBQUZBLEtBSGQ7QUFTRUosbUJBQWU7QUFDYkMsZ0JBQVU7QUFDUlQsZUFBTztBQUNMVSxtQkFBUztBQURKLFNBREM7QUFJUlIsY0FBTSxDQUFDLEVBQUVDLE1BQU0sT0FBUixFQUFpQkMsSUFBSSxDQUFyQixFQUFEO0FBSkU7QUFERyxLQVRqQjtBQWlCRUosV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFqQlQsR0FERixFQXNCRTtBQUNFRSxVQUFNLE9BRFI7QUFFRUMsUUFBSSxDQUZOO0FBR0VDLGdCQUFZO0FBQ1ZDLFlBQU0sVUFESTtBQUVWQyxnQkFBVTtBQUZBLEtBSGQ7QUFPRVAsV0FBTztBQUNMQyxZQUFNO0FBREQ7QUFQVCxHQXRCRjtBQXZCMkIsQ0FBdEIiLCJmaWxlIjoidGVzdC9qc29uQXBpU2FtcGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGpzb25BcGlTYW1wbGUgPSB7XG4gIGxpbmtzOiB7XG4gICAgc2VsZjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpL3Rlc3RzLzEnLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogJ3Rlc3RzJyxcbiAgICBpZDogMSxcbiAgfSxcbiAgYXR0cmlidXRlczoge1xuICAgIG5hbWU6ICdwb3RhdG8nLFxuICAgIGV4dGVuZGVkOiB7fSxcbiAgfSxcbiAgcmVsYXRpb25zaGlwczoge1xuICAgIGNoaWxkcmVuOiB7XG4gICAgICBsaW5rczoge1xuICAgICAgICByZWxhdGVkOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hcGkvdGVzdHMvMS9jaGlsZHJlbicsXG4gICAgICB9LFxuICAgICAgZGF0YTogW1xuICAgICAgICB7IHR5cGU6ICd0ZXN0cycsIGlkOiAyIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIGluY2x1ZGVkOlxuICBbXG4gICAge1xuICAgICAgdHlwZTogJ3Rlc3RzJyxcbiAgICAgIGlkOiAyLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBuYW1lOiAnZnJvdGF0bycsXG4gICAgICAgIGV4dGVuZGVkOiB7XG4gICAgICAgICAgY29ob3J0OiAyMDEzLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlbGF0aW9uc2hpcHM6IHtcbiAgICAgICAgY2hpbGRyZW46IHtcbiAgICAgICAgICBsaW5rczoge1xuICAgICAgICAgICAgcmVsYXRlZDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpL3Rlc3RzLzIvY2hpbGRyZW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YTogW3sgdHlwZTogJ3Rlc3RzJywgaWQ6IDMgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbGlua3M6IHtcbiAgICAgICAgc2VsZjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXBpL3Rlc3RzLzInLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICBpZDogMyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgbmFtZTogJ3J1dGFiYWdhJyxcbiAgICAgICAgZXh0ZW5kZWQ6IHt9LFxuICAgICAgfSxcbiAgICAgIGxpbmtzOiB7XG4gICAgICAgIHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8zJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbn07XG4iXX0=
