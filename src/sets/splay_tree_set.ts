import { MapBasedSet } from './map_based_set';
import { NavigableMapBasedSet } from './navigable_map_based_set';
import { CollectionInitializer } from '../collections';
import { SortedMapOptions, SplayTreeMap } from '../maps';
import { WithCapacity } from '../utils';

export class SplayTreeSet<E> extends NavigableMapBasedSet<E, SplayTreeMap<E, boolean>, SortedMapOptions<E>> {
  constructor(options?: SortedMapOptions<E>) {
    super(SplayTreeMap, options);
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & CollectionInitializer<E>>): SplayTreeSet<E> {
    return MapBasedSet.createSet<E, SplayTreeMap<E, boolean>, SortedMapOptions<E>, SplayTreeSet<E>>(
      SplayTreeSet,
      initializer
    );
  }

  clone(): SplayTreeSet<E> {
    return MapBasedSet.createSet<E, SplayTreeMap<E, boolean>, SortedMapOptions<E>, SplayTreeSet<E>>(SplayTreeSet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
