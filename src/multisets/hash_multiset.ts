import { buildMultiSet, MultiSetInitializer } from './abstract_multiset';
import { MapBasedMultiSet } from './map_based_multiset';
import { HashMap, HashMapOptions } from '../maps';
import { WithCapacity } from '../utils';

export class HashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: HashMapOptions) {
    super(new HashMap(options));
  }

  static create<E>(initializer?: WithCapacity<HashMapOptions & MultiSetInitializer<E>>): HashMultiSet<E> {
    return buildMultiSet<E, HashMultiSet<E>, HashMapOptions>(HashMultiSet, initializer);
  }

  clone(): HashMultiSet<E> {
    return HashMultiSet.create({ initial: this });
  }
}
