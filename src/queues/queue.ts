import { FluentIterator } from 'ts-fluent-iterators';
import { Collection } from '../collections';

export type OverflowQueueStrategy = 'throw' | 'overwrite' | 'discard';

export interface Queue<E = any> extends Collection<E> {
  overflowStrategy(): OverflowQueueStrategy;
  poll(): E | undefined;
  remove(): E;

  peek(): E | undefined;
  element(): E;

  drain(): FluentIterator<E>;
  clone(): Queue<E>;
}
