import { FluentIterator } from 'ts-fluent-iterators';
import { MapEntry } from './map';
import { SortedMap } from './sorted_map';

export interface NavigableMap<K, V> extends SortedMap<K, V> {
  floorKey(k: K): K | undefined;
  floorEntry(k: K): MapEntry<K, V> | undefined;

  ceilingKey(k: K): K | undefined;
  ceilingEntry(k: K): MapEntry<K, V> | undefined;

  lowerKey(k: K): K | undefined;
  lowerEntry(k: K): MapEntry<K, V> | undefined;

  higherKey(k: K): K | undefined;
  higherEntry(k: K): MapEntry<K, V> | undefined;

  pollFirstEntry(): MapEntry<K, V> | undefined;
  pollLastEntry(): MapEntry<K, V> | undefined;

  reverseKeyIterator(): FluentIterator<K>;
  reverseValueIterator(): FluentIterator<V>;
  reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;
  reverseEntries(): IterableIterator<[K, V]>;
}
