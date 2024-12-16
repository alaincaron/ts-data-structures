import { SortedMultiMapInterface } from './sorted_multi_map_interface';
import { Collection } from '../collections';
import { MapEntry } from '../maps';

export interface NavigableMultiMapInterface<K, V> extends SortedMultiMapInterface<K, V> {
  lowerKey(key: K): K | undefined;

  lowerEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  higherKey(key: K): K | undefined;
  higherEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  floorKey(key: K): K | undefined;

  floorEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  ceilingKey(key: K): K | undefined;

  ceilingEntry(key: K): MapEntry<K, Collection<V>> | undefined;

  pollFirstEntry(): MapEntry<K, Collection<V>> | undefined;

  pollLastEntry(): MapEntry<K, Collection<V>> | undefined;

  clone(): NavigableMultiMapInterface<K, V>;
  clear(): NavigableMultiMapInterface<K, V>;
}
