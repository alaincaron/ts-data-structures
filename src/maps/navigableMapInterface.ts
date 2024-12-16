import { MapEntry } from './map_interface';
import { SortedMapInterface } from './sortedMapInterface';

export interface NavigableMapInterface<K, V> extends SortedMapInterface<K, V> {
  lowerKey(key: K): K | undefined;

  lowerEntry(key: K): MapEntry<K, V> | undefined;

  higherKey(key: K): K | undefined;

  higherEntry(key: K): MapEntry<K, V> | undefined;

  floorEntry(key: K): MapEntry<K, V> | undefined;

  floorKey(key: K): K | undefined;

  ceilingKey(key: K): K | undefined;

  ceilingEntry(key: K): MapEntry<K, V> | undefined;

  pollFirstEntry(): MapEntry<K, V> | undefined;
  pollLastEntry(): MapEntry<K, V> | undefined;

  clone(): NavigableMapInterface<K, V>;

  clear(): NavigableMapInterface<K, V>;
}
