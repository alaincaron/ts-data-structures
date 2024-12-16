import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { MapLike } from '../maps';
import { ContainerInterface } from '../utils';

export type MultiMapLike<K, V> = MapLike<K, V> | MultiMapInterface<K, V>;

export interface MultiMapInterface<K, V> extends ContainerInterface, Iterable<[K, V]> {
  getValues(k: K): Collection<V> | undefined;

  removeEntry(key: K, value: V): boolean;

  removeKey(key: K): Collection<V> | undefined;

  offer(key: K, value: V): boolean;

  put(key: K, value: V): boolean;

  putAll<K1 extends K, V1 extends V>(map: MultiMapLike<K1, V1>): void;

  clear(): MultiMapInterface<K, V>;

  containsKey(key: K): boolean;

  containsValue(value: V): boolean;

  containsEntry(key: K, value: V): boolean;

  filterKeys(predicate: Predicate<K>): number;

  filterEntries(predicate: Predicate<[K, V]>): number;

  filterValues(predicate: Predicate<V>): number;

  keys(): IterableIterator<K>;

  values(): IterableIterator<V>;

  entries(): IterableIterator<[K, V]>;

  partitions(): IterableIterator<[K, Collection<V>]>;

  keyIterator(): FluentIterator<K>;

  valueIterator(): FluentIterator<V>;

  partitionIterator(): FluentIterator<[K, Collection<V>]>;

  entryIterator(): FluentIterator<[K, V]>;

  toJSON(): string;

  clone(): MultiMapInterface<K, V>;

  hashCode(): number;

  equals(other: unknown): boolean;
}
