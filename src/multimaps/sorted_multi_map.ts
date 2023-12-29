import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { Collection } from '../collections';
import { SortedMap, SortedMapOptions } from '../maps';

export type SortedMultiMapOptions<K, V> = SortedMapOptions<K> & MapBasedMultiMapOptions<V>;

export abstract class SortedMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(
    mapFactory: SortedMap<K, Collection<V>> | (new () => SortedMap<K, Collection<V>>),
    options?: number | SortedMultiMapOptions<K, V>
  ) {
    super(mapFactory, options);
  }

  protected delegate() {
    return this.map as SortedMap<K, Collection<V>>;
  }

  firstEntry() {
    const e = this.delegate().firstEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  lastEntry() {
    const e = this.delegate().lastEntry();
    return e && { key: e.key, value: e.value.clone() };
  }

  firstKey() {
    return this.delegate().firstKey();
  }

  lastKey() {
    return this.delegate().lastKey();
  }
}
