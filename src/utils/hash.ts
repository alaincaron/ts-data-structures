export function fnv1a(s: string | ArrayBuffer): number {
  let h = 2166136261;
  if (typeof s === 'string') {
    for (let i = 0; i < s.length; ++i) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  } else {
    const buf = new Uint8Array(s);
    for (const value of buf) {
      h ^= value;
      h = Math.imul(h, 16777619);
    }
  }
  return h;
}

export function cyrb53(s: string | ArrayBuffer, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;

  if (typeof s === 'string') {
    for (let i = 0; i < s.length; ++i) {
      const ch = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
  } else {
    const buf = new Uint8Array(s);
    for (const value of buf) {
      h1 = Math.imul(h1 ^ value, 2654435761);
      h2 = Math.imul(h2 ^ value, 1597334677);
    }
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const MIN_SAFE_INT = 1 << 31;
const MAX_SAFE_INT = ~MIN_SAFE_INT;

export function hashNumber(h: number): number {
  let buf: ArrayBuffer;
  if (Number.isSafeInteger(h) && h <= MAX_SAFE_INT && h >= MIN_SAFE_INT) {
    buf = new ArrayBuffer(4);
    new Int32Array(buf)[0] = h;
  } else {
    buf = new ArrayBuffer(8);
    new Float64Array(buf)[0] = h;
  }
  return fnv1a(buf);
}

export function hashBoolean(h: boolean): number {
  const buf = new ArrayBuffer(1);
  new Uint8Array(buf)[0] = h ? 1 : 0;
  return fnv1a(buf);
}

export function hashIterableOrdered<X>(iter: Iterable<X>): number {
  let hash = 31;
  for (const item of iter) {
    hash = ((hash << 5) - hash + hashNumber(hashAny(item))) | 0;
  }
  return hash;
}

export function hashIterableUnordered<X>(iter: Iterable<X>): number {
  let hash = 31;
  for (const item of iter) {
    hash = (hash + hashNumber(hashAny(item))) | 0;
  }
  return hash;
}

const BUFFER_TYPES = new Set([
  Uint8Array,
  Int8Array,
  Uint8ClampedArray,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  Float32Array,
  Float64Array,
  DataView,
]);

export function hashAny(x: any): number {
  if (x == null) return 0;
  if (x.hashCode === 'function') return x.hashCode();
  switch (typeof x) {
    case 'string':
      return fnv1a(x);
    case 'number':
      return hashNumber(x);
    case 'boolean':
      return hashBoolean(x);
    case 'function':
    case 'symbol':
      return fnv1a(x.toString());
    case 'bigint':
      return hashNumber(Number(BigInt.asIntN(32, x)));
    default:
      if (x instanceof Set || x instanceof Map) return hashIterableUnordered(x);
      if (x instanceof ArrayBuffer) return fnv1a(x);
      if (BUFFER_TYPES.has(x.constructor)) return fnv1a(x.buffer);
      if (typeof x[Symbol.iterator] === 'function') return hashIterableOrdered(x);
      return hashIterableUnordered(Object.entries(x));
  }
}
