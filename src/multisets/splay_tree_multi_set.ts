import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { SortedMapOptions, SplayTreeMap } from '../maps';

export class SplayTreeMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new SplayTreeMap(options), options);
  }

  static create<E>(initializer?: number | (SortedMapOptions<E> & MultiSetInitializer<E>)): SplayTreeMultiSet<E> {
    return buildMultiSet<E, SplayTreeMultiSet<E>>(SplayTreeMultiSet, initializer);
  }

  clone(): SplayTreeMultiSet<E> {
    return SplayTreeMultiSet.create({ initial: this });
  }
}
