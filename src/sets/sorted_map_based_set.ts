import { Constructor } from 'ts-fluent-iterators';
import { MapBasedSet } from './map_based_set';
import { SortedSet } from './sorted_set';
import { SortedMap, SortedMapOptions } from '../maps';

export abstract class SortedMapBasedSet<
    E,
    M extends SortedMap<E, boolean>,
    Options extends SortedMapOptions<E> = SortedMapOptions<E>,
  >
  extends MapBasedSet<E, M, Options>
  implements SortedSet<E>
{
  protected constructor(ctor: Constructor<M, [Options | undefined]>, options?: Options) {
    super(ctor, options);
  }

  protected delegate(): M {
    return super.delegate() as M;
  }

  first() {
    return this.delegate().firstKey();
  }

  last() {
    return this.delegate().lastKey();
  }

  reverseIterator() {
    return this.delegate().reverseKeyIterator();
  }

  abstract clone(): SortedMapBasedSet<E, M, Options>;
}
