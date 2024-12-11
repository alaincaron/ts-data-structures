import { Comparator, Comparators } from 'ts-fluent-iterators';

export function heapifyUp<E>(arr: E[], child: number, comparator: Comparator<E>): boolean {
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

function parseArgs<E>(arr: E[], arg3?: number | Comparator<E>, arg4?: Comparator<E>) {
  let comparator: Comparator<E> = Comparators.natural;
  let size: number = arr.length;
  switch (typeof arg3) {
    case 'function':
      comparator = arg3;
      break;
    case 'number':
      size = arg3;
      break;
  }
  if (arg4) {
    comparator = arg4;
  }
  return { size, comparator };
}

export function heapifyDown<E>(arr: E[], parent: number): boolean;
export function heapifyDown<E>(arr: E[], parent: number, size: number): boolean;
export function heapifyDown<E>(arr: E[], parent: number, comparator: Comparator<E>): boolean;
export function heapifyDown<E>(arr: E[], parent: number, size: number, comparator: Comparator<E>): boolean;

export function heapifyDown<E>(arr: E[], parent: number, arg3?: number | Comparator<E>, arg4?: Comparator<E>): boolean {
  const { comparator, size } = parseArgs(arr, arg3, arg4);
  let modified = false;
  while (true) {
    const leftChild = (parent << 1) + 1;
    const rightChild = leftChild + 1;
    let smallest = parent;

    if (leftChild < size && comparator(arr[leftChild], arr[smallest]) < 0) {
      smallest = leftChild;
    }

    if (rightChild < size && comparator(arr[rightChild], arr[smallest]) < 0) {
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

export function heapify<E>(arr: E[]): void;
export function heapify<E>(arr: E[], size: number): void;
export function heapify<E>(arr: E[], comparator: Comparator<E>): void;
export function heapify<E>(arr: E[], size: number, comparator: Comparator<E>): void;

export function heapify<E>(arr: E[], arg3?: number | Comparator<E>, arg4?: Comparator<E>): void {
  const { size, comparator } = parseArgs(arr, arg3, arg4);
  for (let i = (size >> 1) - 1; i >= 0; --i) heapifyDown(arr, i, size, comparator);
}

export function swap<E>(arr: E[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function isHeap<E>(arr: E[]): boolean;
export function isHeap<E>(arr: E[], size: number): boolean;
export function isHeap<E>(arr: E[], comparator: Comparator<E>): boolean;
export function isHeap<E>(arr: E[], size: number, comparator: Comparator<E>): boolean;

export function isHeap<E>(arr: E[], arg3?: number | Comparator<E>, arg4?: Comparator<E>): boolean {
  const { size, comparator } = parseArgs(arr, arg3, arg4);

  let parent = 0;
  let leftChild;
  while ((leftChild = (parent << 1) + 1) < size) {
    const rightChild = leftChild + 1;

    if (comparator(arr[leftChild], arr[parent]) < 0) {
      return false;
    }

    if (rightChild < size && comparator(arr[rightChild], arr[parent]) < 0) {
      return false;
    }
    ++parent;
  }
  return true;
}
