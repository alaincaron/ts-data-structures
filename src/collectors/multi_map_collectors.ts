import { Collectors } from 'ts-fluent-iterators';
import {
  AvlTreeMultiMap,
  HashMultiMap,
  LinkedHashMultiMap,
  MultiMap,
  OpenHashMultiMap,
  SkipListMultiMap,
  SplayTreeMultiMap,
} from '../multimaps';

export class MultiMapCollector<K, V, M extends MultiMap<K, V>> implements Collectors.Collector<[K, V], M> {
  private readonly m: M;
  constructor(factory: M | (new () => M)) {
    this.m = typeof factory === 'function' ? new factory() : factory;
  }

  collect([k, v]: [K, V]) {
    this.m.put(k, v);
  }

  get result(): M {
    return this.m;
  }
}

export function hashMultiMapCollector<K, V>(map?: HashMultiMap<K, V>): MultiMapCollector<K, V, HashMultiMap<K, V>> {
  return new MultiMapCollector(map ?? HashMultiMap<K, V>);
}

export function linkedHashMultiMapCollector<K, V>(
  map?: LinkedHashMultiMap<K, V>
): MultiMapCollector<K, V, LinkedHashMultiMap<K, V>> {
  return new MultiMapCollector(map ?? LinkedHashMultiMap<K, V>);
}

export function openHashMultiMapCollector<K, V>(
  map?: OpenHashMultiMap<K, V>
): MultiMapCollector<K, V, OpenHashMultiMap<K, V>> {
  return new MultiMapCollector(map ?? OpenHashMultiMap<K, V>);
}

export function splayTreeMultiMapCollector<K, V>(
  map?: SplayTreeMultiMap<K, V>
): MultiMapCollector<K, V, SplayTreeMultiMap<K, V>> {
  return new MultiMapCollector(map ?? SplayTreeMultiMap<K, V>);
}

export function avlTreeMultiMapCollector<K, V>(
  map?: AvlTreeMultiMap<K, V>
): MultiMapCollector<K, V, AvlTreeMultiMap<K, V>> {
  return new MultiMapCollector(map ?? AvlTreeMultiMap<K, V>);
}

export function skipListMultiMapCollector<K, V>(
  map?: SkipListMultiMap<K, V>
): MultiMapCollector<K, V, SkipListMultiMap<K, V>> {
  return new MultiMapCollector(map ?? SkipListMultiMap<K, V>);
}
