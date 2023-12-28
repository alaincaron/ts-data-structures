import { Collectors, Mapper } from 'ts-fluent-iterators';
import { buildObject, Factory } from './helpers';
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
    factory: Factory<M>
  ) {
    this.m = buildObject(factory);
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
  map: Factory<HashMultiMap<K, A>>
): MultiMapCollector<A, K, HashMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? new HashMultiMap());
}

export function linkedHashMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<LinkedHashMultiMap<K, A>>
): MultiMapCollector<A, K, LinkedHashMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? new LinkedHashMultiMap());
}

export function openHashMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<OpenHashMultiMap<K, A>>
): MultiMapCollector<A, K, OpenHashMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? new OpenHashMultiMap());
}

export function splayTreeMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<SplayTreeMultiMap<K, A>>
): MultiMapCollector<A, K, SplayTreeMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? new SplayTreeMultiMap());
}

export function avlTreeMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<AvlTreeMultiMap<K, A>>
): MultiMapCollector<A, K, AvlTreeMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? new AvlTreeMultiMap());
}

export function skipListMultiMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<SkipListMultiMap<K, A>>
): MultiMapCollector<A, K, SkipListMultiMap<K, A>> {
  return new MultiMapCollector(mapper, map ?? new SkipListMultiMap());
}
