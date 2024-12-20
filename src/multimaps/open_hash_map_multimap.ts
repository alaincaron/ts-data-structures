import { buildMultiMap, MultiMapInitializer } from './abstract_multimap';
import { HashMultiMapOptions } from './hash_multimap';
import { MapBasedMultiMap } from './map_based_multimap';
import { OpenHashMap } from '../maps';
import { WithCapacity } from '../utils';

export class OpenHashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: HashMultiMapOptions<V>) {
    super(new OpenHashMap(options), options?.collectionFactory);
  }

  static create<K, V>(
    initializer?: WithCapacity<HashMultiMapOptions<V> & MultiMapInitializer<K, V>>
  ): OpenHashMultiMap<K, V> {
    return buildMultiMap<K, V, OpenHashMultiMap<K, V>>(OpenHashMultiMap, initializer);
  }

  clone(): OpenHashMultiMap<K, V> {
    return OpenHashMultiMap.create({ initial: this });
  }
}
