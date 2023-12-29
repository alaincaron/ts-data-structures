import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { HashMapOptions, OpenHashMap } from '../maps';

export class OpenHashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | (HashMapOptions & MapBasedMultiMapOptions<V>)) {
    super(new OpenHashMap(options), options);
  }

  static create<K, V>(
    initializer?: number | (HashMapOptions & MapBasedMultiMapOptions<V> & MultiMapInitializer<K, V>)
  ): OpenHashMultiMap<K, V> {
    return buildMultiMap<K, V, OpenHashMultiMap<K, V>>(OpenHashMultiMap, initializer);
  }

  clone(): OpenHashMultiMap<K, V> {
    return OpenHashMultiMap.create({ initial: this });
  }
}
