import { AbstractQueue } from '../queues';
import { Deque } from './deque';
import { OverflowException, Predicate } from '../utils';
import { CollectionOptions } from '../collections';

export abstract class AbstractDeque<E> extends AbstractQueue<E> implements Deque<E> {
  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
  }

  addFirst(item: E) {
    if (!this.offerFirst(item)) throw new OverflowException();
  }

  addLast(item: E) {
    if (!this.offerLast(item)) throw new OverflowException();
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
    return this.removeFirstMatchingItem(x => this.equals(item, x)) != null;
  }

  removeLastOccurence(item: E) {
    return this.removeLastMatchingItem(x => this.equals(item, x)) != null;
  }

  abstract removeFirst(): E;
  abstract removeLast(): E;
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

  abstract getLast(): E;

  abstract peekFirst(): E | undefined;
  abstract peekLast(): E | undefined;
  peek(): E | undefined {
    return this.peekFirst();
  }

  abstract reverseIterator(): IterableIterator<E>;

  abstract clone(): AbstractDeque<E>;
}
