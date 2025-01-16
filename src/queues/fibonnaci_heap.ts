import { Comparator, Comparators, FluentIterator, Predicate } from 'ts-fluent-iterators';
import { AbstractQueue, QueueOptions } from './abstract_queue';
import { PriorityQueueOptions } from './priority_queue';
import { FluentQueueIterator, QueueIterator } from './queue';
import { buildCollection, CollectionInitializer } from '../collections';
import { HeapUtils, WithCapacity } from '../utils';

const arrayLenComparator = Comparators.byMapper((x: unknown[]) => x.length);

function arrayHeadComparator<E>(arr1: E[], arr2: E[]) {
  return Comparators.natural(arr1[0], arr2[0]);
}

export interface FibonacciHeapOptions<E> extends QueueOptions {
  comparator?: Comparator<E>;
}

export type FibonacciHeapInitializer<E> = FibonacciHeapOptions<E> & CollectionInitializer<E>;

export class FibonacciHeap<E> extends AbstractQueue<E> {
  private heaps: E[][] = [];
  private nodeCount: number = 0;
  private needsMerge: boolean = false;
  private readonly comparator: Comparator<E>;

  constructor(options?: FibonacciHeapOptions<E>) {
    super(options);
    this.comparator = options?.comparator ?? Comparators.natural;
  }

  clear() {
    this.heaps = [];
    this.nodeCount = 0;
    this.needsMerge = false;
    return this;
  }

  static create<E>(initializer?: WithCapacity<FibonacciHeapInitializer<E>>): FibonacciHeap<E> {
    return buildCollection<E, FibonacciHeap<E>, PriorityQueueOptions<E>>(FibonacciHeap, initializer);
  }

  private maxArraySize() {
    return Math.floor(Math.log2(this.nodeCount)) + 1;
  }

  private maxHeapSize() {
    return Math.floor(this.size() / this.maxArraySize()) + 1;
  }

  private heapWithMinLength() {
    return FluentIterator.from(this.heaps).min(arrayLenComparator);
  }

  offer(value: E): boolean {
    if (this.isFull()) return false;
    let heap = this.heapWithMinLength();
    if (!heap) {
      heap = [value];
      this.heaps.push(heap);
    } else {
      heap.push(value);
      HeapUtils.heapify(heap, this.comparator);
    }
    this.nodeCount++;
    if (heap.length > 1 && heap.length > this.maxHeapSize()) this.needsMerge = true;
    this.merge();
    return true;
  }

  peek(): E | undefined {
    const [minHeap] = this.doPeek();
    return minHeap?.[0];
  }

  private doPeek(): [E[] | undefined, number] {
    this.merge();
    if (this.isEmpty()) return [undefined, 0];
    return FluentIterator.from(this.heaps)
      .enumerate()
      .min((pair1, pair2) => arrayHeadComparator(pair1[0], pair2[0]))!;
  }

  poll(): E | undefined {
    const [minHeap, minIndex] = this.doPeek();
    if (!minHeap) return undefined;

    const minValue = HeapUtils.remove(minHeap, this.comparator);
    this.nodeCount--;

    if (minHeap.length === 0) {
      this.heaps.splice(minIndex, 1);
    }

    return minValue;
  }

  merge(force = false): void {
    let needMerge = this.needsMerge || force;
    let maxArraySize: number | undefined;
    if (!needMerge) {
      maxArraySize = this.maxArraySize();
      needMerge = this.heaps.length < maxArraySize || this.heaps.length > maxArraySize * 2;
    }
    if (needMerge) {
      this.mergeHeaps(maxArraySize);
      this.needsMerge = false;
    }
  }

  private mergeHeaps(maxArraySize?: number): void {
    const newHeaps: E[][] = Array.from({ length: maxArraySize ?? this.maxArraySize() }, () => []);
    let i = 0;
    for (const value of this) {
      newHeaps[i++].push(value);
      if (i === newHeaps.length) i = 0;
    }
    for (const heap of newHeaps) {
      HeapUtils.heapify(heap, this.comparator);
    }

    this.heaps = newHeaps;
  }

  size(): number {
    return this.nodeCount;
  }

  *[Symbol.iterator]() {
    for (const heap of this.heaps) {
      for (const value of heap) {
        yield value;
      }
    }
  }

  // Iterator function with removal capability
  private iterWithRemove(): QueueIterator<E> {
    const cursor = { heap: 0, idx: -1 };
    let lastCursor = { heap: -1, idx: -1 };

    const advance = () => {
      while (cursor.heap < this.heaps.length) {
        cursor.idx++;
        if (cursor.idx >= this.heaps[cursor.heap].length) {
          cursor.idx = -1;
          cursor.heap++;
          continue;
        }
        lastCursor = { ...cursor };
        return true;
      }
      return false;
    };

    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        const result = advance();
        if (!result) return { done: true, value: undefined };
        return { done: false, value: this.heaps[cursor.heap][cursor.idx]! };
      },
      remove: () => {
        if (lastCursor.heap === -1) throw new Error('Error invoking remove: Can only be done once per iteration');
        const value = this.heaps[cursor.heap][cursor.idx];
        lastCursor.heap = -1;
        const heap = this.heaps[cursor.heap];
        heap.splice(cursor.idx, 1);
        cursor.idx--;
        this.nodeCount--;
        this.needsMerge = true;
        if (heap.length === 0) {
          this.heaps.splice(cursor.heap, 1);
          cursor.idx = -1;
        }
        return value;
      },
    };
  }

  queueIterator() {
    return new FluentQueueIterator(this.iterWithRemove());
  }

  removeMatchingItem(predicate: Predicate<E>): E | undefined {
    const iterator = this.iterWithRemove();
    for (;;) {
      const item = iterator.next();
      if (item.done) break;
      if (predicate(item.value)) {
        return iterator.remove();
      }
    }
    return undefined;
  }

  clone() {
    return FibonacciHeap.create({ initial: this });
  }
}
