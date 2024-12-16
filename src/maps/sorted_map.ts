import { Comparator, Comparators, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { IMap } from './map';
import { MapEntry } from './map_interface';
import { SortedMapInterface } from './sortedMapInterface';

export interface SortedMapOptions<K> {
  comparator?: Comparator<K>;
}

export abstract class SortedMap<K, V> extends IMap<K, V> implements SortedMapInterface<K, V> {
  public readonly comparator: Comparator<K>;

  protected constructor(options?: SortedMapOptions<K>) {
    super();
    this.comparator = options?.comparator ?? Comparators.natural;
  }

  firstEntry(): MapEntry<K, V> | undefined {
    return this.entryIterator()?.first();
  }

  lastEntry(): MapEntry<K, V> | undefined {
    return this.reverseEntryIterator()?.first();
  }

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

  buildOptions() {
    return {
      ...super.buildOptions(),
      comparator: this.comparator,
    };
  }

  abstract reverseEntryIterator(): FluentIterator<MapEntry<K, V>>;
  abstract clear(): SortedMap<K, V>;
  abstract clone(): SortedMap<K, V>;

  reverseKeyIterator() {
    return this.reverseEntryIterator().map(e => e.key);
  }

  reverseValueIterator() {
    return this.reverseEntryIterator().map(e => e.value);
  }

  *reverseEntries(): IterableIterator<[K, V]> {
    for (const e of this.reverseEntryIterator()) yield [e.key, e.value];
  }
}
