import { Cyrb53HashFunction, Funnel, hashAny, HashFunction } from '../utils';

export interface CuckooFilterOptions<T> {
  bucketSize?: number;
  maxKicks?: number;
  hashFunction?: HashFunction;
  funnel?: Funnel<T>;
  fingerPrintSize?: number;
}

export class CuckooFilter<T> {
  private readonly buckets: (number | null)[][];
  private readonly bucketSize: number;
  private readonly maxKicks: number;
  private readonly fingerPrintSize: number;
  private readonly hashFunction: HashFunction;
  private readonly funnel?: Funnel<T>;
  private _count: number;

  constructor(numBuckets: number, options?: CuckooFilterOptions<T>) {
    this.bucketSize = options?.bucketSize ?? 10;
    // Initialize each bucket as an array of `bucketSize`, filled with null
    this.buckets = Array.from({ length: numBuckets }, () => Array(this.bucketSize).fill(null));
    this.maxKicks = options?.maxKicks ?? 500;
    this.hashFunction = options?.hashFunction ?? Cyrb53HashFunction.instance();
    this.fingerPrintSize = options?.fingerPrintSize ?? 0;
    this.funnel = options?.funnel;
    this._count = 0;
  }

  clear() {
    for (let i = 0; i < this.buckets.length; ++i) {
      for (let j = 0; j < this.bucketSize; ++j) {
        this.buckets[i][j] = null;
      }
    }
    this._count = 0;
  }

  count() {
    return this._count;
  }

  private hashValue(value: T, salt: string) {
    return this.funnel
      ? this.hashFunction.newHasher().putObject(value, this.funnel).putString(salt).hash().asNumber()
      : hashAny([value, salt], this.hashFunction);
  }

  private hash1(value: T): number {
    let h = this.hashValue(value, '1') % this.buckets.length;
    if (h < 0) h += this.buckets.length;
    return h;
  }

  private hash2(value: T): number {
    let h = this.hashValue(value, '2') % this.buckets.length;
    if (h < 0) h += this.buckets.length;
    return h;
  }

  private fingerprint(value: T): number {
    let h = this.hashValue(value, 'fp');
    if (this.fingerPrintSize > 0) {
      h %= this.fingerPrintSize - 1;
      if (h < 0) h += this.fingerPrintSize - 1;
    }
    return h;
  }

  insert(value: T): boolean {
    const fp = this.fingerprint(value);
    const i1 = this.hash1(value);
    const i2 = this.hash2(value);

    // Try inserting into either bucket
    if (this.addToBucket(i1, fp) || this.addToBucket(i2, fp)) {
      return true;
    }

    // If both buckets are full, evict a fingerprint
    let index = Math.random() < 0.5 ? i1 : i2;
    for (let n = 0; n < this.maxKicks; n++) {
      const randSlot = Math.floor(Math.random() * this.bucketSize);
      const evictedFp = this.buckets[index][randSlot];

      // Place the new fingerprint in the chosen slot
      this.buckets[index][randSlot] = fp;

      // Stop if the evicted fingerprint is null
      if (evictedFp === null) {
        return true;
      }

      // Relocate the evicted fingerprint
      index = index === i1 ? i2 : i1;

      if (this.addToBucket(index, evictedFp)) {
        return true;
      }
    }

    return false; // Table is full
  }

  lookup(value: T): boolean {
    const fp = this.fingerprint(value);
    const i1 = this.hash1(value);
    const i2 = this.hash2(value);

    return this.buckets[i1].includes(fp) || this.buckets[i2].includes(fp);
  }

  delete(value: T): boolean {
    const fp = this.fingerprint(value);
    const i1 = this.hash1(value);
    const i2 = this.hash2(value);

    if (this.removeFromBucket(i1, fp) || this.removeFromBucket(i2, fp)) {
      return true;
    }

    return false;
  }

  private addToBucket(index: number, fingerprint: number): boolean {
    const bucket = this.buckets[index];
    for (let i = 0; i < this.bucketSize; ++i) {
      if (bucket[i] === null) {
        bucket[i] = fingerprint;
        ++this._count;
        return true;
      }
    }
    return false;
  }

  private removeFromBucket(index: number, fingerprint: number): boolean {
    const bucket = this.buckets[index];
    for (let i = 0; i < this.bucketSize; i++) {
      if (bucket[i] === fingerprint) {
        bucket[i] = null;
        --this._count;
        return true;
      }
    }
    return false;
  }
}
