import { buildMultiMap, MultiMapInitializer } from './abstract_multimap';
import { MapBasedMultiMap, WithCollectionFactory } from './map_based_multimap';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export type LinkedHashMultiMapOptions<V> = WithCollectionFactory<LinkedHashMapOptions, V>;

export class LinkedHashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: LinkedHashMultiMapOptions<V>) {
    super(new LinkedHashMap(options), options?.collectionFactory);
  }

  static create<K, V>(
    initializer?: WithCapacity<LinkedHashMultiMapOptions<V> & MultiMapInitializer<K, V>>
  ): LinkedHashMultiMap<K, V> {
    return buildMultiMap<K, V, LinkedHashMultiMap<K, V>>(LinkedHashMultiMap, initializer);
  }

  clone(): LinkedHashMultiMap<K, V> {
    return LinkedHashMultiMap.create({ initial: this });
  }
}
