import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { SkipListMap, SkipListMapOptions } from '../maps';

export type SkipListMultiMapOptions<K, V> = SkipListMapOptions<K> & MapBasedMultiMapOptions<V>;

export class SkipListMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | SkipListMultiMapOptions<K, V>) {
    super(new SkipListMap(options), options);
  }

  static create<K, V>(
    initializer?: number | (SkipListMultiMapOptions<K, V> & MultiMapInitializer<K, V>)
  ): SkipListMultiMap<K, V> {
    return buildMultiMap<K, V, SkipListMultiMap<K, V>>(SkipListMultiMap, initializer);
  }

  clone(): SkipListMultiMap<K, V> {
    return SkipListMultiMap.create({ initial: this });
  }
}
