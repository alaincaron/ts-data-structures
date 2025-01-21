import { FluentIterator } from 'ts-fluent-iterators';
import { MutableSortedMultiMap, SortedMultiMap } from './sorted_multimap';
import { Collection, MutableCollection } from '../collections';
import { MapEntry, MutableMapEntry } from '../maps';

export interface NavigableMultiMap<K, V> extends SortedMultiMap<K, V> {
  lowerKey(key: K): K | undefined;

  lowerEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  higherKey(key: K): K | undefined;
  higherEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  floorKey(key: K): K | undefined;

  floorEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  ceilingKey(key: K): K | undefined;

  ceilingEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  clone(): NavigableMultiMap<K, V>;
}

export interface MutableNavigableMultiMap<K, V> extends MutableSortedMultiMap<K, V>, NavigableMultiMap<K, V> {
  getValues(k: K): MutableCollection<V> | undefined;

  firstEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  lastEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  lowerKey(key: K): K | undefined;
  lowerEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined;

  higherKey(key: K): K | undefined;
  higherEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined;

  floorKey(key: K): K | undefined;

  floorEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined;

  ceilingKey(key: K): K | undefined;

  ceilingEntry(key: K): MutableMapEntry<K, MutableCollection<V>> | undefined;

  pollFirstEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  pollLastEntry(): MutableMapEntry<K, MutableCollection<V>> | undefined;

  partitions(): IterableIterator<[K, MutableCollection<V>]>;

  partitionIterator(): FluentIterator<[K, MutableCollection<V>]>;

  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, MutableCollection<V>>>;

  clone(): MutableNavigableMultiMap<K, V>;
}
