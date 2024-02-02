import { Comparator, Comparators, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { IMap, MapEntry } from './map';
import { CapacityMixin, ContainerOptions } from '../utils';

export interface SortedMapOptions<K> extends ContainerOptions {
  comparator?: Comparator<K>;
}

export abstract class SortedMap<K, V> extends IMap<K, V> {
  public readonly comparator: Comparator<K>;

  constructor(options?: number | SortedMapOptions<K>) {
    super(options);
    this.comparator = (options as any)?.comparator ?? Comparators.defaultComparator;
  }

  abstract firstEntry(): MapEntry<K, V> | undefined;
  abstract lastEntry(): MapEntry<K, V> | undefined;

  firstKey() {
    return this.firstEntry()?.key;
  }

  lastKey() {
    return this.lastEntry()?.key;
  }

  filterEntries(predicate: Predicate<[K, V]>): number {
    const partitions = new FluentIterator(this.entries()).groupBy(predicate);
    const entriesToKeep = partitions.get(true) ?? [];
    const entriesToDelete = partitions.get(false) ?? [];
    if (entriesToKeep.length < entriesToKeep.length) {
      const originalSize = this.size();
      this.clear();
      this.putAll(entriesToKeep);
      return originalSize - entriesToKeep.length;
    } else {
      for (const [k, _v] of entriesToDelete) {
        this.remove(k);
      }
      return entriesToDelete.length;
    }
  }

  buildOptions(): SortedMapOptions<K> {
    return {
      ...super.buildOptions(),
      comparator: this.comparator,
    };
  }

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

  abstract clone(): SortedMap<K, V>;
}

export const BoundedSortedMap = CapacityMixin(SortedMap);
