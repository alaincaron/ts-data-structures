import { FluentIterator } from 'ts-fluent-iterators';
import { MapEntry } from './map';
import { SortedMap, SortedMapOptions } from './sorted_map';
import { CapacityMixin } from '../utils';

export abstract class NavigableMap<K, V> extends SortedMap<K, V> {
  constructor(options?: number | SortedMapOptions<K>) {
    super(options);
  }

  lowerKey(key: K) {
    const e = this.lowerEntry(key);
    return e?.key;
  }

  abstract lowerEntry(k: K): MapEntry<K, V> | undefined;

  higherKey(key: K) {
    const e = this.higherEntry(key);
    return e?.key;
  }

  abstract higherEntry(k: K): MapEntry<K, V> | undefined;

  abstract floorEntry(k: K): MapEntry<K, V> | undefined;

  floorKey(key: K) {
    const e = this.floorEntry(key);
    return e?.key;
  }

  ceilingKey(key: K) {
    const e = this.ceilingEntry(key);
    return e?.key;
  }

  abstract ceilingEntry(k: K): MapEntry<K, V> | undefined;

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
