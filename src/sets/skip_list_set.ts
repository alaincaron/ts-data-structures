import { MapBasedSet } from './map_based_set';
import { NavigableMapBasedSet } from './navigable_map_based_set';
import { CollectionInitializer } from '../collections';
import { SkipListMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class SkipListSet<E> extends NavigableMapBasedSet<E> {
  constructor(delegate?: SkipListMap<E, boolean>) {
    super(delegate ?? new SkipListMap());
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & CollectionInitializer<E>>): SkipListSet<E> {
    return MapBasedSet.createSet<E, SkipListMap<E, boolean>, SkipListSet<E>>(
      SkipListSet,
      SkipListMap.create,
      initializer
    );
  }

  clone(): SkipListSet<E> {
    return new SkipListSet(this.cloneDelegate<SkipListMap<E, boolean>>(SkipListMap));
  }
}
