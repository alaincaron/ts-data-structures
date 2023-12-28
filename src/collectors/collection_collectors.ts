import { Collectors } from 'ts-fluent-iterators';
import { buildObject, Factory } from './helpers';
import { Collection } from '../collections';
import { ArrayList, LinkedList } from '../lists';
import { PriorityQueue } from '../queues';
import { HashSet, LinkedHashSet } from '../sets';

export class CollectionCollector<A, C extends Collection<A>> implements Collectors.Collector<A, C> {
  private readonly c: C;
  constructor(factory: Factory<C>) {
    this.c = buildObject(factory);
  }

  collect(a: A) {
    this.c.add(a);
  }

  get result(): C {
    return this.c;
  }
}

export function arrayListCollector<A>(list?: Factory<ArrayList<A>>): CollectionCollector<A, ArrayList<A>> {
  return new CollectionCollector(list ?? new ArrayList<A>());
}

export function linkedListCollector<A>(list?: Factory<LinkedList<A>>): CollectionCollector<A, LinkedList<A>> {
  return new CollectionCollector(list ?? new LinkedList<A>());
}

export function hashIterableUnorderedCollector<A>(set?: Factory<HashSet<A>>): CollectionCollector<A, HashSet<A>> {
  return new CollectionCollector(set ?? new HashSet<A>());
}

export function linkedHashSetCollector<A>(set?: Factory<LinkedHashSet<A>>): CollectionCollector<A, LinkedHashSet<A>> {
  return new CollectionCollector(set ?? new LinkedHashSet<A>());
}

export function priorityQueueCollector<A>(queue?: Factory<PriorityQueue<A>>): CollectionCollector<A, PriorityQueue<A>> {
  return new CollectionCollector(queue ?? new PriorityQueue<A>());
}
