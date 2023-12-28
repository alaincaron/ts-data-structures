import { Collectors, Mapper } from 'ts-fluent-iterators';
import { AvlTreeMap, HashMap, IMap, LinkedHashMap, OpenHashMap, SkipListMap, SplayTreeMap } from '../maps';

export class IMapCollector<A, K, M extends IMap<K, A>> implements Collectors.Collector<A, M> {
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

export function hashMapCollector<A, K>(mapper: Mapper<A, K>, map?: HashMap<K, A>): IMapCollector<A, K, HashMap<K, A>> {
  return new IMapCollector(mapper, map ?? HashMap<K, A>);
}

export function linkedHashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map?: LinkedHashMap<K, A>
): IMapCollector<A, K, LinkedHashMap<K, A>> {
  return new IMapCollector(mapper, map ?? LinkedHashMap<K, A>);
}

export function openHashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: OpenHashMap<K, A>
): IMapCollector<A, K, OpenHashMap<K, A>> {
  return new IMapCollector(mapper, map ?? OpenHashMap<K, A>);
}

export function splayTreeMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: SplayTreeMap<K, A>
): IMapCollector<A, K, SplayTreeMap<K, A>> {
  return new IMapCollector(mapper, map ?? SplayTreeMap<K, A>);
}

export function avlTreeMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: AvlTreeMap<K, A>
): IMapCollector<A, K, AvlTreeMap<K, A>> {
  return new IMapCollector(mapper, map ?? AvlTreeMap<K, A>);
}

export function skipListMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: SkipListMap<K, A>
): IMapCollector<A, K, SkipListMap<K, A>> {
  return new IMapCollector(mapper, map ?? SkipListMap<K, A>);
}
