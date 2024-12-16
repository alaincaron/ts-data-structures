import { Predicate } from 'ts-fluent-iterators';
import { Deque } from './deque';
import { DequeIterator } from './deque_interface';
import { buildCollection, CollectionInitializer } from '../collections';
import { QueueOptions } from '../queues';
import { nextPowerOfTwo, WithCapacity } from '../utils';

/*
 * The minimum capacity that we'll use for a newly created deque.
 * Must be a power of 2.
 */
const MIN_INITIAL_CAPACITY = 8;

export class ArrayDeque<E> extends Deque<E> {
  private buffer: Array<E>;
  private head: number;
  private tail: number;

  constructor(options?: QueueOptions) {
    super(options);
    this.head = this.tail = 0;
    this.buffer = this.allocateBuffer(MIN_INITIAL_CAPACITY);
  }

  static create<E>(initializer?: WithCapacity<QueueOptions & CollectionInitializer<E>>): ArrayDeque<E> {
    return buildCollection<E, ArrayDeque<E>, QueueOptions>(ArrayDeque, initializer);
  }

  private nextArraySize(numElements: number) {
    if (numElements <= MIN_INITIAL_CAPACITY) return MIN_INITIAL_CAPACITY;
    return nextPowerOfTwo(numElements);
  }

  private allocateBuffer(numElements: number) {
    return new Array(this.nextArraySize(numElements));
  }

  /**
   * Double the size of this buffer.  Call only when full, i.e.,
   * when head and tail have wrapped around to become equal.
   */
  private doubleBufferSize() {
    if (this.head !== this.tail) throw new Error('Assertion failed');
    const h = this.head;
    const n = this.buffer.length;
    const r = this.buffer.length - h;
    const newSize = n << 1;
    if (newSize <= 0) throw new Error('Sorry, deque too big');
    const a = new Array<E>(newSize);
    for (let i = h; i < n; ++i) a[i - h] = this.buffer[i];
    for (let i = 0; i < h; ++i) a[i + r] = this.buffer[i];
    this.buffer = a;
    this.head = 0;
    this.tail = n;
  }

  offerFirst(item: E): boolean {
    if (!this.isFull()) {
      this.buffer[(this.head = this.slot(this.head - 1))] = item;
      if (this.head === this.tail) this.doubleBufferSize();
      return true;
    }
    return false;
  }

  offerLast(item: E): boolean {
    if (!this.isFull()) {
      this.buffer[this.tail] = item;
      if ((this.tail = this.slot(this.tail + 1)) === this.head) this.doubleBufferSize();
      return true;
    }
    return false;
  }

  pollFirst(): E | undefined {
    const h = this.head;
    const result = this.buffer[h];
    if (result === undefined) return undefined;
    this.buffer[h] = undefined!; // Must null out slot
    this.head = this.slot(h + 1);
    return result;
  }

  pollLast(): E | undefined {
    const t = this.slot(this.tail - 1);
    const result = this.buffer[t];
    if (result === undefined) return undefined;
    this.buffer[t] = undefined!;
    this.tail = t;
    return result;
  }

  peekFirst(): E | undefined {
    return this.buffer[this.head];
  }

  peekLast(): E | undefined {
    return this.buffer[this.slot(this.tail - 1)];
  }

  // *** Collection Methods ***

  /**
   * Returns the number of buffer in this deque.
   *
   * @return the number of buffer in this deque
   */
  size(): number {
    return this.slot(this.tail - this.head);
  }

  /**
   * Returns <tt>true</tt> if this deque contains no buffer.
   *
   * @return <tt>true</tt> if this deque contains no buffer
   */
  isEmpty(): boolean {
    return this.head == this.tail;
  }

  /**
   * Removes all the buffer from this deque.
   * The deque will be empty after this call returns.
   */
  clear() {
    this.buffer = this.allocateBuffer(MIN_INITIAL_CAPACITY);
    this.head = this.tail = 0;
    return this;
  }

  clone(): ArrayDeque<E> {
    return ArrayDeque.create({ initial: this });
  }

  *[Symbol.iterator](): IterableIterator<E> {
    let cursor = this.head;
    while (cursor !== this.tail) {
      yield this.buffer[cursor]!;
      cursor = this.slot(cursor + 1);
    }
  }

  *reverseIterator(): IterableIterator<E> {
    let cursor = this.tail;
    while (cursor !== this.head) {
      const idx = this.slot(cursor - 1);
      yield this.buffer[idx]!;
      cursor = idx;
    }
  }

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined {
    let cursor = this.head;
    while (cursor !== this.tail) {
      const item = this.buffer[cursor]!;
      if (predicate(item)) {
        this.removeAtCursor(cursor);
        return item;
      }
      cursor = this.slot(cursor + 1);
    }
    return undefined;
  }

  removeLastMatchingItem(predicate: Predicate<E>): E | undefined {
    let cursor = this.tail;
    while (cursor !== this.head) {
      const idx = this.slot(cursor - 1);
      const item = this.buffer[idx]!;
      if (predicate(item)) {
        this.removeAtCursor(idx);
        return item;
      }
      cursor = idx;
    }
    return undefined;
  }

  filter(predicate: Predicate<E>): number {
    let cursor = this.head;
    let count = 0;
    while (cursor !== this.tail) {
      if (!predicate(this.buffer[cursor]!)) {
        this.buffer[cursor] = undefined!;
        ++count;
      }
      cursor = this.slot(cursor + 1);
    }
    if (count) this.compact();
    return count;
  }

  private slot(idx: number) {
    return idx & (this.buffer.length - 1);
  }

  private compact() {
    let shift = 0;
    while (this.head !== this.tail && this.buffer[this.head] === undefined) this.head = this.slot(this.head + 1);
    let cursor = this.head;
    while (cursor !== this.tail) {
      if (this.buffer[cursor] === undefined) {
        ++shift;
      } else if (shift > 0) {
        this.buffer[this.slot(cursor - shift)] = this.buffer[cursor];
        this.buffer[cursor] = undefined!;
      }
      cursor = this.slot(cursor + 1);
    }
    this.tail = this.slot(cursor - shift);
  }

  resize(newSize = 0) {
    const originalSize = this.size();
    if (newSize < originalSize) newSize = originalSize;
    newSize = this.nextArraySize(newSize);

    if (newSize == this.buffer.length && this.head === 0) return;
    const tmp = this.toArray();
    this.tail = tmp.length;
    this.head = 0;
    tmp.length = newSize;
    this.buffer = tmp;
  }

  private getQueueIterator(step: -1 | 1): DequeIterator<E> {
    let lastReturn = -1;
    let cursor = step === 1 ? this.head : this.tail;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        const stop = step === 1 ? this.tail : this.head;
        if (cursor === stop) {
          return { done: true, value: undefined };
        }
        if (step === 1) {
          lastReturn = cursor;
          cursor = this.slot(cursor + step);
        } else {
          cursor = this.slot(cursor + step);
          lastReturn = cursor;
        }
        return { done: false, value: this.buffer[lastReturn] };
      },
      setValue: (item: E) => {
        if (lastReturn === -1) throw new Error("Error invoking setValue: can't be invoked after remove");
        const oldValue = this.buffer[lastReturn];
        this.buffer[lastReturn] = item;
        return oldValue;
      },
      remove: () => {
        if (lastReturn === -1) throw new Error('Error invoking remove: Can only be done once per iteration');
        const value = this.buffer[lastReturn];
        cursor = this.updateCursorAfterRemoval(lastReturn, this.removeAtCursor(lastReturn), step);
        lastReturn = -1;
        return value;
      },
    };
  }

  removeAtCursor(cursor: number) {
    const left = cursor - this.head + 1;
    const right = this.tail - cursor;
    if (left <= right) {
      while (cursor != this.head) {
        const new_cursor = this.slot(cursor - 1);
        this.buffer[cursor] = this.buffer[new_cursor];
        cursor = new_cursor;
      }
      this.buffer[cursor] = undefined!;
      this.head = this.slot(this.head + 1);
      return 'left';
    } else {
      let new_cursor = this.slot(cursor + 1);
      while (new_cursor !== this.tail) {
        this.buffer[cursor] = this.buffer[new_cursor];
        cursor = new_cursor;
        new_cursor = this.slot(cursor + 1);
      }
      this.tail = this.slot(this.tail - 1);
      this.buffer[this.tail] = undefined!;
      return 'right';
    }
  }

  private updateCursorAfterRemoval(lastReturn: number, partition: 'left' | 'right', step: -1 | 1): number {
    if (partition === 'left') {
      if (step === 1) {
        return lastReturn === this.slot(this.head - 1) ? this.head : this.slot(lastReturn + 1);
      }
      return this.slot(lastReturn + 1);
    }
    return lastReturn;
  }

  queueIterator() {
    return this.getQueueIterator(1);
  }

  reverseQueueIterator() {
    return this.getQueueIterator(-1);
  }
}
