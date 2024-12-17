import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export type OverflowQueueStrategy = 'throw' | 'overwrite' | 'discard';

export interface QueueIterator<E> extends IterableIterator<E> {
  remove(): E;
}
export interface Queue<E> extends Collection<E> {
  overflowStrategy(): OverflowQueueStrategy;

  poll(): E | undefined;

  remove(): E;

  peek(): E | undefined;

  element(): E;

  drain(): FluentIterator<unknown>;

  queueIterator(): QueueIterator<E>;

  clone(): Queue<E>;
}
