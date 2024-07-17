import { Predicate } from 'ts-fluent-iterators';
import { Queue, QueueOptions } from '../queues';
import { equalsAny, OverflowException, UnderflowException } from '../utils';

export abstract class Deque<E> extends Queue<E> {
  constructor(options?: QueueOptions) {
    super(options);
  }

  addFirst(item: E): Deque<E> {
    if (this.offerFirst(item)) return this;
    if (!this.handleOverflow(1, 'addFirst')) return this;
    if (!this.offerFirst(item)) throw new OverflowException();
    return this;
  }

  addLast(item: E): Deque<E> {
    if (this.offerLast(item)) return this;
    if (!this.handleOverflow(1, 'addLast')) return this;
    if (!this.offerLast(item)) throw new OverflowException();
    return this;
  }

  abstract offerFirst(item: E): boolean;
  abstract offerLast(item: E): boolean;
  offer(item: E): boolean {
    return this.offerLast(item);
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.removeFirstMatchingItem(predicate);
  }

  abstract removeFirstMatchingItem(predicate: Predicate<E>): E | undefined;
  abstract removeLastMatchingItem(predicate: Predicate<E>): E | undefined;

  removeFirstOccurence(item: E) {
    return this.removeFirstMatchingItem(x => equalsAny(item, x)) != null;
  }

  removeLastOccurence(item: E) {
    return this.removeLastMatchingItem(x => equalsAny(item, x)) != null;
  }

  removeFirst() {
    if (this.isEmpty()) throw new UnderflowException();
    return this.pollFirst()!;
  }

  removeLast() {
    if (this.isEmpty()) throw new UnderflowException();
    return this.pollLast()!;
  }

  remove(): E {
    return this.removeFirst();
  }

  abstract pollFirst(): E | undefined;
  abstract pollLast(): E | undefined;
  poll(): E | undefined {
    return this.pollFirst();
  }

  getFirst(): E {
    return this.element();
  }

  getLast(): E {
    if (this.isEmpty()) throw new UnderflowException();
    return this.peekLast()!;
  }

  abstract peekFirst(): E | undefined;
  abstract peekLast(): E | undefined;
  peek(): E | undefined {
    return this.peekFirst();
  }

  abstract reverseIterator(): IterableIterator<E>;

  abstract clone(): Deque<E>;
}
