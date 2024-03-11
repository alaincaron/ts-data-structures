import { MapBasedSet } from './map_based_set';
import { NavigableMapBasedSet } from './navigable_map_based_set';
import { CollectionInitializer } from '../collections';
import { AvlTreeMap, SortedMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class AvlTreeSet<E> extends NavigableMapBasedSet<E> {
  constructor(delegate?: AvlTreeMap<E, boolean>) {
    super(delegate ?? new AvlTreeMap());
  }

  static create<E>(initializer?: WithCapacity<SortedMapOptions<E> & CollectionInitializer<E>>): AvlTreeSet<E> {
    return MapBasedSet.createSet<E, AvlTreeMap<E, boolean>, AvlTreeSet<E>>(AvlTreeSet, AvlTreeMap.create, initializer);
  }

  clone(): AvlTreeSet<E> {
    return new AvlTreeSet(this.cloneDelegate<AvlTreeMap<E, boolean>>(AvlTreeMap));
  }
}
