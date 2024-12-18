import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export type OverflowQueueStrategy = 'throw' | 'overwrite' | 'discard';

export interface QueueIterator<E> extends IterableIterator<E> {
  remove(): E;
}

export class FluentQueueIterator<E> extends FluentIterator<E> {
  constructor(iter: QueueIterator<E>) {
    super(iter);
  }

  [Symbol.iterator]() {
    return this.iter as QueueIterator<E>;
  }

  remove() {
    return (this.iter as QueueIterator<E>).remove();
  }
}

export interface Queue<E> extends Collection<E> {
  overflowStrategy(): OverflowQueueStrategy;

  poll(): E | undefined;

  remove(): E;

  peek(): E | undefined;

  element(): E;

  drain(): FluentIterator<E>;

  queueIterator(): FluentQueueIterator<E>;

  clone(): Queue<E>;
}
