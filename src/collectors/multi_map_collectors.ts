import { Collectors, Mapper } from 'ts-fluent-iterators';
import {
  AvlTreeMultiMap,
  HashMultiMap,
  LinkedHashMultiMap,
  MultiMap,
  OpenHashMultiMap,
  SkipListMultiMap,
  SplayTreeMultiMap,
} from '../multimaps';

export class MultiMapCollector<A, K, M extends MultiMap<K, A>> implements Collectors.Collector<A, M> {
  private readonly m: M;
  constructor(
    private readonly mapper: Mapper<A, K>,
    factory: M | (new () => M)
  ) {
    this.m = typeof factory === 'function' ? new factory() : factory;
  }

  collect(a: A) {
    this.m.put(this.mapper(a), a);
  }

  get result(): M {
    return this.m;
  }
}

export function hashMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: HashMultiMap<K, A>
): MultiMapCollector<A, K, HashMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? HashMultiMap<K, A>);
}

export function linkedHashMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: LinkedHashMultiMap<K, A>
): MultiMapCollector<A, K, LinkedHashMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? LinkedHashMultiMap<K, A>);
}

export function openHashMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: OpenHashMultiMap<K, A>
): MultiMapCollector<A, K, OpenHashMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? OpenHashMultiMap<K, A>);
}

export function splayTreeMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: SplayTreeMultiMap<K, A>
): MultiMapCollector<A, K, SplayTreeMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? SplayTreeMultiMap<K, A>);
}

export function avlTreeMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: AvlTreeMultiMap<K, A>
): MultiMapCollector<A, K, AvlTreeMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? AvlTreeMultiMap<K, A>);
}

export function skipListMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: SkipListMultiMap<K, A>
): MultiMapCollector<A, K, SkipListMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? SkipListMultiMap<K, A>);
}
