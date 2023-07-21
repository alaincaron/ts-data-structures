import { Predicate } from '../utils';
import { IMap } from './map';

export abstract class AbstractMap<K, V> implements IMap<K, V> {
  abstract size(): number;
  abstract capacity(): number;

  isEmpty() {
    return this.size() != 0;
  }

  isFull() {
    return this.size() >= this.capacity();
  }

  get(key: K): V | undefined {
    for (const [k, v] of this.entries()) {
      if (k === key) return v;
    }
    return undefined;
  }

  abstract put(key: K, value: V): V | undefined;

  containsKey(key: K) {
    for (const k of this.keys()) {
      if (k === key) return true;
    }
    return false;
  }

  containsValue(value: V) {
    for (const v of this.values()) {
      if (v === value) return true;
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
    for (const [k, v] of map.entries()) {
      this.put(k, v);
    }
  }

  abstract clear(): void;

  *keys(): IterableIterator<K> {
    for (const [k, _] of this.entries()) yield k;
  }

  *values(): IterableIterator<V> {
    for (const [_, v] of this.entries()) yield v;
  }

  abstract entries(): IterableIterator<[K, V]>;

  abstract clone(): IMap<K, V>;
}
