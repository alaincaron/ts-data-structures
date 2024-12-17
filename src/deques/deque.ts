import { Predicate } from 'ts-fluent-iterators';
import { Queue, QueueIterator } from '../queues';

export interface DequeIterator<E> extends QueueIterator<E> {
  setValue(item: E): E;
}

export interface DequeInterface<E> extends Queue<E> {
  addFirst(item: E): DequeInterface<E>;

  addLast(item: E): DequeInterface<E>;

  offerFirst(item: E): boolean;

  offerLast(item: E): boolean;

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined;

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined;

  removeFirstOccurrence(item: E): boolean;

  removeLastOccurrence(item: E): boolean;

  removeFirst(): E;

  removeLast(): E;

  pollFirst(): E | undefined;

  pollLast(): E | undefined;

  getFirst(): E;

  getLast(): E;

  peekFirst(): E | undefined;

  peekLast(): E | undefined;

  reverseIterator(): IterableIterator<E>;

  queueIterator(): DequeIterator<E>;

  reverseQueueIterator(): DequeIterator<E>;

  clone(): DequeInterface<E>;
}
