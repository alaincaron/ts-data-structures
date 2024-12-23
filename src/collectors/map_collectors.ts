import { Collector, CollisionHandler } from 'ts-fluent-iterators';
import {
  AdapterMap,
  AdapterMapOptions,
  AvlTreeMap,
  HashMap,
  HashMapOptions,
  LinkedHashMap,
  LinkedHashMapOptions,
  MutableMap,
  OpenHashMap,
  SkipListMap,
  SortedMapOptions,
  SplayTreeMap,
} from '../maps';
import { WithCapacity } from '../utils';

export class IMapCollector<K, V, M extends MutableMap<K, V>> implements Collector<[K, V], M> {
  constructor(
    private readonly m: M,
    private readonly collisionHandler?: CollisionHandler<K, V>
  ) {}

  collect([k, v]: [K, V]) {
    const oldValue = this.m.put(k, v);
    if (oldValue != null) {
      if (this.collisionHandler) {
        try {
          const effectiveValue = this.collisionHandler(k, oldValue, v);
          if (effectiveValue !== v) this.m.put(k, effectiveValue);
        } catch (e) {
          this.m.put(k, oldValue);
          throw e;
        }
      }
    }
  }

  get result(): M {
    return this.m;
  }
}

export function hashMapCollector<K, V>(options?: {
  arg?: HashMap<K, V> | WithCapacity<HashMapOptions>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, HashMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof HashMap ? arg : HashMap.create(arg), options?.collisionHandler);
}

export function linkedHashMapCollector<K, V>(options?: {
  arg?: LinkedHashMap<K, V> | WithCapacity<LinkedHashMapOptions>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, HashMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof LinkedHashMap ? arg : LinkedHashMap.create(arg), options?.collisionHandler);
}

export function openHashMapCollector<K, V>(options?: {
  arg?: OpenHashMap<K, V> | WithCapacity<HashMapOptions>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, OpenHashMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof OpenHashMap ? arg : OpenHashMap.create(arg), options?.collisionHandler);
}

export function splayTreeMapCollector<K, V>(options?: {
  arg?: SplayTreeMap<K, V> | WithCapacity<SortedMapOptions<K>>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, SplayTreeMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof SplayTreeMap ? arg : SplayTreeMap.create(arg), options?.collisionHandler);
}

export function avlTreeMapCollector<K, V>(options?: {
  arg?: AvlTreeMap<K, V> | WithCapacity<SortedMapOptions<K>>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, AvlTreeMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof AvlTreeMap ? arg : AvlTreeMap.create(arg), options?.collisionHandler);
}

export function skipListMapCollector<K, V>(options?: {
  arg?: SkipListMap<K, V> | WithCapacity<SortedMapOptions<K>>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, SkipListMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof SkipListMap ? arg : SkipListMap.create(arg), options?.collisionHandler);
}

export function adapterMapCollector<K, V>(options?: {
  arg?: AdapterMap<K, V> | WithCapacity<AdapterMapOptions<K, V>>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, AdapterMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(arg instanceof AdapterMap ? arg : AdapterMap.create(arg), options?.collisionHandler);
}
