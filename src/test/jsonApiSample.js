export const jsonApiSample = {
  data: {
    type: 'tests',
    id: 1,
    attributes: {
      name: 'potato',
      extended: {},
    },
    relationships: {
      children: {
        links: {
          related: 'https://example.com/api/tests/1/children',
        },
        data: [{ type: 'tests', id: 2 }],
      },
    },
    links: {
      self: 'https://example.com/api/tests/1',
    },
  },
  included: [
    {
      type: 'tests',
      id: 2,
      attributes: {
        name: 'frotato',
        extended: {
          cohort: 2013,
        },
      },
      relationships: {
        children: {
          links: {
            related: 'https://example.com/api/tests/2/children',
          },
          data: [{ type: 'tests', id: 3 }],
        },
      },
      links: {
        self: 'https://example.com/api/tests/2',
      },
    },
    {
      type: 'tests',
      id: 3,
      attributes: {
        name: 'rutabaga',
        extended: {},
      },
      links: {
        self: 'https://example.com/api/tests/3',
      },
    },
  ],
};
