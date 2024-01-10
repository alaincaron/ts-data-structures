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

export class MultiSetCollector<E, MS extends MultiSet<E>> implements Collectors.Collector<E, MS> {
  private readonly ms: MS;
  constructor(factory: MS | (new () => MS)) {
    this.ms = typeof factory === 'function' ? new factory() : factory;
  }

  collect(e: E) {
    this.ms.add(e);
  }

  get result(): MS {
    return this.ms;
  }
}

export function hashMultiSetCollector<E>(
  arg?: HashMultiSet<E> | HashMapOptions | number
): MultiSetCollector<E, HashMultiSet<E>> {
  return new MultiSetCollector(arg instanceof HashMultiSet ? arg : new HashMultiSet(arg));
}

export function linkedHashMultiSetCollector<E>(
  arg?: LinkedHashMultiSet<E> | LinkedHashMapOptions | number
): MultiSetCollector<E, LinkedHashMultiSet<E>> {
  return new MultiSetCollector(arg instanceof LinkedHashMultiSet ? arg : new LinkedHashMultiSet(arg));
}

export function openHashMultiSetCollector<E>(
  arg?: OpenHashMultiSet<E> | HashMapOptions | number
): MultiSetCollector<E, OpenHashMultiSet<E>> {
  return new MultiSetCollector(arg instanceof OpenHashMultiSet ? arg : new OpenHashMultiSet(arg));
}

export function splayTreeMultiSetCollector<E>(
  arg?: SplayTreeMultiSet<E> | SortedMapOptions<E> | number
): MultiSetCollector<E, SplayTreeMultiSet<E>> {
  return new MultiSetCollector(arg instanceof SplayTreeMultiSet ? arg : new SplayTreeMultiSet(arg));
}

export function avlTreeMultiSetCollector<E>(
  arg?: AvlTreeMultiSet<E> | SortedMapOptions<E> | number
): MultiSetCollector<E, AvlTreeMultiSet<E>> {
  return new MultiSetCollector(arg instanceof AvlTreeMultiSet ? arg : new AvlTreeMultiSet(arg));
}

export function skipListMultiSetCollector<E>(
  arg?: SkipListMultiSet<E> | SortedMapOptions<E> | number
): MultiSetCollector<E, SkipListMultiSet<E>> {
  return new MultiSetCollector(arg instanceof SkipListMultiSet ? arg : new SkipListMultiSet(arg));
}
