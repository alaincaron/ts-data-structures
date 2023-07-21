import { Predicate } from '../utils';

export interface IMap<K, V> {
  size(): number;
  isEmpty(): boolean;
  capacity(): number;
  isFull(): boolean;

  get(key: K): V | undefined;

  put(key: K, value: V): V | undefined;

  containsKey(key: K): boolean;
  containsValue(value: V): boolean;

  remove(key: K): V | undefined;
  filterKeys(predicate: Predicate<K>): void;
  filterValues(predicate: Predicate<V>): void;
  filterEntries(predicate: Predicate<[K, V]>): void;

  putAll<K1 extends K, V1 extends V>(map: IMap<K1, V1>): void;

  clear(): void;

  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;

  clone(): IMap<K, V>;
}
