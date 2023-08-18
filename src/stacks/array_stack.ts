import { Predicate } from '../utils';
import { Deque, ArrayDeque } from '../deques';
import { AbstractStack } from './abstract_stack';
import { CollectionInitializer, CollectionOptions } from '../collections';

export class ArrayStack<E> extends AbstractStack<E> {
  private readonly buffer: Deque<E>;

  constructor(options?: number | CollectionOptions<E>) {
    super(options);
    this.buffer = new ArrayDeque<E>(options);
  }

  static from<E>(initializer: CollectionOptions<E> & CollectionInitializer<E>) {
    return AbstractStack.buildCollection(options => new ArrayStack(options), initializer) as ArrayStack<E>;
  }

  size() {
    return this.buffer.size();
  }

  capacity() {
    return this.buffer.capacity();
  }

  clear() {
    this.buffer.clear();
  }

  isFull() {
    return this.buffer.isFull();
  }

  isEmpty() {
    return this.buffer.isEmpty();
  }

  offer(item: E) {
    return this.buffer.offer(item);
  }

  poll(): E | undefined {
    return this.buffer.pollLast();
  }

  peek(): E | undefined {
    return this.buffer.peekLast();
  }

  clone(): ArrayStack<E> {
    return ArrayStack.from({ initial: this });
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.buffer.removeLastMatchingItem(predicate);
  }

  filter(predicate: (item: E) => boolean): boolean {
    return this.buffer.filter(predicate);
  }

  [Symbol.iterator](): Iterator<E> {
    return this.buffer.reverseIterator();
  }

  iterator(): IterableIterator<E> {
    return this.buffer.reverseIterator();
  }
}
