import { FluentIterator } from 'ts-fluent-iterators';
import { MultiMap } from './multimap';
import { MutableMultiMap } from './mutable_multimap';
import { Collection, MutableCollection } from '../collections';
import { MapEntry, MutableMapEntry } from '../maps';

export interface SortedMultiMap<K, V> extends MultiMap<K, V> {
  firstEntry(): MapEntry<K, Collection<V>> | undefined;

  lastEntry(): MapEntry<K, Collection<V>> | undefined;

  reverseEntryIterator(): FluentIterator<MapEntry<K, Collection<V>>>;

  reverseKeyIterator(): FluentIterator<K>;

  reverseValueIterator(): FluentIterator<V>;

  clone(): SortedMultiMap<K, V>;
}

export interface MutableSortedMultiMap<K, V> extends SortedMultiMap<K, V>, MutableMultiMap<K, V> {
  getValues(k: K): MutableCollection<V> | undefined;

  firstEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  lastEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, MutableCollection<V>>>;

  partitions(): IterableIterator<[K, MutableCollection<V>]>;

  partitionIterator(): FluentIterator<[K, MutableCollection<V>]>;

  clear(): MutableSortedMultiMap<K, V>;

  clone(): MutableSortedMultiMap<K, V>;
}
