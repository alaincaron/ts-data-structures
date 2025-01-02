import { buildMultiSet, MultiSetInitializer } from './abstract_multiset';
import { MapBasedMultiSet } from './map_based_multiset';
import { LinkedMap } from '../maps';
import { ContainerOptions, WithCapacity } from '../utils';

export class LinkedMultiSet<E> extends MapBasedMultiSet<E, LinkedMap<E, number>> {
  constructor(options?: ContainerOptions) {
    super(LinkedMap, options);
  }

  static create<E>(initializer?: WithCapacity<MultiSetInitializer<E>>): LinkedMultiSet<E> {
    return buildMultiSet<E, LinkedMultiSet<E>>(LinkedMultiSet, initializer);
  }

  clone(): LinkedMultiSet<E> {
    return LinkedMultiSet.create({ initial: this });
  }
}
