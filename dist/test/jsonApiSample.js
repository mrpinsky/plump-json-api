'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jsonApiSample = exports.jsonApiSample = {
  data: {
    type: 'tests',
    id: 1,
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
    links: {
      self: 'https://example.com/api/tests/1'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QvanNvbkFwaVNhbXBsZS5qcyJdLCJuYW1lcyI6WyJqc29uQXBpU2FtcGxlIiwiZGF0YSIsInR5cGUiLCJpZCIsImF0dHJpYnV0ZXMiLCJuYW1lIiwiZXh0ZW5kZWQiLCJyZWxhdGlvbnNoaXBzIiwiY2hpbGRyZW4iLCJsaW5rcyIsInJlbGF0ZWQiLCJzZWxmIiwiaW5jbHVkZWQiLCJjb2hvcnQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQU8sSUFBTUEsd0NBQWdCO0FBQzNCQyxRQUFNO0FBQ0pDLFVBQU0sT0FERjtBQUVKQyxRQUFJLENBRkE7QUFHSkMsZ0JBQVk7QUFDVkMsWUFBTSxRQURJO0FBRVZDLGdCQUFVO0FBRkEsS0FIUjtBQU9KQyxtQkFBZTtBQUNiQyxnQkFBVTtBQUNSQyxlQUFPO0FBQ0xDLG1CQUFTO0FBREosU0FEQztBQUlSVCxjQUFNLENBQUMsRUFBRUMsTUFBTSxPQUFSLEVBQWlCQyxJQUFJLENBQXJCLEVBQUQ7QUFKRTtBQURHLEtBUFg7QUFlSk0sV0FBTztBQUNMRSxZQUFNO0FBREQ7QUFmSCxHQURxQjtBQW9CM0JDLFlBQVUsQ0FDUjtBQUNFVixVQUFNLE9BRFI7QUFFRUMsUUFBSSxDQUZOO0FBR0VDLGdCQUFZO0FBQ1ZDLFlBQU0sU0FESTtBQUVWQyxnQkFBVTtBQUNSTyxnQkFBUTtBQURBO0FBRkEsS0FIZDtBQVNFTixtQkFBZTtBQUNiQyxnQkFBVTtBQUNSQyxlQUFPO0FBQ0xDLG1CQUFTO0FBREosU0FEQztBQUlSVCxjQUFNLENBQUMsRUFBRUMsTUFBTSxPQUFSLEVBQWlCQyxJQUFJLENBQXJCLEVBQUQ7QUFKRTtBQURHLEtBVGpCO0FBaUJFTSxXQUFPO0FBQ0xFLFlBQU07QUFERDtBQWpCVCxHQURRLEVBc0JSO0FBQ0VULFVBQU0sT0FEUjtBQUVFQyxRQUFJLENBRk47QUFHRUMsZ0JBQVk7QUFDVkMsWUFBTSxVQURJO0FBRVZDLGdCQUFVO0FBRkEsS0FIZDtBQU9FRyxXQUFPO0FBQ0xFLFlBQU07QUFERDtBQVBULEdBdEJRO0FBcEJpQixDQUF0QiIsImZpbGUiOiJ0ZXN0L2pzb25BcGlTYW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QganNvbkFwaVNhbXBsZSA9IHtcbiAgZGF0YToge1xuICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgaWQ6IDEsXG4gICAgYXR0cmlidXRlczoge1xuICAgICAgbmFtZTogJ3BvdGF0bycsXG4gICAgICBleHRlbmRlZDoge30sXG4gICAgfSxcbiAgICByZWxhdGlvbnNoaXBzOiB7XG4gICAgICBjaGlsZHJlbjoge1xuICAgICAgICBsaW5rczoge1xuICAgICAgICAgIHJlbGF0ZWQ6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8xL2NoaWxkcmVuJyxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogW3sgdHlwZTogJ3Rlc3RzJywgaWQ6IDIgfV0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgbGlua3M6IHtcbiAgICAgIHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8xJyxcbiAgICB9LFxuICB9LFxuICBpbmNsdWRlZDogW1xuICAgIHtcbiAgICAgIHR5cGU6ICd0ZXN0cycsXG4gICAgICBpZDogMixcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgbmFtZTogJ2Zyb3RhdG8nLFxuICAgICAgICBleHRlbmRlZDoge1xuICAgICAgICAgIGNvaG9ydDogMjAxMyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByZWxhdGlvbnNoaXBzOiB7XG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgbGlua3M6IHtcbiAgICAgICAgICAgIHJlbGF0ZWQ6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8yL2NoaWxkcmVuJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IFt7IHR5cGU6ICd0ZXN0cycsIGlkOiAzIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGxpbmtzOiB7XG4gICAgICAgIHNlbGY6ICdodHRwczovL2V4YW1wbGUuY29tL2FwaS90ZXN0cy8yJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0eXBlOiAndGVzdHMnLFxuICAgICAgaWQ6IDMsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIG5hbWU6ICdydXRhYmFnYScsXG4gICAgICAgIGV4dGVuZGVkOiB7fSxcbiAgICAgIH0sXG4gICAgICBsaW5rczoge1xuICAgICAgICBzZWxmOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hcGkvdGVzdHMvMycsXG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG59O1xuIl19
