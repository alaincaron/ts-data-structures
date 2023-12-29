import { FluentIterator } from 'ts-fluent-iterators';
import { MapEntry } from './map';
import { SortedMap, SortedMapOptions } from './sorted_map';
import { CapacityMixin } from '../utils';

export abstract class NavigableMap<K, V> extends SortedMap<K, V> {
  constructor(options?: number | SortedMapOptions<K>) {
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

  abstract reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;

  reverseKeyIterator() {
    return this.reverseEntryIterator().map(e => e.key);
  }

  reverseValueIterator() {
    return this.reverseEntryIterator().map(e => e.value);
  }

  *reverseEntries(): IterableIterator<[K, V]> {
    for (const e of this.reverseEntryIterator()) yield [e.key, e.value];
  }

  abstract clone(): NavigableMap<K, V>;
}

export const BoundedNavigableMap = CapacityMixin(NavigableMap);
