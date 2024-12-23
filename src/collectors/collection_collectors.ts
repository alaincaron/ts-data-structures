import { Collector } from 'ts-fluent-iterators';
import { MutableCollection } from '../collections';

export class CollectionCollector<A, C extends MutableCollection<A>> implements Collector<A, C> {
  constructor(private readonly c: C) {}

  collect(a: A) {
    this.c.add(a);
  }

  get result(): C {
    return this.c;
  }
}
