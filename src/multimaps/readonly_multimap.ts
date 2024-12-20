import { FluentIterator } from 'ts-fluent-iterators';
import { ReadOnlyCollection } from '../collections';
import { MapLike } from '../maps';
import { Container } from '../utils';

export type MultiMapLike<K, V> = MapLike<K, V>;

export interface ReadOnlyMultiMap<K, V> extends Container, Iterable<[K, V]> {
  getValues(k: K): ReadOnlyCollection<V> | undefined;

  containsKey(key: K): boolean;

  containsValue(value: V): boolean;

  containsEntry(key: K, value: V): boolean;

  keys(): IterableIterator<K>;

  values(): IterableIterator<V>;

  entries(): IterableIterator<[K, V]>;

  partitions(): IterableIterator<[K, ReadOnlyCollection<V>]>;

  keyIterator(): FluentIterator<K>;

  valueIterator(): FluentIterator<V>;

  partitionIterator(): FluentIterator<[K, ReadOnlyCollection<V>]>;

  entryIterator(): FluentIterator<[K, V]>;

  toJSON(): string;

  clone(): ReadOnlyMultiMap<K, V>;

  hashCode(): number;

  equals(other: unknown): boolean;
}
