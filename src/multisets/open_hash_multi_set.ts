import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { HashMapOptions, OpenHashMap } from '../maps';
import { WithCapacity } from '../utils';

export class OpenHashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: HashMapOptions) {
    super(new OpenHashMap(options));
  }

  static create<E>(initializer?: WithCapacity<HashMapOptions & MultiSetInitializer<E>>): OpenHashMultiSet<E> {
    return buildMultiSet<E, OpenHashMultiSet<E>, HashMapOptions>(OpenHashMultiSet, initializer);
  }

  clone(): OpenHashMultiSet<E> {
    return OpenHashMultiSet.create({ initial: this });
  }
}
