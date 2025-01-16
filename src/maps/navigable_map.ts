import { FluentIterator } from 'ts-fluent-iterators';
import { MapEntry, MutableMap, MutableMapEntry } from './mutable_map';
import { SortedMap } from './sorted_map';

export interface NavigableMap<K, V> extends SortedMap<K, V> {
  lowerKey(key: K): K | undefined;

  lowerEntry(key: K): MapEntry<K, V> | undefined;

  higherKey(key: K): K | undefined;

  higherEntry(key: K): MapEntry<K, V> | undefined;

  floorEntry(key: K): MapEntry<K, V> | undefined;

  floorKey(key: K): K | undefined;

  ceilingKey(key: K): K | undefined;

  ceilingEntry(key: K): MutableMapEntry<K, V> | undefined;

  clone(): NavigableMap<K, V>;
}

export interface MutableNavigableMap<K, V> extends NavigableMap<K, V>, MutableMap<K, V> {
  getEntry(key: K): MutableMapEntry<K, V> | undefined;
  entryIterator(): FluentIterator<MutableMapEntry<K, V>>;
  reverseEntryIterator(): FluentIterator<MutableMapEntry<K, V>>;
  pollFirstEntry(): MutableMapEntry<K, V> | undefined;
  pollLastEntry(): MutableMapEntry<K, V> | undefined;

  clone(): MutableNavigableMap<K, V>;

  clear(): MutableNavigableMap<K, V>;
}
