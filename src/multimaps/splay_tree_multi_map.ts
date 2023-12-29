import { MapBasedMultiMap } from './map_based_multi_map';
import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { SortedMultiMapOptions } from './sorted_multi_map';
import { SplayTreeMap } from '../maps';

export class SplayTreeMultiMap<K, V> extends MapBasedMultiMap<K, V> {
  constructor(options?: number | SortedMultiMapOptions<K, V>) {
    super(SplayTreeMap, options);
  }

  static create<K, V>(
    initializer?: number | (SortedMultiMapOptions<K, V> & MultiMapInitializer<K, V>)
  ): SplayTreeMultiMap<K, V> {
    return buildMultiMap<K, V, SplayTreeMultiMap<K, V>, SortedMultiMapOptions<K, V>>(SplayTreeMultiMap, initializer);
  }

  clone(): SplayTreeMultiMap<K, V> {
    return SplayTreeMultiMap.create({ initial: this });
  }
}
