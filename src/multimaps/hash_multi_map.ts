import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { HashMap } from '../maps';

export class HashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | MapBasedMultiMapOptions<V>) {
    super(HashMap, options);
  }

  static create<K, V>(
    initializer?: number | (MapBasedMultiMapOptions<V> & MultiMapInitializer<K, V>)
  ): HashMultiMap<K, V> {
    return buildMultiMap<K, V, HashMultiMap<K, V>, MapBasedMultiMapOptions<V>>(HashMultiMap, initializer);
  }

  clone(): HashMultiMap<K, V> {
    return HashMultiMap.create({ initial: this });
  }
}
