import { FluentIterator } from 'ts-fluent-iterators';
import { Count, MapBasedMultiSet } from './map_based_multiset';
import { SortedMultiSet } from './sorted_multiset';
import { MapEntry, SortedMap } from '../maps';

export abstract class AbstractSortedMultiSet<E> extends MapBasedMultiSet<E> implements SortedMultiSet<E> {
  protected constructor(mapFactory: SortedMap<E, Count> | (new () => SortedMap<E, Count>)) {
    super(mapFactory);
  }

  protected delegate() {
    return this.map as SortedMap<E, Count>;
  }

  firstEntry(): MapEntry<E, number> | undefined {
    const e = this.delegate().firstEntry();
    return e && { key: e.key, value: e.value.count };
  }

  lastEntry(): MapEntry<E, number> | undefined {
    const e = this.delegate().lastEntry();
    return e && { key: e.key, value: e.value.count };
  }

  first(): E | undefined {
    return this.delegate().firstKey();
  }

  last(): E | undefined {
    return this.delegate().lastKey();
  }

  reverseEntryIterator(): FluentIterator<MapEntry<E, number>> {
    return this.delegate()
      .reverseEntryIterator()
      .map(e => ({ key: e.key, value: e.value.count }));
  }

  reverseIterator(): FluentIterator<E> {
    return this.delegate().reverseKeyIterator();
  }

  abstract clone(): AbstractSortedMultiSet<E>;
}
