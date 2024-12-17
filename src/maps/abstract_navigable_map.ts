import { AbstractSortedMap, SortedMapOptions } from './abstract_sorted_map';
import { MapEntry } from './map_interface';
import { NavigableMap } from './navigable_map';

export abstract class AbstractNavigableMap<K, V> extends AbstractSortedMap<K, V> implements NavigableMap<K, V> {
  protected constructor(options?: SortedMapOptions<K>) {
    super(options);
  }

  lowerKey(key: K) {
    return this.lowerEntry(key)?.key;
  }

  abstract lowerEntry(key: K): MapEntry<K, V> | undefined;

  higherKey(key: K) {
    const e = this.higherEntry(key);
    return e?.key;
  }

  abstract higherEntry(key: K): MapEntry<K, V> | undefined;

  abstract floorEntry(key: K): MapEntry<K, V> | undefined;

  floorKey(key: K) {
    return this.floorEntry(key)?.key;
  }

  ceilingKey(key: K) {
    return this.ceilingEntry(key)?.key;
  }

  abstract ceilingEntry(key: K): MapEntry<K, V> | undefined;

  abstract pollFirstEntry(): MapEntry<K, V> | undefined;
  abstract pollLastEntry(): MapEntry<K, V> | undefined;

  abstract clone(): AbstractNavigableMap<K, V>;
  abstract clear(): AbstractNavigableMap<K, V>;
}
