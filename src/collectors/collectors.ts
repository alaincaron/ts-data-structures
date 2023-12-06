import { Collectors } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { ArrayList, LinkedList } from '../lists';
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

export function collectionCollector<A, C extends Collection<A>>(c: C | (new () => C)): CollectionCollector<A, C> {
  return new CollectionCollector(c);
}

export function arrayListCollector<A>(list?: ArrayList<A>): CollectionCollector<A, ArrayList<A>> {
  return collectionCollector(list ?? ArrayList<A>);
}

export function linkedListCollector<A>(list?: LinkedList<A>): CollectionCollector<A, LinkedList<A>> {
  return collectionCollector(list ?? LinkedList<A>);
}

export function hashSetCollector<A>(set?: HashSet<A>): CollectionCollector<A, HashSet<A>> {
  return collectionCollector(set ?? HashSet<A>);
}

export function linkedHashSetCollector<A>(set?: LinkedHashSet<A>): CollectionCollector<A, LinkedHashSet<A>> {
  return collectionCollector(set ?? LinkedHashSet<A>);
}

export function priorityQueueCollector<A>(queue?: PriorityQueue<A>): CollectionCollector<A, PriorityQueue<A>> {
  return collectionCollector(queue ?? PriorityQueue<A>);
}
