import { Collection } from '../collections';

export interface Queue<E> extends Collection<E> {
  offer(item: E): boolean;
  offerFully<E1 extends E>(items: E1[] | Collection<E1>): number;
  offerPartially<E1 extends E>(items: Iterable<E1>): number;

  poll(): E | undefined;
  remove(): E;

  peek(): E | undefined;
  element(): E;

  drain(): IterableIterator<E>;
  clone(): Queue<E>;
}
