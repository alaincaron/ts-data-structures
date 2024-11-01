import { Comparator, Comparators, Functions, Mapper } from 'ts-fluent-iterators';

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

declare global {
  // eslint-disable-next-line
  interface Array<T> {
    bsearch<K = T>(e: K, options?: SearchOptions<T, K>): number;
    insertSorted(e: T): T[];
  }
}

Array.prototype.bsearch = function <T, K = T>(e: K, options?: SearchOptions<T, K>) {
  return bsearch(this, e, options);
};

Array.prototype.insertSorted = function <T>(e: T, comparator?: Comparator<T>) {
  return insertSorted(this, e, comparator);
};
