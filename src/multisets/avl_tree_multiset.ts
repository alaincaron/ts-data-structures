import { buildMultiSet, MultiSetInitializer } from './abstract_multiset';
import { AbstractNavigableMultiSet } from './abstract_navigable_multiset';
import { AvlTreeMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class AvlTreeMultiSet<E> extends AbstractNavigableMultiSet<E, AvlTreeMap<E, number>> {
  constructor(options?: SortedMapOptions<E>) {
    super(AvlTreeMap, options);
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & MultiSetInitializer<E>>): AvlTreeMultiSet<E> {
    return buildMultiSet<E, AvlTreeMultiSet<E>, SortedMapOptions<E>>(AvlTreeMultiSet, initializer);
  }

  clone(): AvlTreeMultiSet<E> {
    return AvlTreeMultiSet.create({ initial: this });
  }
}
