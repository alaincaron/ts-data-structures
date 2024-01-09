import { Collectors, CollisionHandler } from 'ts-fluent-iterators';
import {
  AvlTreeMap,
  HashMap,
  HashMapOptions,
  IMap,
  LinkedHashMap,
  LinkedHashMapOptions,
  OpenHashMap,
  SkipListMap,
  SortedMapOptions,
  SplayTreeMap,
} from '../maps';

export class IMapCollector<K, V, M extends IMap<K, V>> implements Collectors.Collector<[K, V], M> {
  private readonly m: M;
  constructor(
    arg: M | (new () => M),
    private readonly collisionHandler?: CollisionHandler<K, V>
  ) {
    this.m = typeof arg === 'function' ? new arg() : arg;
  }

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
  arg?: HashMap<K, V> | HashMapOptions;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, HashMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(
    !arg ? HashMap<K, V> : arg instanceof HashMap ? arg : new HashMap<K, V>(arg),
    options?.collisionHandler
  );
}

export function linkedHashMapCollector<K, V>(options?: {
  arg?: LinkedHashMap<K, V> | LinkedHashMapOptions;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, HashMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(
    !arg ? LinkedHashMap<K, V> : arg instanceof LinkedHashMap ? arg : new LinkedHashMap<K, V>(arg),
    options?.collisionHandler
  );
}

export function openHashMapCollector<K, V>(options?: {
  arg?: OpenHashMap<K, V> | HashMapOptions;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, OpenHashMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(
    !arg ? OpenHashMap<K, V> : arg instanceof OpenHashMap ? arg : new OpenHashMap<K, V>(arg),
    options?.collisionHandler
  );
}

export function splayTreeMapCollector<K, V>(options?: {
  arg?: SplayTreeMap<K, V> | SortedMapOptions<K>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, SplayTreeMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(
    !arg ? SplayTreeMap<K, V> : arg instanceof SplayTreeMap ? arg : new SplayTreeMap<K, V>(arg),
    options?.collisionHandler
  );
}

export function avlTreeMapCollector<K, V>(options?: {
  arg?: AvlTreeMap<K, V> | SortedMapOptions<K>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, AvlTreeMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(
    !arg ? AvlTreeMap<K, V> : arg instanceof AvlTreeMap ? arg : new AvlTreeMap<K, V>(arg),
    options?.collisionHandler
  );
}

export function SkipListMapCollector<K, V>(options?: {
  arg?: SkipListMap<K, V> | SortedMapOptions<K>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, SkipListMap<K, V>> {
  const arg = options?.arg;
  return new IMapCollector(
    !arg ? SkipListMap<K, V> : arg instanceof SkipListMap ? arg : new SkipListMap<K, V>(arg),
    options?.collisionHandler
  );
}
