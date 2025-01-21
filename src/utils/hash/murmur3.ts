import { AbstractHasher, Numeric32HashCode } from './hasher';
import { AbstractHashFunction } from './hashFunction';

export class Murmur3Hasher extends AbstractHasher {
  private h1: number; // hash state
  private len: number; // total length of processed data

  constructor(seed: number = 0) {
    super();
    this.h1 = seed;
    this.len = 0;
  }

  protected update(_: number): never {
    throw new Error('Should not be inovked');
  }

  putBoolean(x: boolean) {
    const buf = Buffer.allocUnsafe(1);
    buf[0] = x ? 1 : 0;
    return this.putBytes(buf);
  }

  putString(x: string) {
    return this.putBytes(Buffer.from(x));
  }

  hash() {
    // Final mix
    let h1 = this.h1;
    h1 ^= this.len;

    h1 = Murmur3Hasher.fmix32(h1);

    return new Numeric32HashCode(h1);
  }

  private static rotl32(x: number, r: number): number {
    return (x << r) | (x >>> (32 - r));
  }

  private static fmix32(h: number): number {
    h ^= h >>> 16;
    h = (h * 0x85ebca6b) | 0;
    h ^= h >>> 13;
    h = (h * 0xc2b2ae35) | 0;
    h ^= h >>> 16;
    return h;
  }

  private processChunk(buf: Buffer, idx: number): void {
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    const n = idx + 4;
    let k1 = 0;
    for (let i = idx; i < n; i++) {
      k1 |= buf[i] << (i * 8); // Assemble 32-bit integer from bytes
    }

    k1 = (k1 * c1) | 0;
    k1 = Murmur3Hasher.rotl32(k1, 15);
    k1 = (k1 * c2) | 0;

    this.h1 ^= k1;
    this.h1 = Murmur3Hasher.rotl32(this.h1, 13);
    this.h1 = (this.h1 * 5 + 0xe6546b64) | 0;
  }

  putBytes(buf: Buffer): this {
    let currentIndex = 0;

    // Process chunks of 4 bytes
    while (currentIndex + 4 <= buf.length) {
      this.processChunk(buf, currentIndex);
      currentIndex += 4;
      this.len += 4;
    }

    // Process remaining bytes
    const remaining = buf.length - currentIndex;
    if (remaining > 0) {
      let k1 = 0;
      for (let i = currentIndex; i < buf.length; i++) {
        k1 |= buf[i] << (i * 8);
      }

      const c1 = 0xcc9e2d51;
      const c2 = 0x1b873593;

      k1 = (k1 * c1) | 0;
      k1 = Murmur3Hasher.rotl32(k1, 15);
      k1 = (k1 * c2) | 0;
      this.h1 ^= k1;
    }

    this.len += remaining;
    return this;
  }
}

export class Murmur3HashFunction extends AbstractHashFunction {
  private constructor() {
    super();
  }
  private static INSTANCE: Murmur3HashFunction | null = null;

  static instance(): Murmur3HashFunction {
    if (!Murmur3HashFunction.INSTANCE) Murmur3HashFunction.INSTANCE = new Murmur3HashFunction();
    return Murmur3HashFunction.INSTANCE;
  }

  newHasher() {
    return new Murmur3Hasher();
  }
}
