import { Comparator, Comparators } from 'ts-fluent-iterators';

export class Heap<E> {
  readonly data: E[];
  readonly comparator: Comparator<E>;

  constructor();
  constructor(arg1: E[] | Comparator<E>);
  constructor(arg1: E[], arg2: Comparator<E>);
  constructor(arg1?: E[] | Comparator<E>, arg2?: Comparator<E>) {
    if (Array.isArray(arg1)) {
      this.data = arg1;
    } else {
      this.data = [];
      if (typeof arg1 === 'function') this.comparator = arg1;
    }
    if (arg2) {
      this.comparator = arg2;
    } else {
      this.comparator = Comparators.natural;
    }
    this.heapify();
  }

  insert(item: E) {
    HeapUtils.insert(this.data, item, this.comparator);
  }

  remove(): E | undefined {
    return HeapUtils.remove(this.data, this.comparator);
  }

  heapify() {
    HeapUtils.heapify(this.data, this.comparator);
  }

  isHeap() {
    return HeapUtils.isHeap(this.data, this.comparator);
  }
}

export class HeapUtils {
  private constructor() {}

  static heapifyUp<E>(arr: E[], child: number, comparator: Comparator<E>): boolean {
    let modified = false;
    while (child > 0) {
      const parent = (child - 1) >> 1;
      if (comparator(arr[child], arr[parent]) >= 0) {
        break;
      }
      HeapUtils.swap(arr, child, parent);
      modified = true;
      child = parent;
    }
    return modified;
  }

  static heapifyDown<E>(
    arr: E[],
    parent: number,
    comparator: Comparator<E> = Comparators.natural,
    len: number = arr.length
  ): boolean {
    let modified = false;
    while (true) {
      const leftChild = (parent << 1) + 1;
      const rightChild = leftChild + 1;
      let smallest = parent;

      if (leftChild < len && comparator(arr[leftChild], arr[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < len && comparator(arr[rightChild], arr[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest === parent) {
        break;
      }

      HeapUtils.swap(arr, parent, smallest);
      modified = true;
      parent = smallest;
    }
    return modified;
  }

  static heapify<E>(arr: E[], comparator: Comparator<E> = Comparators.natural, len: number = arr.length): void {
    for (let i = (len >> 1) - 1; i >= 0; --i) HeapUtils.heapifyDown(arr, i, comparator);
  }

  static swap<E>(arr: E[], i: number, j: number) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  static isHeap<E>(arr: E[], comparator: Comparator<E> = Comparators.natural, len: number = arr.length): boolean {
    let parent = 0;
    for (;;) {
      const left = (parent << 1) + 1;
      if (left >= len) return true;
      if (comparator(arr[parent], arr[left]) > 0) return false;
      const right = left + 1;
      if (right < len && comparator(arr[parent], arr[right]) > 0) return false;
      ++parent;
    }
  }

  static remove<E>(arr: E[], comparator: Comparator<E>): E | undefined {
    if (arr.length <= 0) return undefined;
    const item = arr[0];
    arr[0] = arr[arr.length - 1];
    arr.splice(arr.length - 1, 1);
    HeapUtils.heapifyDown(arr, 0, comparator);
    return item;
  }

  static insert<E>(arr: E[], item: E, comparator: Comparator<E>): void {
    arr.splice(arr.length, 0, item);
    HeapUtils.heapifyUp(arr, arr.length - 1, comparator);
  }
}
