import { Count, MapBasedMultiSet } from './map_based_multi_set';
import { MapEntry, SortedMap, SortedMapOptions } from '../maps';

export abstract class SortedMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(
    mapFactory: SortedMap<E, Count> | (new () => SortedMap<E, Count>),
    options?: number | SortedMapOptions<E>
  ) {
    super(mapFactory, options);
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

  abstract clone(): SortedMultiSet<E>;
}
