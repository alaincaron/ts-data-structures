import { buildMultiSet, MultiSetInitializer } from './abstract_multiset';
import { MapBasedMultiSet } from './map_based_multiset';
import { ArrayMap } from '../maps';
import { ContainerOptions, WithCapacity } from '../utils';

export class ArrayMultiSet<E> extends MapBasedMultiSet<E, ArrayMap<E, number>> {
  constructor(options?: ContainerOptions) {
    super(ArrayMap, options);
  }

  static create<E>(initializer?: WithCapacity<MultiSetInitializer<E>>): ArrayMultiSet<E> {
    return buildMultiSet<E, ArrayMultiSet<E>>(ArrayMultiSet, initializer);
  }

  clone(): ArrayMultiSet<E> {
    return ArrayMultiSet.create({ initial: this });
  }
}
