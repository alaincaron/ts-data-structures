import { MapBasedSet } from './map_based_set';
import { CollectionInitializer } from '../collections';
import { HashMap, HashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class HashSet<E> extends MapBasedSet<E> {
  constructor(delegate?: HashMap<E, boolean>) {
    super(delegate ?? new HashMap());
  }

  static create<E>(initializer?: WithCapacity<HashMapOptions & CollectionInitializer<E>>): HashSet<E> {
    return MapBasedSet.createSet<E, HashMap<E, boolean>, HashSet<E>>(HashSet, HashMap.create, initializer);
  }

  clone(): HashSet<E> {
    return new HashSet(this.cloneDelegate<HashMap<E, boolean>>(HashMap));
  }
}
