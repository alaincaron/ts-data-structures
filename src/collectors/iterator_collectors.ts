import { Collectors, FluentIterator } from 'ts-fluent-iterators';
import { CollectionCollector } from './collection_collectors';
import { arrayDequeCollector } from './queue_collectors';
import { ArrayDeque } from '../deques';

export class LastNCollector<E> implements Collectors.Collector<E, FluentIterator<E>> {
  private readonly collector: CollectionCollector<E, ArrayDeque<E>>;
  constructor(n: number) {
    if (n < 1) throw new Error(`Invalid value: ${n}`);
    this.collector = arrayDequeCollector({ capacity: n, overflowStrategy: 'overwrite' });
  }

  collect(e: E) {
    this.collector.collect(e);
  }

  get result(): FluentIterator<E> {
    return this.collector.result.iterator();
  }
}

export function lastN<E>(n: number): Collectors.Collector<E, FluentIterator<E>> {
  return new LastNCollector(n);
}
