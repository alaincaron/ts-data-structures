import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { NavigableMultiSet } from './navigable_multi_set';
import { SortedMapOptions, SplayTreeMap } from '../maps';
import { WithCapacity } from '../utils';

export class SplayTreeMultiSet<E> extends NavigableMultiSet<E> {
  constructor(options?: SortedMapOptions<E>) {
    super(new SplayTreeMap(options));
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & MultiSetInitializer<E>>): SplayTreeMultiSet<E> {
    return buildMultiSet<E, SplayTreeMultiSet<E>, SortedMapOptions<E>>(SplayTreeMultiSet, initializer);
  }

  clone(): SplayTreeMultiSet<E> {
    return SplayTreeMultiSet.create({ initial: this });
  }
}
