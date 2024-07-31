import { Comparator, Comparators } from 'ts-fluent-iterators';
import { parseArgs } from './parse_args';

export function shellSort<T>(arr: T[]): T[];
export function shellSort<T>(arr: T[], arg2: number | Comparator<T> | undefined): T[];
export function shellSort<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): T[];
export function shellSort<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): T[];

export function shellSort<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): T[] {
  const { left, right, f: comparator } = parseArgs(arr.length, arg2, arg3, arg4, Comparators.natural);
  let gap = (right - left) >> 1;

  while (gap > 0) {
    for (let i = left + gap; i < right; ++i) {
      const tmp = arr[i];
      let j = i;
      while (j >= left + gap && comparator(arr[j - gap], tmp) > 0) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = tmp;
    }
    gap >>= 1;
  }
  return arr;
}
