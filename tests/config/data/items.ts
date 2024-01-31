import id from './id';

const items = [
  {
    name: 'Test Item',
    slug: 'test',
    price: 2499,
    images: [
      {
        url: 'example.png',
      },
    ],
    store: id.store.notOpen,
  },
  {
    name: 'Test Item',
    slug: 'test',
    price: 2499,
    images: [
      {
        url: 'example.png',
      },
    ],
    store: id.store.closed,
  },
];

export default items;
