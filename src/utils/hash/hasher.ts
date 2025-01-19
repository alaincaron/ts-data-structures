import { Buffer } from 'node:buffer';
import { Funnel } from './funnel';
import { PrimitiveSink } from './primitiveSink';

const MIN_SAFE_INT = 1 << 31;
const MAX_SAFE_INT = ~MIN_SAFE_INT;
const DIVISOR = 2 ** 32;

export interface HashCode {
  bits(): number;
  asNumber(): number;
  asBuffer(): Buffer;
}

abstract class NumericHashCode implements HashCode {
  constructor(private readonly value: number) {}

  asNumber() {
    return this.value;
  }

  abstract bits(): number;
  abstract asBuffer(): Buffer;
}

class Cyrb53HashCode extends NumericHashCode {
  constructor(value: number) {
    super(value);
  }

  bits() {
    return 53;
  }

  asBuffer() {
    const value = this.asNumber();
    const buffer = Buffer.allocUnsafe(7);
    buffer.writeUIntBE(Math.floor(value / DIVISOR), 0, 3);
    buffer.writeIntBE(value & 0xffffffff, 3, 4);
    return buffer;
  }
}

class FNV1a32HashCode extends NumericHashCode {
  constructor(value: number) {
    super(value);
  }

  bits() {
    return 32;
  }

  asBuffer() {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeInt32BE(this.asNumber());
    return buffer;
  }
}

export interface Hasher extends PrimitiveSink {
  putNumber(x: number): Hasher;
  putBytes(buf: Buffer): Hasher;
  putBoolean(x: boolean): Hasher;
  putString(x: string): Hasher;
  hash(): HashCode;
  putOjbect<T>(x: T, funnel: Funnel<T>): Hasher;
}

export abstract class AbstractHasher implements Hasher {
  abstract hash(): HashCode;

  putBytes(buf: Buffer): AbstractHasher {
    for (const x of buf) {
      this.update(x);
    }
    return this;
  }

  putBoolean(x: boolean): AbstractHasher {
    this.update(x ? 1 : 0);
    return this;
  }

  putString(str: string): AbstractHasher {
    for (let i = 0; i < str.length; ++i) {
      this.update(str.charCodeAt(i));
    }
    return this;
  }

  putNumber(h: number): AbstractHasher {
    let buf: Buffer;
    if (Number.isSafeInteger(h) && h <= MAX_SAFE_INT && h >= MIN_SAFE_INT) {
      buf = Buffer.allocUnsafe(4);
      new Int32Array(buf)[0] = h;
    } else {
      buf = Buffer.allocUnsafe(8);
      new Float64Array(buf)[0] = h;
    }
    return this.putBytes(buf);
  }

  protected abstract update(value: number): void;

  putOjbect<T>(x: T, funnel: Funnel<T>): AbstractHasher {
    funnel.funnel(x, this);
    return this;
  }
}

export class Cyrb53Hasher extends AbstractHasher {
  private h1: number;
  private h2: number;

  constructor(seed = 0) {
    super();
    this.h1 = 0xdeadbeef ^ seed;
    this.h2 = 0x41c6ce57 ^ seed;
  }

  protected update(value: number) {
    this.h1 = Math.imul(this.h1 ^ value, 2654435761);
    this.h2 = Math.imul(this.h2 ^ value, 1597334677);
  }

  hash() {
    let hh1 = Math.imul(this.h1 ^ (this.h1 >>> 16), 2246822507);
    hh1 ^= Math.imul(this.h2 ^ (this.h2 >>> 13), 3266489909);
    let hh2 = Math.imul(this.h2 ^ (this.h2 >>> 16), 2246822507);
    hh2 ^= Math.imul(hh1 ^ (hh1 >>> 13), 3266489909);

    return new Cyrb53HashCode(4294967296 * (2097151 & hh2) + (hh1 >>> 0));
  }
}

export class FNV1a32Hasher extends AbstractHasher {
  private h: number;

  constructor() {
    super();
    this.h = 2166136261;
  }

  protected update(value: number) {
    this.h ^= value;
    this.h = Math.imul(this.h, 16777619);
  }

  hash() {
    return new FNV1a32HashCode(this.h);
  }
}
