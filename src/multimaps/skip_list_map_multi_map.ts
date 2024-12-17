import { buildMultiMap, MultiMapInitializer } from './abstract_multi_map';
import { AbstractNavigableMultiMap } from './abstract_navigable_multi_map';
import { SortedMultiMapOptions } from './abstract_sorted_multi_map';
import { SkipListMap } from '../maps';
import { WithCapacity } from '../utils';

export class SkipListMultiMap<K, V> extends AbstractNavigableMultiMap<K, V> {
  constructor(options?: SortedMultiMapOptions<K, V>) {
    super(new SkipListMap(options), options?.collectionFactory);
  }

  static create<K, V>(
    initializer?: WithCapacity<SortedMultiMapOptions<K, V> & MultiMapInitializer<K, V>>
  ): SkipListMultiMap<K, V> {
    return buildMultiMap<K, V, SkipListMultiMap<K, V>>(SkipListMultiMap, initializer);
  }

  clone(): SkipListMultiMap<K, V> {
    return SkipListMultiMap.create({ initial: this });
  }
}
