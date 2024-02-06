import { MapBasedSet } from './map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { HashMapOptions, OpenHashMap } from '../maps';

export class OpenHashSet<E> extends MapBasedSet<E> {
  constructor(options?: number | HashMapOptions) {
    super(new OpenHashMap<E, boolean>(options));
  }
  static create<E>(initializer?: number | (HashMapOptions & CollectionInitializer<E>)): OpenHashSet<E> {
    return buildCollection<E, OpenHashSet<E>>(OpenHashSet, initializer);
  }

  clone(): OpenHashSet<E> {
    return OpenHashSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
