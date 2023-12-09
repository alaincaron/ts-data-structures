import { Comparator, FluentIterator, Functions, Predicate } from 'ts-fluent-iterators';
import { AbstractMap } from './abstract_map';
import { MapEntry } from './map';
import { SortedMap, SortedMapOptions } from './sorted_map';
import { CapacityMixin } from '../utils';

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

  abstract clone(): AbstractSortedMap<K, V>;
}

export const BoundedSortedMap = CapacityMixin(AbstractSortedMap);
