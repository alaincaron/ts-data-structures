import { Collectors } from 'ts-fluent-iterators';
import { HashMapOptions, LinkedHashMapOptions, SortedMapOptions } from '../maps';
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

export function hashMultiMapCollector<K, V>(
  arg?: HashMultiMap<K, V> | HashMapOptions | number
): MultiMapCollector<K, V, HashMultiMap<K, V>> {
  return new MultiMapCollector(arg instanceof HashMultiMap ? arg : new HashMultiMap(arg));
}

export function linkedHashMultiMapCollector<K, V>(
  arg?: LinkedHashMultiMap<K, V> | LinkedHashMapOptions | number
): MultiMapCollector<K, V, LinkedHashMultiMap<K, V>> {
  return new MultiMapCollector(arg instanceof LinkedHashMultiMap ? arg : new LinkedHashMultiMap(arg));
}

export function openHashMultiMapCollector<K, V>(
  arg?: OpenHashMultiMap<K, V> | HashMapOptions | number
): MultiMapCollector<K, V, OpenHashMultiMap<K, V>> {
  return new MultiMapCollector(arg instanceof OpenHashMultiMap ? arg : new OpenHashMultiMap(arg));
}

export function splayTreeMultiMapCollector<K, V>(
  arg?: SplayTreeMultiMap<K, V> | SortedMapOptions<K> | number
): MultiMapCollector<K, V, SplayTreeMultiMap<K, V>> {
  return new MultiMapCollector(arg instanceof SplayTreeMultiMap ? arg : new SplayTreeMultiMap(arg));
}

export function avlTreeMultiMapCollector<K, V>(
  arg?: AvlTreeMultiMap<K, V> | SortedMapOptions<K> | number
): MultiMapCollector<K, V, AvlTreeMultiMap<K, V>> {
  return new MultiMapCollector(arg instanceof AvlTreeMultiMap ? arg : new AvlTreeMultiMap(arg));
}

export function skipListMultiMapCollector<K, V>(
  arg?: SkipListMultiMap<K, V> | SortedMapOptions<K> | number
): MultiMapCollector<K, V, SkipListMultiMap<K, V>> {
  return new MultiMapCollector(arg instanceof SkipListMultiMap ? arg : new SkipListMultiMap(arg));
}
