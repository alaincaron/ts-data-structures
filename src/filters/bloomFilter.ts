import { Mapper } from 'ts-fluent-iterators';

export class BloomFilter<T> {
  private readonly _size: number;
  private readonly hashFunctions: Mapper<T, number>[];
  private readonly storage: boolean[];
  private _count: number;

  constructor(size: number, ...hashFunctions: Mapper<T, number>[]) {
    this._size = size;
    this._count = 0;
    this.storage = new Array(size).fill(false);
    this.hashFunctions = hashFunctions;
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
    return this.hashFunctions.every(fn => {
      const index = this.slot(fn(element));
      return this.storage[index];
    });
  }
}
