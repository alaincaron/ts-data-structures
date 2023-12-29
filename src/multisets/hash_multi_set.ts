import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { HashMap, HashMapOptions } from '../maps';

export class HashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: number | HashMapOptions) {
    super(new HashMap(options), options);
  }

  static create<E>(initializer?: number | (HashMapOptions & MultiSetInitializer<E>)): HashMultiSet<E> {
    return buildMultiSet<E, HashMultiSet<E>>(HashMultiSet, initializer);
  }

  clone(): HashMultiSet<E> {
    return HashMultiSet.create({ initial: this });
  }
}
