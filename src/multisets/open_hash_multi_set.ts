import { MapBasedMultiSet } from './map_based_multi_set';
import { buildMultiSet, MultiSetInitializer } from './multi_set';
import { HashMapOptions, OpenHashMap } from '../maps';

export class OpenHashMultiSet<E> extends MapBasedMultiSet<E> {
  constructor(options?: number | HashMapOptions) {
    super(new OpenHashMap(options), options);
  }

  static create<E>(initializer?: number | (HashMapOptions & MultiSetInitializer<E>)): OpenHashMultiSet<E> {
    return buildMultiSet<E, OpenHashMultiSet<E>>(OpenHashMultiSet, initializer);
  }

  clone(): OpenHashMultiSet<E> {
    return OpenHashMultiSet.create({ initial: this });
  }
}
