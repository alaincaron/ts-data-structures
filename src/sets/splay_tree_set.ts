import { MapBasedSet } from './map_based_set';
import { NavigableMapBasedSet } from './navigable_map_based_set';
import { CollectionInitializer } from '../collections';
import { SortedMapOptions, SplayTreeMap } from '../maps';
import { WithCapacity } from '../utils';

export class SplayTreeSet<E> extends NavigableMapBasedSet<E> {
  constructor(delegate?: SplayTreeMap<E, boolean>) {
    super(delegate ?? new SplayTreeMap());
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & CollectionInitializer<E>>): SplayTreeSet<E> {
    return MapBasedSet.createSet<E, SplayTreeMap<E, boolean>, SplayTreeSet<E>>(
      SplayTreeSet,
      SplayTreeMap.create,
      initializer
    );
  }

  clone(): SplayTreeSet<E> {
    return new SplayTreeSet(this.cloneDelegate<SplayTreeMap<E, boolean>>(SplayTreeMap));
  }
}
