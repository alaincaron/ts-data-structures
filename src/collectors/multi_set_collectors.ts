import { Collectors } from 'ts-fluent-iterators';
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

export function hashMultiSetCollector<E>(ms?: HashMultiSet<E>): MultiSetCollector<E, HashMultiSet<E>> {
  return new MultiSetCollector(ms ?? HashMultiSet<E>);
}

export function linkedHashMultiSetCollector<E>(
  ms?: LinkedHashMultiSet<E>
): MultiSetCollector<E, LinkedHashMultiSet<E>> {
  return new MultiSetCollector(ms ?? LinkedHashMultiSet<E>);
}

export function openHashMultiSetCollector<E>(ms?: OpenHashMultiSet<E>): MultiSetCollector<E, OpenHashMultiSet<E>> {
  return new MultiSetCollector(ms ?? OpenHashMultiSet<E>);
}

export function splayTreeMultiSetCollector<E>(ms?: SplayTreeMultiSet<E>): MultiSetCollector<E, SplayTreeMultiSet<E>> {
  return new MultiSetCollector(ms ?? SplayTreeMultiSet<E>);
}

export function avlTreeMultiSetCollector<E>(ms?: AvlTreeMultiSet<E>): MultiSetCollector<E, AvlTreeMultiSet<E>> {
  return new MultiSetCollector(ms ?? AvlTreeMultiSet<E>);
}

export function skipListMultiSetCollector<E>(ms?: SkipListMultiSet<E>): MultiSetCollector<E, SkipListMultiSet<E>> {
  return new MultiSetCollector(ms ?? SkipListMultiSet<E>);
}
