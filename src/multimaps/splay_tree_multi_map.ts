import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { NavigableMultiMap } from './navigable_multi_map';
import { SortedMultiMapOptions } from './sorted_multi_map';
import { SplayTreeMap } from '../maps';
import { WithCapacity } from '../utils';

export class SplayTreeMultiMap<K, V> extends NavigableMultiMap<K, V> {
  constructor(options?: SortedMultiMapOptions<K, V>) {
    super(new SplayTreeMap(options), options?.collectionFactory);
  }

  static create<K, V>(
    initializer?: WithCapacity<SortedMultiMapOptions<K, V> & MultiMapInitializer<K, V>>
  ): SplayTreeMultiMap<K, V> {
    return buildMultiMap<K, V, SplayTreeMultiMap<K, V>>(SplayTreeMultiMap, initializer);
  }

  clone(): SplayTreeMultiMap<K, V> {
    return SplayTreeMultiMap.create({ initial: this });
  }
}
