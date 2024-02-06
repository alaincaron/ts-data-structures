import { NavigableMapBasedSet } from './navigable_map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { SortedMapOptions, SplayTreeMap } from '../maps';

export class SplayTreeSet<E> extends NavigableMapBasedSet<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new SplayTreeMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (SortedMapOptions<E> & CollectionInitializer<E>)): SplayTreeSet<E> {
    return buildCollection<E, SplayTreeSet<E>>(SplayTreeSet, initializer);
  }

  clone(): SplayTreeSet<E> {
    return SplayTreeSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
