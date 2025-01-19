import { Funnel } from './funnel';
import { Cyrb53Hasher, FNV1a32Hasher, HashCode, Hasher } from './hasher';

export interface HashFunction {
  newHasher(): Hasher;
  hashNumber(x: number): HashCode;
  hashBytes(buf: Buffer): HashCode;
  hashBoolean(x: boolean): HashCode;
  hashString(x: string): HashCode;
  hashOjbect<T>(x: T, funnel: Funnel<T>): HashCode;
}

export abstract class AbstractHashFunction implements HashFunction {
  abstract newHasher(): Hasher;

  hashNumber(x: number) {
    return this.newHasher().putNumber(x).hash();
  }

  hashBytes(buf: Buffer) {
    return this.newHasher().putBytes(buf).hash();
  }

  hashBoolean(x: boolean) {
    return this.newHasher().putBoolean(x).hash();
  }

  hashString(x: string) {
    return this.newHasher().putString(x).hash();
  }

  hashOjbect<T>(x: T, funnel: Funnel<T>) {
    return this.newHasher().putOjbect(x, funnel).hash();
  }
}

export class Cyrb53HashFunction extends AbstractHashFunction {
  private constructor() {
    super();
  }
  private static INSTANCE: Cyrb53HashFunction | null = null;

  static instance(): Cyrb53HashFunction {
    if (!Cyrb53HashFunction.INSTANCE) Cyrb53HashFunction.INSTANCE = new Cyrb53HashFunction();
    return Cyrb53HashFunction.INSTANCE;
  }

  newHasher() {
    return new Cyrb53Hasher();
  }
}

export class FNV1a32HashFunction extends AbstractHashFunction {
  private constructor() {
    super();
  }
  private static INSTANCE: FNV1a32HashFunction | null = null;

  static instance(): FNV1a32HashFunction {
    if (!FNV1a32HashFunction.INSTANCE) FNV1a32HashFunction.INSTANCE = new FNV1a32HashFunction();
    return FNV1a32HashFunction.INSTANCE;
  }

  newHasher() {
    return new FNV1a32Hasher();
  }
}
