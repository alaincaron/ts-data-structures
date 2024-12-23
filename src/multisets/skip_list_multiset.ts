import { buildMultiSet, MultiSetInitializer } from './abstract_multiset';
import { AbstractNavigableMultiSet } from './abstract_navigable_multiset';
import { SkipListMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class SkipListMultiSet<E> extends AbstractNavigableMultiSet<E, SkipListMap<E, number>> {
  constructor(options?: SortedMapOptions<E>) {
    super(SkipListMap, options);
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & MultiSetInitializer<E>>): SkipListMultiSet<E> {
    return buildMultiSet<E, SkipListMultiSet<E>, SortedMapOptions<E>>(SkipListMultiSet, initializer);
  }

  clone(): SkipListMultiSet<E> {
    return SkipListMultiSet.create({ initial: this });
  }
}
