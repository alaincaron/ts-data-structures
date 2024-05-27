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
  const buf = new ArrayBuffer(4);
  new Float32Array(buf)[0] = h;
  return new Uint32Array(buf)[0];
}

export function hashNumber(h: number): number {
  return hashInteger(FloatToIEEE(h));
}

export function hashIterableOrdered<X>(iter: Iterable<X>, hasher: Mapper<X, number> = hashAny): number {
  let hash = 31;
  for (const item of iter) {
    hash = ((hash << 5) - hash + hashNumber(hasher(item))) | 0;
  }
  return hash;
}

export function hashIterableUnordered<X>(iter: Iterable<X>, hasher: Mapper<X, number> = hashAny): number {
  let hash = 31;
  for (const item of iter) {
    hash = (hash + hashNumber(hasher(item))) | 0;
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
      if (x instanceof Set || x instanceof Map) {
        return hashIterableUnordered(x);
      }
      if (typeof x[Symbol.iterator] === 'function') {
        return hashIterableOrdered(x);
      }
      return hashIterableUnordered(Object.entries(x));
  }
}
