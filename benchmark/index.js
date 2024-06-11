const Benny = require('benny');
const { ArrayDeque } = require('deques');
const { shuffle, insertionSort, shellSort, mergeSort, qsort } = require('utils');
const { Comparators } = require('ts-fluent-iterators');

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

Benny.suite(
  'sort',

  Benny.add('insertionSort', () => {
    for (let i = 0; i < 1000; ++i) {
      const a = Array.from({ length: 3000 }, (_, i) => i);
      shuffle(a);
      insertionSort(a);
    }
  }),

  Benny.add('shellSort', () => {
    for (let i = 0; i < 1000; ++i) {
      const a = Array.from({ length: 3000 }, (_, i) => i);
      shuffle(a);
      shellSort(a);
    }
  }),

  Benny.add('mergeSort', () => {
    for (let i = 0; i < 1000; ++i) {
      const a = Array.from({ length: 3000 }, (_, i) => i);
      shuffle(a);
      mergeSort(a);
    }
  }),

  Benny.add('qsort', () => {
    for (let i = 0; i < 1000; ++i) {
      const a = Array.from({ length: 3000 }, (_, i) => i);
      shuffle(a);
      qsort(a);
    }
  }),

  Benny.add('native', () => {
    for (let i = 0; i < 1000; ++i) {
      const a = Array.from({ length: 3000 }, (_, i) => i);
      shuffle(a);
      a.sort(Comparators.natural);
    }
  }),

  Benny.cycle(),
  Benny.complete()
);
