import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { MapLike } from './types';

export interface MapEntry<K, V> {
  readonly key: K;
  value: V;
}

export interface IMap<K = any, V = any> extends Iterable<[K, V]> {
  size(): number;
  isEmpty(): boolean;
  capacity(): number;
  isFull(): boolean;
  remaining(): number;

  getEntry(key: K): MapEntry<K, V> | undefined;
  get(key: K): V | undefined;

  offer(key: K, value: V): { accepted: boolean; previous?: V };
  put(key: K, value: V): V | undefined;

  containsKey(key: K): boolean;
  containsValue(value: V): boolean;

  remove(key: K): V | undefined;
  filterKeys(predicate: Predicate<K>): void;
  filterValues(predicate: Predicate<V>): void;
  filterEntries(predicate: Predicate<[K, V]>): void;

  putAll<K1 extends K, V1 extends V>(map: MapLike<K1, V1>): void;

  clear(): void;

  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;

  keyIterator(): FluentIterator<K>;
  valueIterator(): FluentIterator<V>;
  entryIterator(): FluentIterator<MapEntry<K, V>>;

  toJson(): string;

  toMap(): Map<K, V>;
  clone(): IMap<K, V>;
}
