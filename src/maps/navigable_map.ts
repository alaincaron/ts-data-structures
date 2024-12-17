import { MapEntry } from './map_interface';
import { SortedMap } from './sorted_map';

export interface NavigableMap<K, V> extends SortedMap<K, V> {
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

  clone(): NavigableMap<K, V>;

  clear(): NavigableMap<K, V>;
}
