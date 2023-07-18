const Benny = require('benny');
const { ArrayDeque } = require('array_deque');

Benny.suite(
  'FIFO grow array',

  Benny.add('ArrayDeque', () => {
    const d = new ArrayDeque();
    for (let i = 0; i < 1000; ++i) {
      d.add(i);
    }
    while (!d.isEmpty()) d.remove();
  }),

  Benny.add('Array', () => {
    const arr = [];
    for (let i = 0; i < 1000; ++i) {
      arr.push(i);
    }
    while (arr.length > 0) arr.shift();
  }),

  Benny.cycle(),
  Benny.complete()
);

Benny.suite(
  'FIFO constant size',

  Benny.add('ArrayDeque', () => {
    const d = new ArrayDeque();
    for (let i = 0; i < 1000; ++i) {
      d.add(i);
      d.remove();
    }
  }),

  Benny.add('Array', () => {
    const arr = [];
    for (let i = 0; i < 1000; ++i) {
      arr.push(i);
      arr.shift();
    }
  }),

  Benny.cycle(),
  Benny.complete()
);

Benny.suite(
  'filter',

  Benny.add('ArrayDeque', () => {
    const d = new ArrayDeque();
    for (let i = 0; i < 1000; ++i) {
      d.add(i);
    }
    d.filter(i => i % 2 === 0);
  }),

  Benny.add('Array', () => {
    const arr = [];
    for (let i = 0; i < 1000; ++i) {
      arr.push(i);
    }
    const arr2 = arr.filter(i => i % 2 === 0);
  }),

  Benny.cycle(),
  Benny.complete()
);
