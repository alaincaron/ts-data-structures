import { Mapper } from 'ts-fluent-iterators';

export function cyrb53(s: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;

  for (let i = 0; i < s.length; ++i) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function hashInteger(h: number): number {
  h ^= (h >>> 20) ^ (h >>> 12);
  return h ^ (h >>> 7) ^ (h >>> 4);
}

function FloatToIEEE(h: number): number {
  var buf = new ArrayBuffer(4);
  new Float32Array(buf)[0] = h;
  return new Uint32Array(buf)[0];
}

export function hashNumber(h: number): number {
  return hashInteger(FloatToIEEE(h));
}

export function hashIterable<X>(iter: Iterable<X>, hasher: Mapper<X, number> = hashAny): number {
  let hash = 31;
  for (const item of iter) {
    hash = ((hash << 5) - hash + hashNumber(hasher(item))) | 0;
  }
  return hash;
}

export function hashAny(x: any): number {
  if (x == null) return 0;
  if (x.hashCode === 'function') return x.hashCode();
  switch (typeof x) {
    case 'string':
      return cyrb53(x);
    case 'number':
      return hashNumber(x);
    case 'boolean':
      return x ? 1231 : 1237;
    case 'function':
    case 'symbol':
      return cyrb53(x.toString());
    case 'bigint':
      return hashNumber(Number(BigInt.asIntN(32, x)));
    default:
      if (typeof x[Symbol.iterator] === 'function') {
        return hashIterable(x);
      }
      return hashIterable(Object.entries(x));
  }
}

export function equalsIterable(x: Iterable<any>, y: Iterable<any>): boolean {
  const iter1 = x[Symbol.iterator]();
  const iter2 = y[Symbol.iterator]();
  for (;;) {
    const item1 = iter1.next();
    const item2 = iter2.next();
    if (item1.done || item2.done) return item1.done === item2.done;
    if (!equalsAny(item1.value, item2.value)) return false;
  }
}

export function equalsAny(x: any, y: any): boolean {
  if (x === y) return true;
  if (typeof x != typeof y) return false;
  if (x == null || y == null) return x === y;
  switch (typeof x) {
    case 'object':
      if (typeof x.equals === 'function') return x.equals(y);
      if (x.constructor != y.constructor) return false;
      const isIterableX = typeof x[Symbol.iterator] === 'function';
      const isIterableY = typeof y[Symbol.iterator] === 'function';
      if (isIterableX) {
        return isIterableY && equalsIterable(x, y);
      }
      return !isIterableY && equalsIterable(Object.entries(x), Object.entries(y));
    default:
      return false;
  }
}
