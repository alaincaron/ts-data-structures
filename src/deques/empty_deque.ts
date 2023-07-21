import { EmptyQueue } from '../queues';
import { Predicate } from '../utils';
import { Deque } from '../deques';

export class EmptyDeque<E> extends EmptyQueue<E> implements Deque<E> {
  private static DEQUE = new EmptyDeque();

  public static instance<T>() {
    return EmptyDeque.DEQUE as EmptyDeque<T>;
  }

  protected constructor() {
    super();
  }

  addFirst(_item: E) {
    throw new Error(`Calling addFirst on ${this.constructor.name}`);
  }

  addLast(_item: E) {
    throw new Error(`Calling addLast on ${this.constructor.name}`);
  }

  offerFirst(_: E) {
    return false;
  }

  offerLast(_: E) {
    return false;
  }

  removeFirstMatchingItem(_: Predicate<E>) {
    return undefined;
  }

  removeLastMatchingItem(_: Predicate<E>) {
    return undefined;
  }

  removeFirstOccurence(_: E) {
    return false;
  }

  removeLastOccurence(_: E): boolean {
    return false;
  }

  removeFirst(): never {
    throw new Error(`Calling removeFirst on ${this.constructor.name}`);
  }

  removeLast(): never {
    throw new Error(`Calling removeLast on ${this.constructor.name}`);
  }

  pollFirst() {
    return undefined;
  }

  pollLast() {
    return undefined;
  }

  getFirst(): never {
    throw new Error(`Calling getFirst on ${this.constructor.name}`);
  }

  getLast(): never {
    throw new Error(`Calling getLast on ${this.constructor.name}`);
  }

  peekFirst() {
    return undefined;
  }

  peekLast() {
    return undefined;
  }

  *reverseIterator() {}

  clone(): EmptyDeque<E> {
    return this;
  }
}
