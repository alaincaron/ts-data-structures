import { Collectors, CollisionHandler } from 'ts-fluent-iterators';
import { AvlTreeMap, HashMap, IMap, LinkedHashMap, OpenHashMap, SkipListMap, SplayTreeMap } from '../maps';

export interface IMapCollectorOptions<K, V, M extends IMap<K, V>> {
  map?: M;
  collisionHandler?: CollisionHandler<K, V>;
}

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

export function hashMapCollector<K, V>(
  options?: IMapCollectorOptions<K, V, HashMap<K, V>>
): IMapCollector<K, V, HashMap<K, V>> {
  return new IMapCollector(options?.map ?? HashMap<K, V>, options?.collisionHandler);
}

export function linkedHashMapCollector<K, V>(
  options?: IMapCollectorOptions<K, V, LinkedHashMap<K, V>>
): IMapCollector<K, V, LinkedHashMap<K, V>> {
  return new IMapCollector(options?.map ?? LinkedHashMap<K, V>, options?.collisionHandler);
}

export function openHashMapCollector<K, V>(
  options?: IMapCollectorOptions<K, V, OpenHashMap<K, V>>
): IMapCollector<K, V, OpenHashMap<K, V>> {
  return new IMapCollector(options?.map ?? OpenHashMap<K, V>, options?.collisionHandler);
}

export function splayTreeMapCollector<K, V>(
  options?: IMapCollectorOptions<K, V, SplayTreeMap<K, V>>
): IMapCollector<K, V, SplayTreeMap<K, V>> {
  return new IMapCollector(options?.map ?? SplayTreeMap<K, V>, options?.collisionHandler);
}

export function avlTreeMapCollector<K, V>(
  options?: IMapCollectorOptions<K, V, AvlTreeMap<K, V>>
): IMapCollector<K, V, AvlTreeMap<K, V>> {
  return new IMapCollector(options?.map ?? AvlTreeMap<K, V>, options?.collisionHandler);
}

export function skipListMapCollector<K, V>(
  options?: IMapCollectorOptions<K, V, SkipListMap<K, V>>
): IMapCollector<K, V, SkipListMap<K, V>> {
  return new IMapCollector(options?.map ?? SkipListMap<K, V>, options?.collisionHandler);
}
