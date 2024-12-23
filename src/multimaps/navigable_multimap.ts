import { SortedMultiMap } from './sorted_multimap';
import { MutableCollection } from '../collections';
import { MutableMapEntry } from '../maps';

export interface NavigableMultiMap<K, V> extends SortedMultiMap<K, V> {
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

  clone(): NavigableMultiMap<K, V>;
  clear(): NavigableMultiMap<K, V>;
}
