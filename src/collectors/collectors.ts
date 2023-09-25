import { Collectors } from 'ts-fluent-iterators';
import { Collection } from '../collections';
import { ArrayList, LinkedList } from '../lists';
import { HashSet } from '../sets';

export class CollectionCollector<A, C extends Collection<A>> implements Collectors.Collector<A, C> {
  constructor(private readonly c: C) {}

  collect(a: A) {
    this.c.add(a);
  }

  get result() {
    return this.c;
  }
}

export class ArrayListCollector<A> extends CollectionCollector<A, ArrayList<A>> {
  constructor(c?: ArrayList<A>) {
    super(c ?? new ArrayList<A>());
  }
}

export class LinkedListCollector<A> extends CollectionCollector<A, LinkedList<A>> {
  constructor(c?: LinkedList<A>) {
    super(c ?? new LinkedList<A>());
  }
}

export class HashSetCollector<A> extends CollectionCollector<A, HashSet<A>> {
  constructor(c?: HashSet<A>) {
    super(c ?? new HashSet<A>());
  }
}
