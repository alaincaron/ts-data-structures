import { AbstractQueue } from './abstract_queue';
import { ContainerOptions, Predicate } from './types';
import { Deque } from './deque';
import { ArrayDeque } from './array_deque';
import { Collection } from './collection';

export type OverflowHandler = 'throw' | 'overwrite';

export interface CircularBufferOptions<E> extends ContainerOptions<E> {
  overflowHandler?: OverflowHandler;
}
export class CircularBuffer<E> extends AbstractQueue<E> {
  private readonly deque: Deque<E>;
  private readonly _overflowHandler: OverflowHandler;

  constructor(initializer?: number | CircularBufferOptions<E> | CircularBuffer<E>) {
    super();
    if (initializer instanceof CircularBuffer) {
      this.deque = initializer.deque.clone();
      this._overflowHandler = initializer._overflowHandler;
    } else {
      this.deque = new ArrayDeque(initializer);
      this._overflowHandler = (initializer as CircularBufferOptions<E>)?.overflowHandler ?? 'throw';
    }
  }

  overflowHandler(): OverflowHandler {
    return this._overflowHandler;
  }

  size(): number {
    return this.deque.size();
  }

  capacity(): number {
    return this.deque.capacity();
  }

  clear(): void {
    this.deque.clear();
  }

  offer(item: E) {
    if (this.isFull()) {
      if (this._overflowHandler === 'overwrite' && !this.isEmpty()) {
        this.poll();
      } else {
        return false;
      }
    }

    return this.deque.offer(item);
  }

  poll() {
    return this.deque.poll();
  }

  peek() {
    return this.deque.peek();
  }

  offerFully<E1 extends E>(items: E1[] | Collection<E1>): number {
    if (this._overflowHandler !== 'overwrite') return super.offerFully(items);
    return this.offerPartially(items);
  }

  addFully<E1 extends E>(items: E1[] | Collection<E1>): number {
    if (this._overflowHandler !== 'overwrite') return super.addFully(items);
    return this.addPartially(items);
  }

  filter(predicate: Predicate<E>) {
    return this.deque.filter(predicate);
  }

  removeMatchingItem(predicate: Predicate<E>) {
    return this.deque.removeMatchingItem(predicate);
  }

  iterator() {
    return this.deque.iterator();
  }

  [Symbol.iterator]() {
    return this.deque[Symbol.iterator]();
  }

  clone() {
    return new CircularBuffer(this);
  }
}
