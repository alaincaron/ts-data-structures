import { Comparator, FluentIterator, Functions, Predicate } from 'ts-fluent-iterators';
import { AbstractMap } from './abstract_map';
import { MapEntry } from './map';
import { SortedMap, SortedMapOptions } from './sorted_map';

export abstract class AbstractSortedMap<K, V> extends AbstractMap<K, V> implements SortedMap<K, V> {
  public readonly comparator: Comparator<K>;

  constructor(options?: number | SortedMapOptions<K>) {
    super(options);
    this.comparator = (options as any)?.comparator ?? Functions.defaultComparator;
  }

  abstract firstEntry(): MapEntry<K, V> | undefined;
  abstract lastEntry(): MapEntry<K, V> | undefined;

  firstKey() {
    const e = this.firstEntry();
    return e?.key;
  }

  lastKey() {
    const e = this.lastEntry();
    return e?.key;
  }

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

  filterEntries(predicate: Predicate<[K, V]>): number {
    const entriesToKeep = new FluentIterator(this.entries()).filter(predicate).collect();
    const originalSize = this.size();
    this.clear();
    this.putAll(entriesToKeep);
    return originalSize - entriesToKeep.length;
  }

  buildOptions(): SortedMapOptions<K> {
    return {
      ...super.buildOptions(),
      comparator: this.comparator,
    };
  }

  abstract clone(): AbstractSortedMap<K, V>;
}
