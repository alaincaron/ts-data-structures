import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { HashMapOptions, LinkedHashMap } from '../maps';

export class LinkedHashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | (HashMapOptions & MapBasedMultiMapOptions<V>)) {
    super(new LinkedHashMap(options), options);
  }

  static create<K, V>(
    initializer?: number | (HashMapOptions & MapBasedMultiMapOptions<V> & MultiMapInitializer<K, V>)
  ): LinkedHashMultiMap<K, V> {
    return buildMultiMap<K, V, LinkedHashMultiMap<K, V>>(LinkedHashMultiMap, initializer);
  }

  clone(): LinkedHashMultiMap<K, V> {
    return LinkedHashMultiMap.create({ initial: this });
  }
}
