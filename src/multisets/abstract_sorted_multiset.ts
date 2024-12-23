import { Constructor, FluentIterator } from 'ts-fluent-iterators';
import { MapBasedMultiSet } from './map_based_multiset';
import { SortedMultiSet } from './sorted_multiset';
import { MutableMapEntry, SortedMap, SortedMapOptions } from '../maps';

export abstract class AbstractSortedMultiSet<
    E,
    M extends SortedMap<E, number>,
    Options extends SortedMapOptions<E> = SortedMapOptions<E>,
  >
  extends MapBasedMultiSet<E, M, Options>
  implements SortedMultiSet<E>
{
  protected constructor(ctor: Constructor<M, [Options | undefined]>, options?: Options) {
    super(ctor, options);
  }

  protected delegate() {
    return this.map as SortedMap<E, number>;
  }

  firstEntry(): MutableMapEntry<E, number> | undefined {
    return this.delegate().firstEntry();
  }

  lastEntry(): MutableMapEntry<E, number> | undefined {
    return this.delegate().lastEntry();
  }

  first(): E | undefined {
    return this.delegate().firstKey();
  }

  last(): E | undefined {
    return this.delegate().lastKey();
  }

  reverseEntryIterator(): FluentIterator<MutableMapEntry<E, number>> {
    return this.delegate().reverseEntryIterator();
  }

  reverseIterator(): FluentIterator<E> {
    return this.delegate().reverseKeyIterator();
  }

  abstract clone(): AbstractSortedMultiSet<E, M, Options>;
}
