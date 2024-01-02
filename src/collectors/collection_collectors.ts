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

export function arrayListCollector<A>(list?: ArrayList<A>): CollectionCollector<A, ArrayList<A>> {
  return new CollectionCollector(list ?? ArrayList<A>);
}

export function linkedListCollector<A>(list?: LinkedList<A>): CollectionCollector<A, LinkedList<A>> {
  return new CollectionCollector(list ?? LinkedList<A>);
}

export function hashSetCollector<A>(set?: HashSet<A>): CollectionCollector<A, HashSet<A>> {
  return new CollectionCollector(set ?? HashSet<A>);
}

export function linkedHashSetCollector<A>(set?: LinkedHashSet<A>): CollectionCollector<A, LinkedHashSet<A>> {
  return new CollectionCollector(set ?? LinkedHashSet<A>);
}

export function priorityQueueCollector<A>(queue?: PriorityQueue<A>): CollectionCollector<A, PriorityQueue<A>> {
  return new CollectionCollector(queue ?? PriorityQueue<A>);
}
