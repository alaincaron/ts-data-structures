import { Predicate } from '../utils';
import { IMap, MapEntry } from './map';
import { MapComparators } from './types';

export abstract class AbstractMap<K, V> implements IMap<K, V> {
  protected readonly equalK: (k1: K, k2: K) => boolean;
  protected readonly equalV: (v1: V, v2: V) => boolean;
  abstract size(): number;
  abstract capacity(): number;

  constructor(options?: MapComparators<K, V>) {
    this.equalK = options?.equalK ?? ((k1, k2) => k1 === k2);
    this.equalV = options?.equalV ?? ((v1, v2) => v1 === v2);
  }

  isEmpty() {
    return this.size() === 0;
  }

  isFull() {
    return this.size() >= this.capacity();
  }

  remaining() {
    return this.capacity() - this.size();
  }

  getEntry(key: K): MapEntry<K, V> | undefined {
    for (const e of this.entries()) {
      if (this.equalK(key, e.key)) return e;
    }
    return undefined;
  }

  get(key: K): V | undefined {
    return this.getEntry(key)?.value;
  }

  abstract put(key: K, value: V): V | undefined;

  containsKey(key: K) {
    return this.getEntry(key) !== undefined;
  }

  containsValue(value: V) {
    for (const v of this.values()) {
      if (this.equalV(value, v)) return true;
    }
    return false;
  }

  abstract remove(key: K): V | undefined;

  filterKeys(predicate: Predicate<K>): void {
    this.filterEntries(([k, _]) => predicate(k));
  }

  filterValues(predicate: Predicate<V>): void {
    this.filterEntries(([_, v]) => predicate(v));
  }

  abstract filterEntries(predicate: Predicate<[K, V]>): void;

  putAll<K1 extends K, V1 extends V>(map: IMap<K1, V1>) {
    for (const { key, value } of map.entries()) {
      this.put(key, value);
    }
  }

  abstract clear(): void;

  *keys(): IterableIterator<K> {
    for (const e of this.entries()) yield e.key;
  }

  *values(): IterableIterator<V> {
    for (const e of this.entries()) yield e.value;
  }

  abstract entries(): IterableIterator<MapEntry<K, V>>;

  abstract clone(): IMap<K, V>;

  [Symbol.iterator](): Iterator<[K, V]> {
    const iter = this.entries();
    return {
      next: () => {
        const item = iter.next();
        if (item.done) {
          return { done: true, value: undefined };
        }
        return { done: false, value: [item.value.key, item.value.value] };
      },
    };
  }
}
