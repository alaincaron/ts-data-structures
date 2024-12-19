import { FluentIterator } from 'ts-fluent-iterators';
import { Container } from '../utils';

export interface ReadOnlyMapEntry<K, V> {
  get key(): K;
  get value(): V;
}

export interface ReadOnlyMap<K, V> extends Container, Iterable<[K, V]> {
  get(key: K): V | undefined;

  containsKey(key: K): boolean;

  containsValue(value: V): boolean;

  keys(): IterableIterator<K>;

  values(): IterableIterator<V>;

  [Symbol.iterator](): Iterator<[K, V]>;

  keyIterator(): FluentIterator<K>;

  valueIterator(): FluentIterator<V>;

  entryIterator(): FluentIterator<ReadOnlyMapEntry<K, V>>;

  entries(): IterableIterator<[K, V]>;

  toMap(): Map<K, V>;

  toJSON(): string;

  hashCode(): number;

  equals(other: unknown): boolean;
}
