import { NavigableMapBasedSet } from './navigable_map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { AvlTreeMap, SortedMapOptions } from '../maps';

export class AvlTreeSet<E> extends NavigableMapBasedSet<E> {
  constructor(options?: number | SortedMapOptions<E>) {
    super(new AvlTreeMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (SortedMapOptions<E> & CollectionInitializer<E>)): AvlTreeSet<E> {
    return buildCollection<E, AvlTreeSet<E>>(AvlTreeSet, initializer);
  }

  clone(): AvlTreeSet<E> {
    return AvlTreeSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
