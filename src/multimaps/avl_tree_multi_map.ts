import { buildMultiMap, MultiMapInitializer } from './multi_map';
import { NavigableMultiMap } from './navigable_multi_map';
import { SortedMultiMapOptions } from './sorted_multi_map';
import { AvlTreeMap } from '../maps';

export class AvlTreeMultiMap<K, V> extends NavigableMultiMap<K, V> {
  constructor(options?: number | SortedMultiMapOptions<K, V>) {
    super(AvlTreeMap, options);
  }

  static create<K, V>(
    initializer?: number | (SortedMultiMapOptions<K, V> & MultiMapInitializer<K, V>)
  ): AvlTreeMultiMap<K, V> {
    return buildMultiMap<K, V, AvlTreeMultiMap<K, V>, SortedMultiMapOptions<K, V>>(AvlTreeMultiMap, initializer);
  }

  clone(): AvlTreeMultiMap<K, V> {
    return AvlTreeMultiMap.create({ initial: this });
  }
}
