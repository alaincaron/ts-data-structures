import { ContainerOptions, Predicate } from '../utils';
import { Deque, ArrayDeque } from '../deques';
import { AbstractStack } from './abstract_stack';

export class ArrayStack<E> extends AbstractStack<E> {
  private readonly buffer: Deque<E>;

  constructor(initializer?: number | ArrayStack<E> | ContainerOptions<E>) {
    super();
    if (initializer == null) {
      this.buffer = new ArrayDeque<E>();
    } else if (typeof initializer === 'number') {
      this.buffer = new ArrayDeque(initializer);
    } else if (initializer instanceof ArrayStack) {
      this.buffer = initializer.buffer.clone();
    } else {
      const options = initializer as ContainerOptions<E>;
      this.buffer = new ArrayDeque<E>(options);
    }
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
    return new ArrayStack(this);
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
