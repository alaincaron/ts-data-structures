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
    insert(this.data, item, this.comparator);
  }

  remove(): E | undefined {
    return remove(this.data, this.comparator);
  }

  heapify() {
    heapify(this.data, this.comparator);
  }

  isHeap() {
    return isHeap(this.data, this.comparator);
  }
}

function heapifyUp<E>(arr: E[], child: number, comparator: Comparator<E>): boolean {
  let modified = false;
  while (child > 0) {
    const parent = (child - 1) >> 1;
    if (comparator(arr[child], arr[parent]) >= 0) {
      break;
    }
    swap(arr, child, parent);
    modified = true;
    child = parent;
  }
  return modified;
}

function heapifyDown<E>(arr: E[], parent: number, comparator: Comparator<E>): boolean {
  let modified = false;
  while (true) {
    const leftChild = (parent << 1) + 1;
    const rightChild = leftChild + 1;
    let smallest = parent;

    if (leftChild < arr.length && comparator(arr[leftChild], arr[smallest]) < 0) {
      smallest = leftChild;
    }

    if (rightChild < arr.length && comparator(arr[rightChild], arr[smallest]) < 0) {
      smallest = rightChild;
    }

    if (smallest === parent) {
      break;
    }

    swap(arr, parent, smallest);
    modified = true;
    parent = smallest;
  }
  return modified;
}

export function heapify<E>(arr: E[], comparator: Comparator<E> = Comparators.natural): void {
  for (let i = (arr.length >> 1) - 1; i >= 0; --i) heapifyDown(arr, i, comparator);
}

function swap<E>(arr: E[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function isHeap<E>(arr: E[], comparator: Comparator<E> = Comparators.natural): boolean {
  let parent = 0;
  for (;;) {
    const left = (parent << 1) + 1;
    if (left >= arr.length) return true;
    if (comparator(arr[parent], arr[left]) > 0) return false;
    const right = left + 1;
    if (right < arr.length && comparator(arr[parent], arr[right]) > 0) return false;
    ++parent;
  }
}

function remove<E>(arr: E[], comparator: Comparator<E>): E | undefined {
  if (arr.length <= 0) return undefined;
  const item = arr[0];
  arr[0] = arr[arr.length - 1];
  arr.splice(arr.length - 1, 1);
  heapifyDown(arr, 0, comparator);
  return item;
}

function insert<E>(arr: E[], item: E, comparator: Comparator<E>): void {
  arr.splice(arr.length, 0, item);
  heapifyUp(arr, arr.length - 1, comparator);
}
