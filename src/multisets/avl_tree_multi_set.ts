import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { NavigableMultiSet } from './navigable_multi_set';
import { AvlTreeMap, SortedMapOptions } from '../maps';

export class AvlTreeMultiSet<E> extends NavigableMultiSet<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new AvlTreeMap(options), options);
  }

  static create<E>(initializer?: number | (SortedMapOptions<E> & MultiSetInitializer<E>)): AvlTreeMultiSet<E> {
    return buildMultiSet<E, AvlTreeMultiSet<E>>(AvlTreeMultiSet, initializer);
  }

  clone(): AvlTreeMultiSet<E> {
    return AvlTreeMultiSet.create({ initial: this });
  }
}
