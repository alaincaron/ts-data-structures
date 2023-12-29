import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { NavigableMultiMap } from './navigable_multi_map';
import { SortedMultiMapOptions } from './sorted_multi_map';
import { SplayTreeMap } from '../maps';

export class SplayTreeMultiMap<K, V> extends NavigableMultiMap<K, V> {
  constructor(options?: number | SortedMultiMapOptions<K, V>) {
    super(new SplayTreeMap(options), options);
  }

  static create<K, V>(
    initializer?: number | (SortedMultiMapOptions<K, V> & MultiMapInitializer<K, V>)
  ): SplayTreeMultiMap<K, V> {
    return buildMultiMap<K, V, SplayTreeMultiMap<K, V>>(SplayTreeMultiMap, initializer);
  }

  clone(): SplayTreeMultiMap<K, V> {
    return SplayTreeMultiMap.create({ initial: this });
  }
}
