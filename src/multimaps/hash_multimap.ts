import { buildMultiMap, MultiMapInitializer } from './abstract_multimap';
import { MapBasedMultiMap, WithCollectionFactory } from './map_based_multimap';
import { HashMap, HashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export type HashMultiMapOptions<V> = WithCollectionFactory<HashMapOptions, V>;

export class HashMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: HashMultiMapOptions<V>) {
    super(new HashMap(options), options?.collectionFactory);
  }

  static create<K, V>(
    initializer?: WithCapacity<HashMultiMapOptions<V> & MultiMapInitializer<K, V>>
  ): HashMultiMap<K, V> {
    return buildMultiMap<K, V, HashMultiMap<K, V>>(HashMultiMap, initializer);
  }

  clone(): HashMultiMap<K, V> {
    return HashMultiMap.create({ initial: this });
  }
}
