import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';

export class LinkedHashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | (LinkedHashMapOptions & MapBasedMultiMapOptions<V>)) {
    super(new LinkedHashMap(options), options);
  }

  static create<K, V>(
    initializer?: number | (LinkedHashMapOptions & MapBasedMultiMapOptions<V> & MultiMapInitializer<K, V>)
  ): LinkedHashMultiMap<K, V> {
    return buildMultiMap<K, V, LinkedHashMultiMap<K, V>>(LinkedHashMultiMap, initializer);
  }

  clone(): LinkedHashMultiMap<K, V> {
    return LinkedHashMultiMap.create({ initial: this });
  }
}
