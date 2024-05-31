import { Comparator, Comparators } from 'ts-fluent-iterators';
import { insertionSort, toInsertionSorted } from './insertion_sort';
import { parseArgs } from './parse_args';

export function toMergeSorted<T>(arr: T[]): T[];
export function toMergeSorted<T>(arr: T[], arg2: number | Comparator<T> | undefined): T[];
export function toMergeSorted<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): T[];
export function toMergeSorted<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): T[];

export function toMergeSorted<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): T[] {
  const { left, right, f: compare } = parseArgs(arr, arg2, arg3, arg4, Comparators.natural);
  const n = right - left;
  if (n <= 5) return toInsertionSorted(arr, left, right, compare);
  return toMergeSorted0(arr, left, right, compare);
}

export function mergeSort<T>(arr: T[]): T[];
export function mergeSort<T>(arr: T[], arg2: number | Comparator<T> | undefined): T[];
export function mergeSort<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): T[];
export function mergeSort<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): T[];

export function mergeSort<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): T[] {
  const { left, right, f: compare } = parseArgs(arr, arg2, arg3, arg4, Comparators.natural);
  const n = right - left;
  if (n <= 5) return insertionSort(arr, left, right, compare);
  const tmp = toMergeSorted0(arr, left, right, compare);
  arr.splice(left, n, ...tmp);
  return arr;
}

function mergeArrays<T>(left: T[], right: T[], compare: Comparator<T>): T[] {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) < 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

function sortArray<T>(arr: T[], compare: Comparator<T>): T[] {
  if (arr.length <= 5) return insertionSort(arr, 0, arr.length, compare);
  return toMergeSorted0(arr, 0, arr.length, compare);
}

function toMergeSorted0<T>(arr: T[], left: number, right: number, compare: Comparator<T>): T[] {
  const mid = left + Math.floor((right - left) / 2);
  const leftArray = sortArray(arr.slice(left, mid), compare);
  const rightArray = sortArray(arr.slice(mid, right), compare);
  return mergeArrays(leftArray, rightArray, compare);
}
