import { Collector, Comparator, Comparators, FluentIterator } from 'ts-fluent-iterators';
import { CollectionCollector } from './collection_collectors';
import { arrayDequeCollector } from './queue_collectors';
import { ArrayDeque } from '../deques';
import { PriorityQueue } from '../queues';

export class LastNCollector<E> implements Collector<E, FluentIterator<E>> {
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

export function lastNCollector<E>(n: number): Collector<E, FluentIterator<E>> {
  return new LastNCollector(n);
}

export class TopKCollector<E> implements Collector<E, FluentIterator<E>> {
  private readonly queue = new PriorityQueue<E>();
  private readonly k: number;

  constructor(
    k: number,
    private readonly comparator: Comparator<E> = Comparators.natural
  ) {
    if (k < 1) throw new Error(`Invalid value: ${k}`);
    this.k = k;
  }

  collect(e: E) {
    if (this.k <= this.queue.size()) {
      if (this.comparator(e, this.queue.element()) > 0) {
        this.queue.remove();
        this.queue.add(e);
      }
    } else {
      this.queue.add(e);
    }
  }

  get result(): FluentIterator<E> {
    return this.queue.drain();
  }
}

export function topKCollector<E>(k: number, comparator: Comparator<E> = Comparators.natural) {
  return new TopKCollector(k, comparator);
}
