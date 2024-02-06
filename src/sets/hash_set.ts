import { MapBasedSet } from './map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { HashMap, HashMapOptions } from '../maps';

export class HashSet<E> extends MapBasedSet<E> {
  constructor(options?: number | HashMapOptions) {
    super(new HashMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (HashMapOptions & CollectionInitializer<E>)): HashSet<E> {
    return buildCollection<E, HashSet<E>>(HashSet, initializer);
  }

  clone(): HashSet<E> {
    return HashSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
