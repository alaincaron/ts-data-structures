import { FluentIterator, Predicate } from 'ts-fluent-iterators';
import { Deque, FluentDequeIterator } from './deque';
import { AbstractQueue, QueueOptions } from '../queues';
import { equalsAny, OverflowException, UnderflowException } from '../utils';

export abstract class AbstractDeque<E> extends AbstractQueue<E> implements Deque<E> {
  protected constructor(options?: QueueOptions) {
    super(options);
  }

  addFirst(item: E): AbstractDeque<E> {
    if (this.offerFirst(item)) return this;
    if (!this.handleOverflow(1, 'addFirst')) return this;
    if (!this.offerFirst(item)) throw new OverflowException();
    return this;
  }

  addLast(item: E): AbstractDeque<E> {
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

  removeFirstOccurrence(item: E) {
    return this.removeFirstMatchingItem(x => equalsAny(item, x)) != null;
  }

  removeLastOccurrence(item: E) {
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

  abstract reverseIterator(): FluentIterator<E>;

  abstract queueIterator(): FluentDequeIterator<E>;

  abstract reverseQueueIterator(): FluentDequeIterator<E>;

  abstract clone(): AbstractDeque<E>;

  reverse(): AbstractDeque<E> {
    const iter1 = this.queueIterator();
    const iter2 = this.reverseQueueIterator();
    let i = 0;
    let j = this.size() - 1;
    while (i < j) {
      const item1 = iter1.next();
      const item2 = iter2.next();
      iter1.setValue(item2.value);
      iter2.setValue(item1.value);
      ++i;
      --j;
    }
    return this;
  }
}
