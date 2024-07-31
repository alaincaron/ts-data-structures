import { Comparator, Comparators } from 'ts-fluent-iterators';
import { insertionSort } from './insertion_sort';
import { parseArgs } from './parse_args';

const INSERTION_SORT_THRESHOLD = 15;

export function mergeSort<T>(arr: T[]): T[];
export function mergeSort<T>(arr: T[], arg2: number | Comparator<T> | undefined): T[];
export function mergeSort<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): T[];
export function mergeSort<T>(arr: T[], left: number, right: number, comparator: Comparator<T> | undefined): T[];

export function mergeSort<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): T[] {
  const { left, right, f: comparator } = parseArgs(arr.length, arg2, arg3, arg4, Comparators.natural);
  const n = right - left;
  if (n <= INSERTION_SORT_THRESHOLD) return insertionSort(arr, left, right, comparator);
  const tmp = mergeSort0(arr, left, right, comparator);
  arr.splice(left, n, ...tmp);
  return arr;
}

function mergeArrays<T>(left: T[], right: T[], comparator: Comparator<T>): T[] {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (comparator(left[i], right[j]) < 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

function sortArray<T>(arr: T[], comparator: Comparator<T>): T[] {
  if (arr.length <= INSERTION_SORT_THRESHOLD) return insertionSort(arr, 0, arr.length, comparator);
  return mergeSort0(arr, 0, arr.length, comparator);
}

function mergeSort0<T>(arr: T[], left: number, right: number, comparator: Comparator<T>): T[] {
  const mid = left + Math.floor((right - left) / 2);
  const leftArray = sortArray(arr.slice(left, mid), comparator);
  const rightArray = sortArray(arr.slice(mid, right), comparator);
  return mergeArrays(leftArray, rightArray, comparator);
}
