import { NavigableMapBasedSet } from './navigable_map_based_set';
import { buildCollection, CollectionInitializer } from '../collections';
import { SkipListMap, SkipListMapOptions } from '../maps';

export class SkipListSet<E> extends NavigableMapBasedSet<E> {
  constructor(options?: number | SkipListMapOptions<E>) {
    super(new SkipListMap<E, boolean>(options));
  }

  static create<E>(initializer?: number | (SkipListMapOptions<E> & CollectionInitializer<E>)): SkipListSet<E> {
    return buildCollection<E, SkipListSet<E>>(SkipListSet, initializer);
  }

  layers() {
    (this.delegate() as SkipListMap<E, boolean>).layers();
  }

  clone(): SkipListSet<E> {
    return SkipListSet.create({
      initial: { length: this.delegate().size(), seed: this.delegate().keys() },
      ...this.buildOptions(),
    });
  }
}
