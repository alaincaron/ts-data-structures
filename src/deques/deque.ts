import { Queue } from '../queues';
import { Predicate } from 'ts-fluent-iterators';

export interface Deque<E = any> extends Queue<E> {
  addFirst(item: E): void;
  addLast(item: E): void;

  offerFirst(item: E): boolean;
  offerLast(item: E): boolean;

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined;
  removeLastMatchingItem(predicate: Predicate<E>): E | undefined;

  removeFirstOccurence(item: E): boolean;
  removeLastOccurence(item: E): boolean;

  removeFirst(): E;
  removeLast(): E;

  pollFirst(): E | undefined;
  pollLast(): E | undefined;

  getFirst(): E;
  getLast(): E;

  peekFirst(): E | undefined;
  peekLast(): E | undefined;

  reverseIterator(): IterableIterator<E>;

  clone(): Deque<E>;
}
