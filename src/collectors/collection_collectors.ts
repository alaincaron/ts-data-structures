import { Collectors } from 'ts-fluent-iterators';
import { Collection } from '../collections';

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
