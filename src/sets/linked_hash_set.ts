import { MapBasedSet } from './map_based_set';
import { CollectionInitializer } from '../collections';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class LinkedHashSet<E> extends MapBasedSet<E> {
  constructor(delegate?: LinkedHashMap<E, boolean>) {
    super(delegate ?? new LinkedHashMap());
  }

  static create<E>(initializer?: WithCapacity<LinkedHashMapOptions & CollectionInitializer<E>>): LinkedHashSet<E> {
    return MapBasedSet.createSet<E, LinkedHashMap<E, boolean>, LinkedHashSet<E>>(
      LinkedHashSet,
      LinkedHashMap.create,
      initializer
    );
  }

  clone(): LinkedHashSet<E> {
    return new LinkedHashSet(this.cloneDelegate<LinkedHashMap<E, boolean>>(LinkedHashMap));
  }
}
