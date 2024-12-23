import { MutableMapEntry } from './mutable_map';
import { SortedMap } from './sorted_map';

export interface NavigableMap<K, V> extends SortedMap<K, V> {
  lowerKey(key: K): K | undefined;

  lowerEntry(key: K): MutableMapEntry<K, V> | undefined;

  higherKey(key: K): K | undefined;

  higherEntry(key: K): MutableMapEntry<K, V> | undefined;

  floorEntry(key: K): MutableMapEntry<K, V> | undefined;

  floorKey(key: K): K | undefined;

  ceilingKey(key: K): K | undefined;

  ceilingEntry(key: K): MutableMapEntry<K, V> | undefined;

  pollFirstEntry(): MutableMapEntry<K, V> | undefined;
  pollLastEntry(): MutableMapEntry<K, V> | undefined;

  clone(): NavigableMap<K, V>;

  clear(): NavigableMap<K, V>;
}
