import { MapBasedSet } from './map_based_set';
import { CollectionInitializer } from '../collections';
import { HashMap, HashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class HashSet<E> extends MapBasedSet<E, HashMap<E, boolean>, HashMapOptions> {
  constructor(options?: HashMapOptions) {
    super(HashMap, options);
  }

  static create<E>(initializer?: WithCapacity<HashMapOptions & CollectionInitializer<E>>): HashSet<E> {
    return MapBasedSet.createSet<E, HashMap<E, boolean>, HashMapOptions, HashSet<E>>(HashSet, initializer);
  }

  clone(): HashSet<E> {
    return MapBasedSet.createSet<E, HashMap<E, boolean>, HashMapOptions, HashSet<E>>(HashSet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
