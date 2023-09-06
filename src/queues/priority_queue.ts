import { AbstractQueue, QueueOptions } from './abstract_queue';
import { CollectionInitializer, AbstractCollection } from '../collections';
import { Comparator, Predicate, nextPowerOfTwo } from '../utils';

export interface PriorityQueueOptions<E> extends QueueOptions {
  comparator?: Comparator<E>;
}

export type PriorityQueueInitializer<E> = PriorityQueueOptions<E> & CollectionInitializer<E>;

export class PriorityQueue<E> extends AbstractQueue<E> {
  private buffer: Array<E>;
  private _size: number;
  private readonly comparator: Comparator<E>;

  protected constructor(options?: number | PriorityQueueOptions<E>) {
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
    this.comparator ??= (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  }

  static create<E>(initializer?: number | (PriorityQueueOptions<E> & CollectionInitializer<E>)): PriorityQueue<E> {
    return AbstractCollection.buildCollection<E, PriorityQueue<E>, PriorityQueueOptions<E>, CollectionInitializer<E>>(
      options => new PriorityQueue(options),
      initializer
    );
  }

  size(): number {
    return this._size;
  }

  offer(item: E) {
    if (this.isFull()) return false;
    if (this.buffer.length === this._size) this.buffer.length = nextPowerOfTwo(this._size + 1);
    this.buffer[this._size] = item;
    this.heapifyUp(this._size);
    ++this._size;
    return true;
  }

  private parent(index: number): number {
    return (index - 1) >> 1;
  }

  private leftChild(index: number): number {
    return (index << 1) + 1;
  }

  private swap(i: number, j: number) {
    const tmp = this.buffer[i];
    this.buffer[i] = this.buffer[j];
    this.buffer[j] = tmp;
  }

  private heapifyUp(child: number): boolean {
    let modified = false;
    while (child > 0) {
      const parent = this.parent(child);
      if (this.comparator(this.buffer[child], this.buffer[parent]) >= 0) {
        break;
      }
      this.swap(child, parent);
      modified = true;
      child = parent;
    }
    return modified;
  }

  private heapifyDown(parent: number): boolean {
    let modified = false;
    while (true) {
      const leftChild = this.leftChild(parent);
      const rightChild = leftChild + 1;
      let smallest = parent;

      if (leftChild < this._size && this.comparator(this.buffer[leftChild], this.buffer[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < this._size && this.comparator(this.buffer[rightChild], this.buffer[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest === parent) {
        break;
      }

      this.swap(parent, smallest);
      modified = true;
      parent = smallest;
    }
    return modified;
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
    this.heapifyDown(0);
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
      this.swap(i, this._size);
      this.heapifyUp(i) || this.heapifyDown(i);
    }
    return item;
  }

  filter(predicate: Predicate<E>): boolean {
    let i = 0;
    let modified = false;
    while (i < this._size) {
      const item = this.buffer[i];
      if (predicate(item)) {
        ++i;
      } else {
        modified = true;
        --this._size;
        this.buffer[i] = undefined!;
        if (i < this._size) this.swap(i, this._size);
      }
    }
    if (modified) this.heapify();
    return modified;
  }

  clear(): void {
    this.buffer = [];
    this._size = 0;
  }

  clone(): PriorityQueue<E> {
    return PriorityQueue.create({ initial: this });
  }

  buildOptions(): PriorityQueueOptions<E> {
    return {
      ...super.buildOptions(),
      comparator: this.comparator,
    };
  }

  *[Symbol.iterator](): IterableIterator<E> {
    let cursor = 0;
    while (cursor < this._size) yield this.buffer[cursor++];
    return this.iterator();
  }

  iterator(): IterableIterator<E> {
    return this[Symbol.iterator]();
  }

  private heapify() {
    for (let i = (this._size >> 1) - 1; i >= 0; --i) this.heapifyDown(i);
  }
}
