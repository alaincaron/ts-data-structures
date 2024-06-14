const Benny = require('benny');
const { shuffle, insertionSort, shellSort, mergeSort, qsort } = require('utils');
const { Comparators } = require('ts-fluent-iterators');

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
