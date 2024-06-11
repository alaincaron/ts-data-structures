import { Comparator, Comparators } from 'ts-fluent-iterators';
import { IndexOutOfBoundsException } from './exceptions';
import { insertionSort } from './insertion_sort';
import { parseArgs } from './parse_args';

const PSEUDO_MED_THRESH_3 = 15; // threshold for pseudo-median 3.
const PSEUDO_MED_THRESH_9 = 45; // threshold for pseudo-median 9 .
const INSERTION_THRESH = 15; // threshold for insertion sort.

/**
 * Sorts (using quicksort) an array according to the comparator.
 *
 * @param arr       List to be sorted.
 * @param comparator Comparator used to compare items in the array.
 */
export function qsort<E>(arr: E[]): E[];
export function qsort<E>(arr: E[], arg2: number | Comparator<E> | undefined): E[];
export function qsort<E>(arr: E[], left: number, arg3: number | Comparator<E> | undefined): E[];
export function qsort<E>(arr: E[], left: number, right: number, comparator: Comparator<E> | undefined): E[];

export function qsort<E>(
  arr: E[],
  arg2?: number | Comparator<E>,
  arg3?: number | Comparator<E>,
  arg4?: Comparator<E>
): E[] {
  const { left, right, f: comparator } = parseArgs(arr.length, arg2, arg3, arg4, Comparators.natural);

  qsort1(arr, comparator, left, right - 1);
  return arr;
}

function qsort1<E>(arr: E[], comparator: Comparator<E>, low: number, high: number) {
  for (;;) {
    const n = high - low + 1;
    if (n < INSERTION_THRESH) {
      insertionSort(arr, low, high + 1, comparator);
      return;
    }
    const pivot = pseudoMedian0(arr, comparator, low, high);

    // Semi-standard quicksort partitioning/swapping

    let i = low;
    let j = high;
    do {
      while (comparator(arr[i], pivot) < 0) ++i;
      while (comparator(pivot, arr[j]) < 0) --j;
      if (i < j) {
        const p = arr[i];
        arr[i++] = arr[j];
        arr[j--] = p;
      }
    } while (i < j);

    // Look at sizes of the two partitions, do the smaller one first by
    // recursion, then do the larger one by iteration.

    if (j - low > high - i) {
      // the left part should be done iteratively
      qsort1(arr, comparator, i, high);

      // set the high bound for the next iteration
      high = j;
    } else {
      // the right part should be done iteratively.
      qsort1(arr, comparator, low, j);

      // set the low bound for the next iteration
      low = i;
    }
  }
}

export function toQSorted<E>(arr: E[]): E[];
export function toQSorted<E>(arr: E[], arg2: number | Comparator<E> | undefined): E[];
export function toQSorted<E>(arr: E[], left: number, arg3: number | Comparator<E> | undefined): E[];
export function toQSorted<E>(arr: E[], left: number, right: number, comparator: Comparator<E> | undefined): E[];

export function toQSorted<E>(
  arr: E[],
  arg2?: number | Comparator<E>,
  arg3?: number | Comparator<E>,
  arg4?: Comparator<E>
): E[] {
  const { left, right, f: comparator } = parseArgs(arr.length, arg2, arg3, arg4, Comparators.natural);

  const tmp = arr.slice(left, right);
  qsort1(tmp, comparator, 0, tmp.length - 1);
  return tmp;
}

export function median<E>(arr: E[], comparator?: Comparator<E>) {
  return select(arr, Math.floor(arr.length / 2), comparator);
}

export function pseudoMedian<E>(arr: E[], comparator: Comparator<E> = Comparators.natural) {
  return pseudoMedian0(arr, comparator, 0, arr.length - 1);
}

/**
 * Locates the k-th element in the list according to specified comparator
 *
 * @param arr
 *         The array on which the k-th element is to be found.  The array is modified by this function.  To avoid modifying the array, clonet it before passing it to this function.
 * @param k
 *         The position of the element to locate.
 */
export function select<E>(arr: E[], k: number, comparator: Comparator<E> = Comparators.natural) {
  if (k < 0 || k >= arr.length) {
    throw new IndexOutOfBoundsException(`Index out of range: ${k}`);
  }
  return select0(arr, k, comparator);
}

function select0<E>(arr: E[], k: number, comparator: Comparator<E>) {
  let low = 0;
  let high = arr.length - 1;

  while (low < high) {
    const pivot = pseudoMedian0(arr, comparator, low, high);

    let i = low;
    let j = high;

    while (i < j) {
      if (comparator(arr[i], pivot) >= 0) {
        const p = arr[i];
        arr[i] = arr[j];
        arr[j--] = p;
      } else {
        ++i;
      }
    }

    if (comparator(arr[i], pivot) > 0) {
      --i;
    }

    if (k <= i) {
      high = i;
    } else {
      low = i + 1;
    }
  }
  return arr[k];
}

function pseudoMedian0<E>(arr: E[], comparator: Comparator<E>, low: number, high: number) {
  const n = high - low + 1;
  const mid = (low + high) >> 1;
  if (n >= PSEUDO_MED_THRESH_9) {
    /* On big arrays, pseudo-median of 9 */
    const d = n >> 3;
    const d2 = n >> 2;
    const med1 = pseudoMed3(arr[low], arr[low + d], arr[low + d2], comparator);
    const med2 = pseudoMed3(arr[mid - d], arr[mid], arr[mid + d], comparator);
    const med3 = pseudoMed3(arr[high - d2], arr[high - d], arr[high], comparator);
    return pseudoMed3(med1, med2, med3, comparator);
  }
  if (n >= PSEUDO_MED_THRESH_3) {
    return pseudoMed3(arr[low], arr[mid], arr[high], comparator);
  }
  return arr[mid];
}

function pseudoMed3<E>(a: E, b: E, c: E, comparator: Comparator<E>) {
  if (comparator(a, b) < 0) {
    if (comparator(b, c) < 0) {
      return b;
    }
    if (comparator(a, c) < 0) {
      return c;
    }
    return a;
  }
  if (comparator(a, c) < 0) {
    return a;
  }
  if (comparator(b, c) < 0) {
    return c;
  }
  return b;
}
