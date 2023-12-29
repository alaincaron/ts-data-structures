import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { AvlTreeMap, SortedMapOptions } from '../maps';

export class AvlTreeMultiSet<E> extends MapBasedMultiSet<E> {
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
