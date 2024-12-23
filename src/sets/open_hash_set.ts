import { MapBasedSet } from './map_based_set';
import { CollectionInitializer } from '../collections';
import { HashMapOptions, OpenHashMap } from '../maps';
import { WithCapacity } from '../utils';

export class OpenHashSet<E> extends MapBasedSet<E, OpenHashMap<E, boolean>, HashMapOptions> {
  constructor(options?: HashMapOptions) {
    super(OpenHashMap, options);
  }

  static create<E>(initializer?: WithCapacity<HashMapOptions & CollectionInitializer<E>>): OpenHashSet<E> {
    return MapBasedSet.createSet<E, OpenHashMap<E, boolean>, HashMapOptions, OpenHashSet<E>>(OpenHashSet, initializer);
  }

  clone(): OpenHashSet<E> {
    return MapBasedSet.createSet<E, OpenHashMap<E, boolean>, HashMapOptions, OpenHashSet<E>>(OpenHashSet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
