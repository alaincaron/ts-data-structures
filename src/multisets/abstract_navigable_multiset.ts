import { Constructor } from 'ts-fluent-iterators';
import { AbstractSortedMultiSet } from './abstract_sorted_multiset';
import { NavigableMultiSet } from './navigable_multiset';
import { MutableMapEntry, NavigableMap, SortedMapOptions } from '../maps';

export abstract class AbstractNavigableMultiSet<
    E,
    M extends NavigableMap<E, number>,
    Options extends SortedMapOptions<E> = SortedMapOptions<E>,
  >
  extends AbstractSortedMultiSet<E, M, Options>
  implements NavigableMultiSet<E>
{
  protected constructor(ctor: Constructor<M, [Options | undefined]>, options?: Options) {
    super(ctor, options);
  }

  protected delegate() {
    return this.map as NavigableMap<E, number>;
  }

  lower(key: E): E | undefined {
    return this.delegate().lowerKey(key);
  }

  lowerEntry(key: E): MutableMapEntry<E, number> | undefined {
    return this.delegate().lowerEntry(key);
  }

  higher(key: E): E | undefined {
    return this.delegate().higherKey(key);
  }

  higherEntry(key: E): MutableMapEntry<E, number> | undefined {
    return this.delegate().higherEntry(key);
  }

  floor(key: E): E | undefined {
    return this.delegate().floorKey(key);
  }

  floorEntry(key: E): MutableMapEntry<E, number> | undefined {
    return this.delegate().floorEntry(key);
  }

  ceiling(key: E): E | undefined {
    return this.delegate().ceilingKey(key);
  }

  ceilingEntry(key: E): MutableMapEntry<E, number> | undefined {
    return this.delegate().ceilingEntry(key);
  }

  pollFirstEntry(): MutableMapEntry<E, number> | undefined {
    return this.delegate().pollFirstEntry();
  }

  pollLastEntry(): MutableMapEntry<E, number> | undefined {
    return this.delegate().pollLastEntry();
  }

  pollFirst(): E | undefined {
    const e = this.delegate().firstEntry();
    if (!e) return undefined;
    this.removeItem(e.key);
    return e.key;
  }

  pollLast(): E | undefined {
    const e = this.delegate().lastEntry();
    if (!e) return undefined;
    this.removeItem(e.key);
    return e.key;
  }

  abstract clone(): AbstractNavigableMultiSet<E, M, Options>;
}
