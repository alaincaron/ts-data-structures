import { Count, MapBasedMultiSet } from './map_based_multi_set';
import { SortedMap, SortedMapOptions } from '../maps';

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

  firstEntry() {
    const e = this.delegate().firstEntry();
    return e && { key: e.key, value: e.value.count };
  }

  lastEntry() {
    const e = this.delegate().lastEntry();
    return e && { key: e.key, value: e.value.count };
  }

  firstKey() {
    return this.delegate().firstKey();
  }

  lastKey() {
    return this.delegate().lastKey();
  }
}
