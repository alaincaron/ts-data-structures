import { Collectors, CollisionHandler } from 'ts-fluent-iterators';
import { AvlTreeMap, HashMap, IMap, LinkedHashMap, OpenHashMap, SkipListMap, SplayTreeMap } from '../maps';

export class IMapCollector<K, V, M extends IMap<K, V>> implements Collectors.Collector<[K, V], M> {
  private readonly m: M;

  constructor(
    factory: M | (new () => M),
    private readonly collisionHandler?: CollisionHandler<K, V>
  ) {
    this.m = typeof factory === 'function' ? new factory() : factory;
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

export function hashMapCollector<K, V>({
  map,
  collisionHandler,
}: {
  map?: HashMap<K, V>;
  collisionHandler?: CollisionHandler<K, V>;
} = {}): IMapCollector<K, V, HashMap<K, V>> {
  return new IMapCollector(map ?? HashMap<K, V>, collisionHandler);
}

export function linkedHashMapCollector<K, V>({
  map,
  collisionHandler,
}: {
  map?: LinkedHashMap<K, V>;
  collisionHandler?: CollisionHandler<K, V>;
} = {}): IMapCollector<K, V, LinkedHashMap<K, V>> {
  return new IMapCollector(map ?? LinkedHashMap<K, V>, collisionHandler);
}

export function openHashMapCollector<K, V>({
  map,
  collisionHandler,
}: {
  map?: OpenHashMap<K, V>;
  collisionHandler?: CollisionHandler<K, V>;
} = {}): IMapCollector<K, V, OpenHashMap<K, V>> {
  return new IMapCollector(map ?? OpenHashMap<K, V>, collisionHandler);
}

export function splayTreeMapCollector<K, V>({
  map,
  collisionHandler,
}: {
  map?: SplayTreeMap<K, V>;
  collisionHandler?: CollisionHandler<K, V>;
}): IMapCollector<K, V, SplayTreeMap<K, V>> {
  return new IMapCollector(map ?? SplayTreeMap<K, V>, collisionHandler);
}

export function avlTreeMapCollector<K, V>({
  map,
  collisionHandler,
}: {
  map?: AvlTreeMap<K, V>;
  collisionHandler?: CollisionHandler<K, V>;
} = {}): IMapCollector<K, V, AvlTreeMap<K, V>> {
  return new IMapCollector(map ?? AvlTreeMap<K, V>, collisionHandler);
}

export function skipListMapCollector<K, V>({
  map,
  collisionHandler,
}: {
  map?: SkipListMap<K, V>;
  collisionHandler?: CollisionHandler<K, V>;
} = {}): IMapCollector<K, V, SkipListMap<K, V>> {
  return new IMapCollector(map ?? SkipListMap<K, V>, collisionHandler);
}
