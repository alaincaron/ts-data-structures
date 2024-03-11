import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { NavigableMultiSet } from './navigable_multi_set';
import { SkipListMap, SkipListMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class SkipListMultiSet<E> extends NavigableMultiSet<E> {
  constructor(options?: SkipListMapOptions<E>) {
    super(new SkipListMap(options));
  }

  static create<E>(initializer?: WithCapacity<SkipListMapOptions<E> & MultiSetInitializer<E>>): SkipListMultiSet<E> {
    return buildMultiSet<E, SkipListMultiSet<E>, SkipListMapOptions<E>>(SkipListMultiSet, initializer);
  }

  clone(): SkipListMultiSet<E> {
    return SkipListMultiSet.create({ initial: this });
  }
}
