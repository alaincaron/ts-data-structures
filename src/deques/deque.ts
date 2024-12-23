import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { SequencedMutableCollection } from '../collections';
import { FluentQueueIterator, Queue, QueueIterator } from '../queues';

export interface DequeIterator<E> extends QueueIterator<E> {
  setValue(item: E): E;
}

export class FluentDequeIterator<E> extends FluentQueueIterator<E> {
  constructor(iter: DequeIterator<E>) {
    super(iter);
  }

  [Symbol.iterator]() {
    return this.iter as DequeIterator<E>;
  }

  setValue(value: E) {
    return (this.iter as DequeIterator<E>).setValue(value);
  }
}

export interface Deque<E> extends Queue<E>, SequencedMutableCollection<E> {
  addFirst(item: E): Deque<E>;

  addLast(item: E): Deque<E>;

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

  reverseIterator(): FluentIterator<E>;

  queueIterator(): FluentDequeIterator<E>;

  reverseQueueIterator(): FluentDequeIterator<E>;

  clone(): Deque<E>;
}
