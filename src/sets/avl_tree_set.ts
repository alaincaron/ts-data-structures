import { MapBasedSet } from './map_based_set';
import { NavigableMapBasedSet } from './navigable_map_based_set';
import { CollectionInitializer } from '../collections';
import { AvlTreeMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class AvlTreeSet<E> extends NavigableMapBasedSet<E, AvlTreeMap<E, boolean>, SortedMapOptions<E>> {
  constructor(options?: SortedMapOptions<E>) {
    super(AvlTreeMap, options);
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & CollectionInitializer<E>>): AvlTreeSet<E> {
    return MapBasedSet.createSet<E, AvlTreeMap<E, boolean>, SortedMapOptions<E>, AvlTreeSet<E>>(
      AvlTreeSet,
      initializer
    );
  }

  clone(): AvlTreeSet<E> {
    return MapBasedSet.createSet<E, AvlTreeMap<E, boolean>, SortedMapOptions<E>, AvlTreeSet<E>>(AvlTreeSet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
