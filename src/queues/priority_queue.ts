import { Comparator, Comparators, Predicate } from 'ts-fluent-iterators';
import { Queue, QueueOptions } from './queue';
import { buildCollection, CollectionInitializer } from '../collections';
import { nextPowerOfTwo, qsort, WithCapacity } from '../utils';
import { Heap } from '../utils/arrays';

export interface PriorityQueueOptions<E> extends QueueOptions {
  comparator?: Comparator<E>;
}

export type PriorityQueueInitializer<E> = PriorityQueueOptions<E> & CollectionInitializer<E>;

export class PriorityQueue<E> extends Queue<E> {
  private buffer: Array<E>;
  private _size: number;
  private readonly comparator: Comparator<E>;

  constructor(options?: PriorityQueueOptions<E>) {
    super(options);

    this._size = 0;
    if (options == null) {
      this.buffer = [];
    } else if (typeof options === 'number') {
      this.buffer = new Array(nextPowerOfTwo(options));
    } else {
      if (options.comparator) this.comparator = options.comparator;
      this.buffer = [];
    }
    this.comparator ??= Comparators.natural;
  }

  static create<E>(initializer?: WithCapacity<PriorityQueueOptions<E> & CollectionInitializer<E>>): PriorityQueue<E> {
    return buildCollection<E, PriorityQueue<E>, PriorityQueueOptions<E>>(PriorityQueue, initializer);
  }

  size(): number {
    return this._size;
  }

  offer(item: E) {
    if (this.isFull()) return false;
    if (this.buffer.length === this._size) this.buffer.length = nextPowerOfTwo(this._size + 1);
    this.buffer[this._size] = item;
    Heap.heapifyUp(this.buffer, this._size, this.comparator);
    ++this._size;
    return true;
  }

  peek(): E | undefined {
    if (this.isEmpty()) return undefined;
    return this.buffer[0];
  }

  poll(): E | undefined {
    if (this.isEmpty()) return undefined;
    const result = this.buffer[0];
    --this._size;
    this.buffer[0] = this.buffer[this._size];
    this.buffer[this._size] = undefined!;
    Heap.heapifyDown(this.buffer, 0, this._size, this.comparator);
    return result;
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    let i = 0;
    while (i < this._size && !predicate(this.buffer[i])) ++i;
    if (i >= this._size) return undefined;
    const item = this.buffer[i];
    --this._size;
    this.buffer[i] = undefined!;
    if (i < this._size) {
      Heap.swap(this.buffer, i, this._size);
      if (!Heap.heapifyUp(this.buffer, i, this.comparator))
        Heap.heapifyDown(this.buffer, i, this._size, this.comparator);
    }
    return item;
  }

  filter(predicate: Predicate<E>) {
    let i = 0;
    let count = 0;
    while (i < this._size) {
      const item = this.buffer[i];
      if (predicate(item)) {
        ++i;
      } else {
        ++count;
        --this._size;
        this.buffer[i] = undefined!;
        if (i < this._size) Heap.swap(this.buffer, i, this._size);
      }
    }
    if (count) Heap.heapify(this.buffer, this._size, this.comparator);
    return count;
  }

  clear() {
    this.buffer = [];
    this._size = 0;
    return this;
  }

  clone(): PriorityQueue<E> {
    return PriorityQueue.create({ initial: this });
  }

  buildOptions(): WithCapacity<PriorityQueueOptions<E>> {
    return {
      ...super.buildOptions(),
      comparator: this.comparator,
    };
  }

  *[Symbol.iterator](): IterableIterator<E> {
    qsort(this.buffer, 0, this._size, this.comparator);
    let cursor = 0;
    while (cursor < this._size) yield this.buffer[cursor++];
  }
}
