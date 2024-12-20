import { buildMultiSet, MultiSetInitializer } from './abstract_multiset';
import { MapBasedMultiSet } from './map_based_multiset';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class LinkedHashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: LinkedHashMapOptions) {
    super(new LinkedHashMap(options));
  }

  static create<E>(initializer?: WithCapacity<LinkedHashMapOptions & MultiSetInitializer<E>>): LinkedHashMultiSet<E> {
    return buildMultiSet<E, LinkedHashMultiSet<E>, LinkedHashMapOptions>(LinkedHashMultiSet, initializer);
  }

  clone(): LinkedHashMultiSet<E> {
    return LinkedHashMultiSet.create({ initial: this });
  }
}
