import { Collectors } from 'ts-fluent-iterators';
import { HashMapOptions, LinkedHashMapOptions, SortedMapOptions } from '../maps';
import {
  AvlTreeMultiSet,
  HashMultiSet,
  LinkedHashMultiSet,
  MultiSet,
  OpenHashMultiSet,
  SkipListMultiSet,
  SplayTreeMultiSet,
} from '../multisets';
import { WithCapacity } from '../utils';

export class MultiSetCollector<E, MS extends MultiSet<E>> implements Collectors.Collector<E, MS> {
  constructor(private readonly ms: MS) {}

  collect(e: E) {
    this.ms.add(e);
  }

  get result(): MS {
    return this.ms;
  }
}

export function hashMultiSetCollector<E>(
  arg?: HashMultiSet<E> | WithCapacity<HashMapOptions>
): MultiSetCollector<E, HashMultiSet<E>> {
  return new MultiSetCollector(arg instanceof HashMultiSet ? arg : HashMultiSet.create(arg));
}

export function linkedHashMultiSetCollector<E>(
  arg?: LinkedHashMultiSet<E> | WithCapacity<LinkedHashMapOptions>
): MultiSetCollector<E, LinkedHashMultiSet<E>> {
  return new MultiSetCollector(arg instanceof LinkedHashMultiSet ? arg : LinkedHashMultiSet.create(arg));
}

export function openHashMultiSetCollector<E>(
  arg?: OpenHashMultiSet<E> | WithCapacity<HashMapOptions>
): MultiSetCollector<E, OpenHashMultiSet<E>> {
  return new MultiSetCollector(arg instanceof OpenHashMultiSet ? arg : OpenHashMultiSet.create(arg));
}

export function splayTreeMultiSetCollector<E>(
  arg?: SplayTreeMultiSet<E> | WithCapacity<SortedMapOptions<E>>
): MultiSetCollector<E, SplayTreeMultiSet<E>> {
  return new MultiSetCollector(arg instanceof SplayTreeMultiSet ? arg : SplayTreeMultiSet.create(arg));
}

export function avlTreeMultiSetCollector<E>(
  arg?: AvlTreeMultiSet<E> | WithCapacity<SortedMapOptions<E>>
): MultiSetCollector<E, AvlTreeMultiSet<E>> {
  return new MultiSetCollector(arg instanceof AvlTreeMultiSet ? arg : AvlTreeMultiSet.create(arg));
}

export function skipListMultiSetCollector<E>(
  arg?: SkipListMultiSet<E> | WithCapacity<SortedMapOptions<E>>
): MultiSetCollector<E, SkipListMultiSet<E>> {
  return new MultiSetCollector(arg instanceof SkipListMultiSet ? arg : SkipListMultiSet.create(arg));
}
