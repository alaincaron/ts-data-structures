import { BoundedDeque } from './abstract_deque';
import { QueueOptions } from '../queues';
import { CollectionInitializer, buildCollection } from '../collections';
import { nextPowerOfTwo, RandomAccess, IndexOutOfBoundsException } from '../utils';
import { Predicate } from 'ts-fluent-iterators';

/*
 * The minimum capacity that we'll use for a newly created deque.
 * Must be a power of 2.
 */
const MIN_INITIAL_CAPACITY = 8;

export class ArrayDeque<E = any> extends BoundedDeque<E> implements RandomAccess<E> {
  private elements: Array<E>;
  private head: number;
  private tail: number;

  constructor(options?: number | QueueOptions) {
    super(options);

    this.head = this.tail = 0;
    if (typeof options === 'number') {
      this.elements = this.allocateElements(options);
    } else {
      this.elements = this.allocateElements(MIN_INITIAL_CAPACITY);
    }
  }

  static create<E>(initializer?: number | (QueueOptions & CollectionInitializer<E>)): ArrayDeque<E> {
    return buildCollection<E, ArrayDeque<E>>(ArrayDeque, initializer);
  }

  private nextArraySize(numElements: number) {
    if (numElements <= MIN_INITIAL_CAPACITY) return MIN_INITIAL_CAPACITY;
    return nextPowerOfTwo(numElements);
  }

  private allocateElements(numElements: number) {
    return new Array(this.nextArraySize(numElements));
  }

  /**
   * Double the size of this buffer.  Call only when full, i.e.,
   * when head and tail have wrapped around to become equal.
   */
  private doubleBufferSize() {
    if (this.head !== this.tail) throw new Error('Assertion failed');
    const h = this.head;
    const n = this.elements.length;
    const r = this.elements.length - h;
    const newSize = n << 1;
    if (newSize <= 0) throw new Error('Sorry, deque too big');
    const a = new Array<E>(newSize);
    for (let i = h; i < n; ++i) a[i - h] = this.elements[i];
    for (let i = 0; i < h; ++i) a[i + r] = this.elements[i];
    this.elements = a;
    this.head = 0;
    this.tail = n;
  }

  offerFirst(item: E): boolean {
    if (!this.isFull()) {
      this.elements[(this.head = this.slot(this.head - 1))] = item;
      if (this.head === this.tail) this.doubleBufferSize();
      return true;
    }
    return false;
  }

  offerLast(item: E): boolean {
    if (!this.isFull()) {
      this.elements[this.tail] = item;
      if ((this.tail = this.slot(this.tail + 1)) === this.head) this.doubleBufferSize();
      return true;
    }
    return false;
  }

  pollFirst(): E | undefined {
    const h = this.head;
    const result = this.elements[h];
    if (result == null) return undefined;
    this.elements[h] = undefined!; // Must null out slot
    this.head = this.slot(h + 1);
    return result;
  }

  pollLast(): E | undefined {
    const t = this.slot(this.tail - 1);
    const result = this.elements[t];
    if (result == null) return undefined;
    this.elements[t] = undefined!;
    this.tail = t;
    return result;
  }

  getAt(idx: number): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    return this.elements[this.slot(this.head + idx)];
  }

  setAt(idx: number, item: E): E {
    if (idx < 0 || idx >= this.size()) throw new IndexOutOfBoundsException();
    const slot = this.slot(idx);
    const x = this.elements[slot];
    this.elements[slot] = item;
    return x;
  }

  peekFirst(): E | undefined {
    return this.elements[this.head];
  }

  peekLast(): E | undefined {
    return this.elements[this.slot(this.tail - 1)];
  }

  // *** Collection Methods ***

  /**
   * Returns the number of elements in this deque.
   *
   * @return the number of elements in this deque
   */
  size(): number {
    return this.slot(this.tail - this.head);
  }

  /**
   * Returns <tt>true</tt> if this deque contains no elements.
   *
   * @return <tt>true</tt> if this deque contains no elements
   */
  isEmpty(): boolean {
    return this.head == this.tail;
  }

  /**
   * Removes all of the elements from this deque.
   * The deque will be empty after this call returns.
   */
  clear() {
    if (this.head != this.tail) {
      this.elements = this.allocateElements(MIN_INITIAL_CAPACITY);
      this.head = this.tail = 0;
    }
  }

  clone(): ArrayDeque<E> {
    return ArrayDeque.create({ initial: this });
  }

  *[Symbol.iterator](): Iterator<E> {
    let cursor = this.head;
    while (cursor !== this.tail) {
      yield this.elements[cursor]!;
      cursor = this.slot(cursor + 1);
    }
  }

  *reverseIterator(): IterableIterator<E> {
    let cursor = this.tail;
    while (cursor !== this.head) {
      const idx = this.slot(cursor - 1);
      yield this.elements[idx]!;
      cursor = idx;
    }
  }

  removeFirstMatchingItem(predicate: Predicate<E>): E | undefined {
    let cursor = this.head;
    while (cursor !== this.tail) {
      const item = this.elements[cursor]!;
      if (predicate(item)) {
        this.elements[cursor] = undefined!;
        this.compact(cursor);
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
      const item = this.elements[idx]!;
      if (predicate(item)) {
        this.elements[idx] = undefined!;
        this.compact(idx);
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
      if (!predicate(this.elements[cursor]!)) {
        this.elements[cursor] = undefined!;
        ++count;
      }
      cursor = this.slot(cursor + 1);
    }
    if (count) this.compact();
    return count;
  }

  private slot(idx: number) {
    return idx & (this.elements.length - 1);
  }

  private compact(cursor?: number): number {
    let shift = 0;
    cursor ??= this.head;
    while (cursor !== this.tail) {
      if (this.elements[cursor] == null) {
        ++shift;
      } else if (shift > 0) {
        this.elements[this.slot(cursor - shift)] = this.elements[cursor];
        this.elements[cursor] = undefined!;
      }
      cursor = this.slot(cursor + 1);
    }
    this.tail = this.slot(cursor - shift);
    return shift;
  }
}
