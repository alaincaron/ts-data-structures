import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { NavigableMultiSet } from './navigable_multi_set';
import { AvlTreeMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class AvlTreeMultiSet<E> extends NavigableMultiSet<E> {
  constructor(options?: SortedMapOptions<E>) {
    super(new AvlTreeMap(options));
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & MultiSetInitializer<E>>): AvlTreeMultiSet<E> {
    return buildMultiSet<E, AvlTreeMultiSet<E>, SortedMapOptions<E>>(AvlTreeMultiSet, initializer);
  }

  clone(): AvlTreeMultiSet<E> {
    return AvlTreeMultiSet.create({ initial: this });
  }
}
