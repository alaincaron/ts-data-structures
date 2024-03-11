import { MapBasedSet } from './map_based_set';
import { CollectionInitializer } from '../collections';
import { HashMapOptions, OpenHashMap } from '../maps';
import { WithCapacity } from '../utils';

export class OpenHashSet<E> extends MapBasedSet<E> {
  constructor(delegate?: OpenHashMap<E, boolean>) {
    super(delegate ?? new OpenHashMap());
  }

  static create<E>(initializer?: WithCapacity<HashMapOptions & CollectionInitializer<E>>): OpenHashSet<E> {
    return MapBasedSet.createSet<E, OpenHashMap<E, boolean>, OpenHashSet<E>>(
      OpenHashSet,
      OpenHashMap.create,
      initializer
    );
  }

  clone(): OpenHashSet<E> {
    return new OpenHashSet(this.cloneDelegate<OpenHashMap<E, boolean>>(OpenHashMap));
  }
}
