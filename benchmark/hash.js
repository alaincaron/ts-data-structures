const Benny = require('benny');
const { fnv1b, fnv1a, fnv1c, cyrb53, cyrb53_a, hashNumber, hashAny } = require('utils');
const { Comparators } = require('ts-fluent-iterators');

Benny.suite(
  'hash strings',

  Benny.add('fnv1a', () => {
    for (let i = 0; i < 1000; ++i) {
      fnv1a(i.toString());
    }
  }),

  Benny.add('cyrb53', () => {
    for (let i = 0; i < 1000; ++i) {
      cyrb53(i.toString());
    }
  }),

  Benny.add('hashAny', () => {
    for (let i = 0; i < 1000; ++i) {
      hashAny(i.toString());
    }
  }),

  Benny.cycle(),
  Benny.complete()
);

function toBuffer(v) {
  const buf = new ArrayBuffer(4);
  new Uint32Array(buf)[0] = v;
  return buf;
}

Benny.suite(
  'hash numbers',

  Benny.add('fnv1a', () => {
    for (let i = 0; i < 1000; ++i) {
      fnv1a(toBuffer(i));
    }
  }),

  Benny.add('cyrb53', () => {
    for (let i = 0; i < 1000; ++i) {
      cyrb53(toBuffer(i));
    }
  }),

  Benny.add('hashNumber', () => {
    for (let i = 0; i < 1000; ++i) {
      hashNumber(i);
    }
  }),

  Benny.cycle(),
  Benny.complete()
);
