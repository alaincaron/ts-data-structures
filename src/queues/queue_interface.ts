import { FluentIterator } from 'ts-fluent-iterators';
import { CollectionInterface } from '../collections';

export type OverflowQueueStrategy = 'throw' | 'overwrite' | 'discard';

export interface QueueIterator<E> extends IterableIterator<E> {
  remove(): E;
}
export interface QueueInterface<E> extends CollectionInterface<E> {
  overflowStrategy(): OverflowQueueStrategy;

  poll(): E | undefined;

  remove(): E;

  peek(): E | undefined;

  element(): E;

  drain(): FluentIterator<unknown>;

  queueIterator(): QueueIterator<E>;

  clone(): QueueInterface<E>;
}
