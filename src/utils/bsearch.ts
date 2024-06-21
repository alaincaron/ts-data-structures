import { Comparator, Comparators } from 'ts-fluent-iterators';
import { parseArgs } from './parse_args';

export function bsearch<T>(arr: T[], e: T, compare: Comparator<T> = Comparators.natural): number {
  let m = 0;
  let n = arr.length - 1;
  while (m <= n) {
    const k = (n + m) >> 1;
    const cmp = compare(e, arr[k]);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return ~m;
}

export function insertSorted<T>(arr: T[], e: T, compare: Comparator<T> = Comparators.natural): T[] {
  let idx = bsearch(arr, e, compare);
  if (idx < 0) idx = ~idx;
  arr.splice(idx, 0, e);
  return arr;
}

export function isOrdered<T>(arr: T[]): boolean;
export function isOrdered<T>(arr: T[], arg2: number | Comparator<T> | undefined): boolean;
export function isOrdered<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): boolean;
export function isOrdered<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): boolean;

export function isOrdered<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): boolean {
  const { left, right, f: comparator } = parseArgs(arr.length, arg2, arg3, arg4, Comparators.natural);
  if (right - left < 2) return true;
  for (let idx = left + 1; idx < right; ++idx) {
    if (comparator(arr[idx - 1], arr[idx]) > 0) return false;
  }
  return true;
}

export function isStrictlyOrdered<T>(arr: T[]): boolean;
export function isStrictlyOrdered<T>(arr: T[], arg2: number | Comparator<T> | undefined): boolean;
export function isStrictlyOrdered<T>(arr: T[], left: number, arg3: number | Comparator<T> | undefined): boolean;
export function isStrictlyOrdered<T>(arr: T[], left: number, right: number, random: Comparator<T> | undefined): boolean;

export function isStrictlyOrdered<T>(
  arr: T[],
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
): boolean {
  const { left, right, f: comparator } = parseArgs(arr.length, arg2, arg3, arg4, Comparators.natural);
  if (right - left < 2) return true;
  for (let idx = left + 1; idx < right; ++idx) {
    if (comparator(arr[idx - 1], arr[idx]) >= 0) return false;
  }
  return true;
}

declare global {
  // eslint-disable-next-line
  interface Array<T> {
    bsearch(e: T, comparator?: Comparator<T>): number;
    insertSorted(e: T): T[];
    isOrdered(): boolean;
    isOrdered<T>(arg2: number | Comparator<T> | undefined): boolean;
    isOrdered<T>(left: number, arg3: number | Comparator<T> | undefined): boolean;
    isOrdered<T>(left: number, right: number, random: Comparator<T> | undefined): boolean;
    isOrdered<T>(arg2?: number | Comparator<T>, arg3?: number | Comparator<T>, arg4?: Comparator<T>): boolean;
    isStrictlyOrdered(): boolean;
    isStrictlyOrdered<T>(arg2: number | Comparator<T> | undefined): boolean;
    isStrictlyOrdered<T>(left: number, arg3: number | Comparator<T> | undefined): boolean;
    isStrictlyOrdered<T>(left: number, right: number, random: Comparator<T> | undefined): boolean;
    isStrictlyOrdered<T>(arg2?: number | Comparator<T>, arg3?: number | Comparator<T>, arg4?: Comparator<T>): boolean;
  }
}

Array.prototype.bsearch = function (e: unknown, comparator: Comparator<unknown>) {
  return bsearch(this, e, comparator);
};

Array.prototype.isOrdered = function (
  arg2?: number | Comparator<unknown>,
  arg3?: number | Comparator<unknown>,
  arg4?: Comparator<unknown>
) {
  return isOrdered(this, arg2 as number, arg3 as number, arg4 as Comparator<unknown>);
};

Array.prototype.isStrictlyOrdered = function (
  arg2?: number | Comparator<unknown>,
  arg3?: number | Comparator<unknown>,
  arg4?: Comparator<unknown>
) {
  return isStrictlyOrdered(this, arg2 as number, arg3 as number, arg4 as Comparator<unknown>);
};

Array.prototype.insertSorted = function (e: unknown) {
  return insertSorted(this, e);
};
