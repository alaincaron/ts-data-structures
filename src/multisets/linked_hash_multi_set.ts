import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
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
