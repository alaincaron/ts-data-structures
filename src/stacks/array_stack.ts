import { Predicate } from 'ts-fluent-iterators';
import { ArrayDeque } from '../deques';
import { AbstractStack } from './abstract_stack';
import { CollectionInitializer, buildCollection } from '../collections';
import { ContainerOptions } from '../utils';

export class ArrayStack<E = any> extends AbstractStack<E> {
  private readonly buffer: ArrayDeque<E>;

  constructor(options?: number | ContainerOptions) {
    super(options);
    this.buffer = ArrayDeque.create(options);
  }

  static create<E>(initializer?: number | (ContainerOptions & CollectionInitializer<E>)) {
    return buildCollection<E, ArrayStack<E>>(options => new ArrayStack(options), initializer);
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

  buildOptions() {
    return this.buffer.buildOptions();
  }

  clone(): ArrayStack<E> {
    return buildCollection<E, ArrayStack<E>>(options => new ArrayStack(options), {
      initial: this.buffer,
    });
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
}
