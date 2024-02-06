import { MapBasedSet } from './map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';

export class LinkedHashSet<E> extends MapBasedSet<E> {
  constructor(options?: number | LinkedHashMapOptions) {
    super(new LinkedHashMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (LinkedHashMapOptions & CollectionInitializer<E>)): LinkedHashSet<E> {
    return buildCollection<E, LinkedHashSet<E>>(LinkedHashSet, initializer);
  }

  clone(): LinkedHashSet<E> {
    return LinkedHashSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
