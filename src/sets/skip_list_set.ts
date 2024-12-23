import { MapBasedSet } from './map_based_set';
import { NavigableMapBasedSet } from './navigable_map_based_set';
import { CollectionInitializer } from '../collections';
import { SkipListMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class SkipListSet<E> extends NavigableMapBasedSet<E, SkipListMap<E, boolean>, SortedMapOptions<E>> {
  constructor(options?: SortedMapOptions<E>) {
    super(SkipListMap, options);
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & CollectionInitializer<E>>): SkipListSet<E> {
    return MapBasedSet.createSet<E, SkipListMap<E, boolean>, SortedMapOptions<E>, SkipListSet<E>>(
      SkipListSet,
      initializer
    );
  }

  clone(): SkipListSet<E> {
    return MapBasedSet.createSet<E, SkipListMap<E, boolean>, SortedMapOptions<E>, SkipListSet<E>>(SkipListSet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
