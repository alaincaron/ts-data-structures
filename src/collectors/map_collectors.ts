import { Collectors, Mapper } from 'ts-fluent-iterators';
import { buildObject, Factory } from './helpers';
import { AvlTreeMap, HashMap, IMap, LinkedHashMap, OpenHashMap, SkipListMap, SplayTreeMap } from '../maps';

export class IMapCollector<A, K, M extends IMap<K, A>> implements Collectors.Collector<A, M> {
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

export function hashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<HashMap<K, A>>
): IMapCollector<A, K, HashMap<K, A>> {
  return new IMapCollector(mapper, map ?? new HashMap());
}

export function linkedHashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<LinkedHashMap<K, A>>
): IMapCollector<A, K, LinkedHashMap<K, A>> {
  return new IMapCollector(mapper, map ?? new LinkedHashMap());
}

export function openHashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<OpenHashMap<K, A>>
): IMapCollector<A, K, OpenHashMap<K, A>> {
  return new IMapCollector(mapper, map ?? new OpenHashMap());
}

export function splayTreeMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<SplayTreeMap<K, A>>
): IMapCollector<A, K, SplayTreeMap<K, A>> {
  return new IMapCollector(mapper, map ?? new SplayTreeMap());
}

export function avlTreeMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<AvlTreeMap<K, A>>
): IMapCollector<A, K, AvlTreeMap<K, A>> {
  return new IMapCollector(mapper, map ?? new AvlTreeMap());
}

export function skipListMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: Factory<SkipListMap<K, A>>
): IMapCollector<A, K, SkipListMap<K, A>> {
  return new IMapCollector(mapper, map ?? new SkipListMap());
}
