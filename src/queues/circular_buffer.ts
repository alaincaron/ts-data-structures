import { AbstractQueue } from './abstract_queue';
import { Predicate } from '../utils';
import { Deque, ArrayDeque } from '../deques';
import { Collection, CollectionInitializer, CollectionOptions } from '../collections';

export type OverflowHandler = 'throw' | 'overwrite';

export interface CircularBufferOptions<E> extends CollectionOptions<E> {
  overflowHandler?: OverflowHandler;
}
export class CircularBuffer<E> extends AbstractQueue<E> {
  private readonly deque: Deque<E>;
  private readonly _overflowHandler: OverflowHandler;

  protected constructor(options?: number | CircularBufferOptions<E>) {
    super(options);
    this.deque = ArrayDeque.create(options);
    this._overflowHandler = (options as CircularBufferOptions<E>)?.overflowHandler ?? 'throw';
  }

  static create<E>(initializer?: number | (CircularBufferOptions<E> & CollectionInitializer<E>)) {
    return AbstractQueue.buildCollection<E, CircularBuffer<E>, CircularBufferOptions<E>, CollectionInitializer<E>>(
      options => new CircularBuffer(options),
      initializer
    );
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

  clone(): CircularBuffer<E> {
    return CircularBuffer.create({ initial: this });
  }

  buildOptions(): CircularBufferOptions<E> {
    return {
      ...super.buildOptions(),
      overflowHandler: this.overflowHandler(),
    };
  }
}
