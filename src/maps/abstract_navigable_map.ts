import { AbstractSortedMap, SortedMapOptions } from './abstract_sorted_map';
import { MutableMapEntry } from './mutable_map';
import { NavigableMap } from './navigable_map';

export abstract class AbstractNavigableMap<K, V> extends AbstractSortedMap<K, V> implements NavigableMap<K, V> {
  protected constructor(options?: SortedMapOptions<K>) {
    super(options);
  }

  lowerKey(key: K) {
    return this.lowerEntry(key)?.key;
  }

  abstract lowerEntry(key: K): MutableMapEntry<K, V> | undefined;

  higherKey(key: K) {
    const e = this.higherEntry(key);
    return e?.key;
  }

  abstract higherEntry(key: K): MutableMapEntry<K, V> | undefined;

  abstract floorEntry(key: K): MutableMapEntry<K, V> | undefined;

  floorKey(key: K) {
    return this.floorEntry(key)?.key;
  }

  ceilingKey(key: K) {
    return this.ceilingEntry(key)?.key;
  }

  abstract ceilingEntry(key: K): MutableMapEntry<K, V> | undefined;

  abstract pollFirstEntry(): MutableMapEntry<K, V> | undefined;
  abstract pollLastEntry(): MutableMapEntry<K, V> | undefined;

  abstract clone(): AbstractNavigableMap<K, V>;
  abstract clear(): AbstractNavigableMap<K, V>;
}
