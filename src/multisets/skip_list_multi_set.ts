import { buildMultiSet, MultiSetInitializer } from './abstract_multi_set';
import { AbstractNavigableMultiSet } from './abstract_navigable_multi_set';
import { SkipListMap, SkipListMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class SkipListMultiSet<E> extends AbstractNavigableMultiSet<E> {
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
