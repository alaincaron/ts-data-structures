import { Predicate } from '../utils';
import { Deque, ArrayDeque } from '../deques';
import { AbstractStack } from './abstract_stack';
import { CollectionInitializer, CollectionOptions } from '../collections';

export class ArrayStack<E> extends AbstractStack<E> {
  private readonly buffer: Deque<E>;

  protected constructor(options?: number | CollectionOptions<E>) {
    super(options);
    this.buffer = ArrayDeque.create(options);
  }

  static create<E>(initializer?: number | (CollectionOptions<E> & CollectionInitializer<E>)) {
    return AbstractStack.buildCollection<E, ArrayStack<E>, CollectionOptions<E>, CollectionInitializer<E>>(
      options => new ArrayStack(options),
      initializer
    );
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
    const options = this.buildOptions();
    return ArrayStack.create({ ...options, initial: { length: this.size(), seed: this.buffer.iterator() } });
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
