import { Predicate } from 'ts-fluent-iterators';
import { AbstractStack } from './abstract_stack';
import { buildCollection, CollectionInitializer } from '../collections';
import { ArrayDeque } from '../deques';
import { QueueOptions } from '../queues';
import { WithCapacity } from '../utils';

export class ArrayStack<E> extends AbstractStack<E> {
  private readonly buffer: ArrayDeque<E>;

  constructor(options?: QueueOptions) {
    super(options);
    this.buffer = ArrayDeque.create(options);
  }

  static create<E>(initializer?: WithCapacity<QueueOptions & CollectionInitializer<E>>) {
    return buildCollection<E, ArrayStack<E>, QueueOptions>(ArrayStack, initializer);
  }

  size() {
    return this.buffer.size();
  }

  capacity() {
    return this.buffer.capacity();
  }

  clear() {
    this.buffer.clear();
    return this;
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

  buildOptions(): WithCapacity<QueueOptions> {
    return this.buffer.buildOptions();
  }

  clone(): ArrayStack<E> {
    return ArrayStack.create({ initial: this.buffer });
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    return this.buffer.removeLastMatchingItem(predicate);
  }

  filter(predicate: (item: E) => boolean) {
    return this.buffer.filter(predicate);
  }

  [Symbol.iterator](): IterableIterator<E> {
    return this.buffer.reverseIterator();
  }

  queueIterator() {
    return this.buffer.reverseQueueIterator();
  }

  reverseQueueIterator() {
    return this.buffer.queueIterator();
  }
}
