import { MapBasedMultiMap, MapBasedMultiMapOptions } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { HashMap, HashMapOptions } from '../maps';

export class HashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | (HashMapOptions & MapBasedMultiMapOptions<V>)) {
    super(new HashMap(options), options);
  }

  static create<K, V>(
    initializer?: number | (HashMapOptions & MapBasedMultiMapOptions<V> & MultiMapInitializer<K, V>)
  ): HashMultiMap<K, V> {
    return buildMultiMap<K, V, HashMultiMap<K, V>>(HashMultiMap, initializer);
  }

  clone(): HashMultiMap<K, V> {
    return HashMultiMap.create({ initial: this });
  }
}
