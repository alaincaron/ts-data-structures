import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { LinkedHashMap, LinkedHashMapOptions } from '../maps';

export class LinkedHashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: number | LinkedHashMapOptions) {
    super(new LinkedHashMap(options), options);
  }

  static create<E>(initializer?: number | (LinkedHashMapOptions & MultiSetInitializer<E>)): LinkedHashMultiSet<E> {
    return buildMultiSet<E, LinkedHashMultiSet<E>>(LinkedHashMultiSet, initializer);
  }

  clone(): LinkedHashMultiSet<E> {
    return LinkedHashMultiSet.create({ initial: this });
  }
}
