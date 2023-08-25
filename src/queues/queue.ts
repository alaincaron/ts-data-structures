import { Collection } from '../collections';

export type OverflowQueueStrategy = 'throw' | 'overwrite' | 'discard';

export interface Queue<E> extends Collection<E> {
  overflowStrategy(): OverflowQueueStrategy;
  poll(): E | undefined;
  remove(): E;

  peek(): E | undefined;
  element(): E;

  drain(): IterableIterator<E>;
  clone(): Queue<E>;
}
