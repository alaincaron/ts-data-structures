import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer, MultiSetOptions } from './multi_set';
import { HashMap } from '../maps';
import { ContainerOptions } from '../utils';

export class HashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: number | ContainerOptions) {
    super(HashMap, options);
  }

  static create<E>(initializer?: number | (MultiSetOptions & MultiSetInitializer<E>)): HashMultiSet<E> {
    return buildMultiSet<E, HashMultiSet<E>>(HashMultiSet, initializer);
  }

  clone(): HashMultiSet<E> {
    return HashMultiSet.create({ initial: this });
  }
}
