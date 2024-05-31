import { Comparator, Comparators } from 'ts-fluent-iterators';
import { parseArgs } from './parse_args';

export function toInsertionSorted<T>(arr: T[]): T[];
export function toInsertionSorted<T>(arr: T[], arg2: number | Comparator<T> | undefined): T[];
export function toInsertionSorted<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): T[];
export function toInsertionSorted<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): T[];

export function toInsertionSorted<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): T[] {
  const { left, right, f: compare } = parseArgs(arr, arg2, arg3, arg4, Comparators.natural);
  const result = arr.slice(left, right);
  return insertionSort(result, 0, result.length, compare);
}

export function insertionSort<T>(arr: T[]): T[];
export function insertionSort<T>(arr: T[], arg2: number | Comparator<T> | undefined): T[];
export function insertionSort<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): T[];
export function insertionSort<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): T[];

export function insertionSort<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): T[] {
  const { left, right, f: compare } = parseArgs(arr, arg2, arg3, arg4, Comparators.natural);
  let j: number;
  for (let p = left + 1; p < right; ++p) {
    const tmp = arr[p];
    for (j = p; j > left && compare(tmp, arr[j - 1]) < 0; --j) {
      arr[j] = arr[j - 1];
    }
    arr[j] = tmp;
  }
  return arr;
}
