import { Collectors, Mapper } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { ArrayList, LinkedList } from '../lists';
import { HashMap, IMap, LinkedHashMap, OpenHashMap } from '../maps';
import { PriorityQueue } from '../queues';
import { HashSet, LinkedHashSet } from '../sets';

export class CollectionCollector<A, C extends Collection<A>> implements Collectors.Collector<A, C> {
  private readonly c: C;
  constructor(factory: C | (new () => C)) {
    this.c = typeof factory === 'function' ? new factory() : factory;
  }

  collect(a: A) {
    this.c.add(a);
  }

  get result(): C {
    return this.c;
  }
}

export function arrayListCollector<A>(list?: ArrayList<A>): CollectionCollector<A, ArrayList<A>> {
  return new CollectionCollector(list ?? ArrayList<A>);
}

export function linkedListCollector<A>(list?: LinkedList<A>): CollectionCollector<A, LinkedList<A>> {
  return new CollectionCollector(list ?? LinkedList<A>);
}

export function hashIterableUnorderedCollector<A>(set?: HashSet<A>): CollectionCollector<A, HashSet<A>> {
  return new CollectionCollector(set ?? HashSet<A>);
}

export function linkedHashSetCollector<A>(set?: LinkedHashSet<A>): CollectionCollector<A, LinkedHashSet<A>> {
  return new CollectionCollector(set ?? LinkedHashSet<A>);
}

export function priorityQueueCollector<A>(queue?: PriorityQueue<A>): CollectionCollector<A, PriorityQueue<A>> {
  return new CollectionCollector(queue ?? PriorityQueue<A>);
}

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

export function hashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: HashMap<K, A> | (new () => HashMap<K, A>)
): IMapCollector<A, K, HashMap<K, A>> {
  return new IMapCollector(mapper, map);
}

export function linkedHashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: LinkedHashMap<K, A> | (new () => LinkedHashMap<K, A>)
): IMapCollector<A, K, LinkedHashMap<K, A>> {
  return new IMapCollector(mapper, map);
}

export function openHashMapCollector<A, K>(
  mapper: Mapper<A, K>,
  map: OpenHashMap<K, A> | (new () => OpenHashMap<K, A>)
): IMapCollector<A, K, OpenHashMap<K, A>> {
  return new IMapCollector(mapper, map);
}
