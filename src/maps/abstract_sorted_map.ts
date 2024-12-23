import { Comparator, Comparators, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { AbstractMap } from './abstract_map';
import { MutableMapEntry } from './mutable_map';
import { SortedMap } from './sorted_map';

export interface SortedMapOptions<K> {
  comparator?: Comparator<K>;
}

export abstract class AbstractSortedMap<K, V> extends AbstractMap<K, V> implements SortedMap<K, V> {
  public readonly comparator: Comparator<K>;

  protected constructor(options?: SortedMapOptions<K>) {
    super();
    this.comparator = options?.comparator ?? Comparators.natural;
  }

  firstEntry(): MutableMapEntry<K, V> | undefined {
    return this.entryIterator()?.first();
  }

  lastEntry(): MutableMapEntry<K, V> | undefined {
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

  abstract reverseEntryIterator(): FluentIterator<MutableMapEntry<K, V>>;
  abstract clear(): AbstractSortedMap<K, V>;
  abstract clone(): AbstractSortedMap<K, V>;

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
