import { MapBasedSet } from './map_based_set';
import { CollectionInitializer } from '../collections';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class LinkedHashSet<E> extends MapBasedSet<E, LinkedHashMap<E, boolean>, LinkedHashMapOptions> {
  constructor(options?: LinkedHashMapOptions) {
    super(LinkedHashMap, options);
  }

  static create<E>(initializer?: WithCapacity<LinkedHashMapOptions & CollectionInitializer<E>>): LinkedHashSet<E> {
    return MapBasedSet.createSet<E, LinkedHashMap<E, boolean>, LinkedHashMapOptions, LinkedHashSet<E>>(
      LinkedHashSet,
      initializer
    );
  }

  clone(): LinkedHashSet<E> {
    return MapBasedSet.createSet<E, LinkedHashMap<E, boolean>, LinkedHashMapOptions, LinkedHashSet<E>>(LinkedHashSet, {
      ...this.buildOptions(),
      initial: this.iterator(),
    });
  }
}
