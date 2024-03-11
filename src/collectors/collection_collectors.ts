import { Collectors } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export class CollectionCollector<A, C extends Collection<A>> implements Collectors.Collector<A, C> {
  constructor(private readonly c: C) {}

  collect(a: A) {
    this.c.add(a);
  }

  get result(): C {
    return this.c;
  }
}
