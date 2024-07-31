import { Comparator, Comparators, Functions, Mapper } from 'ts-fluent-iterators';
import { parseArgs } from './parse_args';

export interface SearchOptions<T, K = T> {
  mapper?: Mapper<T, K>;
  comparator?: Comparator<K>;
}

export function bsearch<T, K = T>(arr: T[], e: K, { mapper, comparator }: SearchOptions<T, K> = {}): number {
  mapper ??= Functions.identity() as unknown as Mapper<T, K>;
  comparator ??= Comparators.natural;
  let m = 0;
  let n = arr.length - 1;
  while (m <= n) {
    const k = (n + m) >> 1;
    const cmp = comparator(e, mapper(arr[k]));
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

export function insertSorted<T>(arr: T[], e: T, comparator?: Comparator<T>): T[] {
  let idx = bsearch(arr, e, { comparator });
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
    bsearch<K = T>(e: K, options?: SearchOptions<T, K>): number;
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

Array.prototype.bsearch = function <T, K = T>(e: K, options?: SearchOptions<T, K>) {
  return bsearch(this, e, options);
};

Array.prototype.isOrdered = function <T>(
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
) {
  return isOrdered(this, arg2 as number, arg3 as number, arg4 as Comparator<T>);
};

Array.prototype.isStrictlyOrdered = function <T>(
  arg2?: number | Comparator<T>,
  arg3?: number | Comparator<T>,
  arg4?: Comparator<T>
) {
  return isStrictlyOrdered(this, arg2 as number, arg3 as number, arg4 as Comparator<T>);
};

Array.prototype.insertSorted = function <T>(e: T, comparator?: Comparator<T>) {
  return insertSorted(this, e, comparator);
};
