import { Mapper } from 'ts-fluent-iterators';
import { Cyrb53HashFunction, Funnel, hashAny, HashFunction } from '../utils';

export type BloomFilterFunction<T> = HashFunction | Mapper<T, number>;
export interface BloomFilterOptions<T> {
  hashFunctions?: BloomFilterFunction<T>[];
  funnel?: Funnel<T>;
  generate?: number;
}

function generateHashFunctions<T>(options?: BloomFilterOptions<T>): Mapper<T, number>[] {
  const functions: Mapper<T, number>[] = [];
  const funnel = options?.funnel;
  if (options?.hashFunctions) {
    for (const f of options.hashFunctions) {
      if (typeof f === 'function') {
        functions.push(f);
      } else {
        if (funnel) {
          functions.push((t: T) => f.hashObject(t, funnel).asNumber());
        } else {
          functions.push((t: T) => hashAny(t, f));
        }
      }
    }
  }
  if (options?.generate && options.generate > functions.length) {
    for (let i = functions.length; i < options.generate; ++i) {
      if (funnel) {
        functions.push((t: T) =>
          Cyrb53HashFunction.instance().newHasher().putObject(t, funnel).putNumber(i).hash().asNumber()
        );
      } else {
        functions.push((t: T) => hashAny([t, i], Cyrb53HashFunction.instance()));
      }
    }
  }
  // Default to at least one hash function if none provided
  if (functions.length === 0) {
    functions.push((t: T) => hashAny(t, Cyrb53HashFunction.instance()));
  }

  return functions;
}

export class BloomFilter<T> {
  private readonly _size: number;
  private readonly hashFunctions: Mapper<T, number>[];
  private readonly storage: boolean[];
  private _count: number;

  constructor(size: number, options?: BloomFilterOptions<T>) {
    this._size = size;
    this._count = 0;
    this.storage = new Array(size).fill(false);
    this.hashFunctions = generateHashFunctions(options);
  }

  clear() {
    this._count = 0;
    this.storage.fill(false);
  }

  size() {
    return this._size;
  }

  count() {
    return this._count;
  }

  private slot(idx: number) {
    let v = idx % this._size;
    if (v < 0) v += this._size;
    return v;
  }

  // Adds an element to the Bloom filter
  add(element: T) {
    this.hashFunctions.forEach(fn => {
      const index = this.slot(fn(element));
      this.storage[index] = true;
    });
    this._count++;
  }

  // Checks if an element might exist in the Bloom filter
  contains(element: T): boolean {
    if (this._count === 0) return false;
    return this.hashFunctions.every(fn => {
      const index = this.slot(fn(element));
      return this.storage[index];
    });
  }
}
