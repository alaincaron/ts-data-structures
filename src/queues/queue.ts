import { Collection } from '../collections';

export interface Queue<E> extends Collection<E> {
  poll(): E | undefined;
  remove(): E;

  peek(): E | undefined;
  element(): E;

  drain(): IterableIterator<E>;
  clone(): Queue<E>;
}
