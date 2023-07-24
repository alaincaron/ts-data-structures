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

export function hashStringJava(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; ++i) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

export function hashNumber(h: number): number {
  h ^= (h >>> 20) ^ (h >>> 12);
  return h ^ (h >>> 7) ^ (h >>> 4);
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
    default:
      if (typeof x[Symbol.iterator] === 'function') {
        let hash = 0;
        for (const y of x) {
          hash = ((hash << 5) - hash + hashAny(y)) | 0;
        }
        return hash;
      }
      if (typeof x.toString === 'function') return cyrb53(x.toString() as string);
      return cyrb53(JSON.stringify(x));
  }
}
