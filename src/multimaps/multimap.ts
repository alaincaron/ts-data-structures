import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { ReadOnlyMultiMap } from './readonly_multimap';
import { Collection } from '../collections';
import { MapLike } from '../maps';

export type MultiMapLike<K, V> = MapLike<K, V>;

export interface MultiMap<K, V> extends ReadOnlyMultiMap<K, V> {
  getValues(k: K): Collection<V> | undefined;

  removeEntry(key: K, value: V): boolean;

  removeKey(key: K): Collection<V> | undefined;

  offer(key: K, value: V): boolean;

  put(key: K, value: V): boolean;

  putAll<K1 extends K, V1 extends V>(map: MultiMapLike<K1, V1>): void;

  clear(): MultiMap<K, V>;

  filterKeys(predicate: Predicate<K>): number;

  filterEntries(predicate: Predicate<[K, V]>): number;

  filterValues(predicate: Predicate<V>): number;

  partitions(): IterableIterator<[K, Collection<V>]>;

  partitionIterator(): FluentIterator<[K, Collection<V>]>;

  clone(): MultiMap<K, V>;
}
