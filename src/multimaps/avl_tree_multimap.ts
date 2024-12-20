import { buildMultiMap, MultiMapInitializer } from './abstract_multimap';
import { AbstractNavigableMultiMap } from './abstract_navigable_multimap';
import { SortedMultiMapOptions } from './abstract_sorted_multimap';
import { AvlTreeMap } from '../maps';
import { WithCapacity } from '../utils';

export class AvlTreeMultiMap<K, V> extends AbstractNavigableMultiMap<K, V> {
  constructor(options?: SortedMultiMapOptions<K, V>) {
    super(new AvlTreeMap(options), options?.collectionFactory);
  }

  static create<K, V>(
    initializer?: WithCapacity<SortedMultiMapOptions<K, V> & MultiMapInitializer<K, V>>
  ): AvlTreeMultiMap<K, V> {
    return buildMultiMap<K, V, AvlTreeMultiMap<K, V>>(AvlTreeMultiMap, initializer);
  }

  clone(): AvlTreeMultiMap<K, V> {
    return AvlTreeMultiMap.create({ initial: this });
  }
}
