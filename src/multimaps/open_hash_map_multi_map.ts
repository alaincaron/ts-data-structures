import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { OpenHashMap } from '../maps';

export class OpenHashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | MapBasedMultiMapOptions<V>) {
    super(OpenHashMap, options);
  }

  static create<K, V>(
    initializer?: number | (MapBasedMultiMapOptions<V> & MultiMapInitializer<K, V>)
  ): OpenHashMultiMap<K, V> {
    return buildMultiMap<K, V, OpenHashMultiMap<K, V>, MapBasedMultiMapOptions<V>>(OpenHashMultiMap, initializer);
  }

  clone(): OpenHashMultiMap<K, V> {
    return OpenHashMultiMap.create({ initial: this });
  }
}
