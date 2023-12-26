import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { MultiMapLike } from './types';
import { Collection } from '../collections';
import { ContainerOptions } from '../utils';

export interface MultiMap<K, V> extends Iterable<[K, V]> {
  size(): number;
  isEmpty(): boolean;
  capacity(): number;
  isFull(): boolean;
  remaining(): number;

  get(key: K): Collection<V> | undefined;

  offer(key: K, value: V): boolean;
  put(key: K, value: V): boolean;

  containsKey(key: K): boolean;
  containsValue(value: V): boolean;
  containsEntry(key: K, value: V): boolean;

  removeKey(key: K): Collection<V> | undefined;
  removeEntry(key: K, value: V): boolean;

  filterKeys(predicate: Predicate<K>): number;
  filterValues(predicate: Predicate<V>): number;
  filterEntries(predicate: Predicate<[K, V]>): number;

  putAll<K1 extends K, V1 extends V>(map: MultiMapLike<K1, V1>): void;

  clear(): void;

  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
  entries(): IterableIterator<[K, V]>;
  partitions(): IterableIterator<[K, Collection<V>]>;

  keyIterator(): FluentIterator<K>;
  valueIterator(): FluentIterator<V>;
  entryIterator(): FluentIterator<[K, V]>;
  partitionIterator(): FluentIterator<[K, Collection<V>]>;

  toJson(): string;
  buildOptions?(): ContainerOptions;

  hashCode(): number;
  equals(other: any): boolean;

  clone(): MultiMap<K, V>;
}
